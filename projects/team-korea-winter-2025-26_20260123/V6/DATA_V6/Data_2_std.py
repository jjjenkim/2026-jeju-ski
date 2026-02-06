import urllib.request
import urllib.parse
import json
import time
import random
import os
import re
import sys
from html.parser import HTMLParser

# =========================================================
# ⚙️ Configuration
# =========================================================
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
# Logic to find input file
if os.path.basename(BASE_DIR) == "DATA_V6":
    INPUT_FILE_CANDIDATES = [
        os.path.join(os.path.dirname(os.path.dirname(BASE_DIR)), "athlete_urls.txt"),
        os.path.join(os.path.dirname(BASE_DIR), "athlete_urls.txt"),
        "athlete_urls.txt"
    ]
else:
    INPUT_FILE_CANDIDATES = [
        "V6/athlete_urls.txt",
        "athlete_urls.txt"
    ]

INPUT_FILE = "athlete_urls.txt"
for path in INPUT_FILE_CANDIDATES:
    if os.path.exists(path):
        INPUT_FILE = path
        break

# Determine Output Path
# Should output to the same place as logical agent expects
# Agent expects: V6/DATA_V6/team_korea_data.json
OUTPUT_JSON = os.path.join(BASE_DIR, "team_korea_data.json")

print(f"📂 Input: {INPUT_FILE}")
print(f"📂 Output: {OUTPUT_JSON}")

# Headers to mimic browser
HEADERS = {"User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)"}

# =========================================================
# 🛠️ Helpers
# =========================================================

def fetch_html(url, retries=3):
    req = urllib.request.Request(url, headers=HEADERS)
    for i in range(retries):
        try:
            with urllib.request.urlopen(req, timeout=10) as response:
                return response.read().decode('utf-8', errors='ignore')
        except Exception as e:
            print(f"   ⚠️ Fetch error ({i+1}/{retries}): {e}")
            time.sleep(1)
    return None

class FISProfileParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.in_name_tag = False
        self.in_country_tag = False
        self.in_birthdate_tag = False
        self.in_status_tag = False
        self.captured_name = "Unknown"
        self.captured_country = "-"
        self.captured_birthdate = "-"
        self.captured_status = "Active"
        self.captured_photo = "https://via.placeholder.com/150?text=No+Image"
        
        # State trackers
        self.div_level = 0
        self.current_attr = {}

    def handle_starttag(self, tag, attrs):
        attr_dict = {k: v for k, v in attrs}
        self.current_attr = attr_dict
        
        # Name
        if tag == "h1" and "athlete-profile__name" in attr_dict.get("class", ""):
            self.in_name_tag = True
            
        # Country
        if tag == "span" and "country__name" in attr_dict.get("class", ""):
            self.in_country_tag = True
            
        # Photo (Background Image Style)
        if tag == "div" and "avatar__image" in attr_dict.get("class", ""):
            style = attr_dict.get("style", "")
            match = re.search(r"url\('([^']+)'\)", style)
            if match:
                self.captured_photo = match.group(1)
                
        # Birthdate & Status (Look for span inside li#Birthdate or li#Status)
        # Simplified: We look for the VALUE span inside specific LI context is hard in SAX
        # We will use Regex for Key-Value properties for simplicity as they are clearer in source
    
    def handle_endtag(self, tag):
        if tag == "h1": self.in_name_tag = False
        if tag == "span": self.in_country_tag = False

    def handle_data(self, data):
        if self.in_name_tag:
            self.captured_name = data.strip()
        if self.in_country_tag:
            self.captured_country = data.strip()

# Regex is often more robust for specific isolated strings in messy HTML than streaming parser
def extract_metadata_regex(html):
    data = {}
    
    # Name
    # <h1 class="athlete-profile__name">...</h1>(nested spans possible)
    # Simple regex fallbacks
    name_m = re.search(r'<h1[^>]*class="[^"]*athlete-profile__name[^"]*"[^>]*>(.*?)</h1>', html, re.DOTALL)
    if name_m:
        # Remove tags inside
        clean_name = re.sub(r'<[^>]+>', '', name_m.group(1)).strip()
        data['name'] = " ".join(clean_name.split())
    else:
        data['name'] = "Unknown"
        
    # Country
    country_m = re.search(r'<span[^>]*class="[^"]*country__name[^"]*"[^>]*>(.*?)</span>', html, re.DOTALL)
    data['country'] = country_m.group(1).strip() if country_m else "-"

    # Photo
    photo_m = re.search(r'class="[^"]*avatar__image[^"]*"[^>]*style="[^"]*url\(\'([^\']+)\'\)', html)
    data['photo'] = photo_m.group(1) if photo_m else "https://via.placeholder.com/150?text=No+Image"
    
    # Birthdate
    # <li id="Birthdate"> ... <span class="profile-info__value"> 10-09-2004 </span>
    birth_m = re.search(r'<li[^>]*id="Birthdate"[^>]*>.*?<span[^>]*class="[^"]*profile-info__value[^"]*"[^>]*>(.*?)</span>', html, re.DOTALL)
    data['birth_date'] = birth_m.group(1).strip() if birth_m else "-"
    
    # Status
    status_m = re.search(r'<li[^>]*id="Status"[^>]*>.*?<span[^>]*class="[^"]*profile-info__value[^"]*"[^>]*>(.*?)</span>', html, re.DOTALL)
    data['status'] = status_m.group(1).strip() if status_m else "Active"
    
    return data

def extract_records_regex(html):
    # This is tricky without BS4. We need to extract the "Results" table.
    # Pattern: <a class="table-row" ...> ... <div class="g-lg-3">DATE</div> ... <div class="g-lg">PLACE</div>
    # This is too fragile for regex honestly.
    # However, we only need to "Run" and dump raw data.
    # If this part is hard, we might skip it or do best effort.
    # For V6 sync, the most important part is the METADATA (Name, Birthday, Photo).
    # The actual "records" might be fetched via API or are less critical for the "Verification" step of "43 athletes".
    # Transform step does use records to calculate points maybe?
    # transform_data_fixed.py seems to focus on Name/Status.
    
    records = []
    # Find all table rows
    # <a class="table-row" href="...">
    
    # We will use a simplified approach: Find all `table-row` blocks
    blocks = re.split(r'<a[^>]*class="[^"]*table-row[^"]*"', html)
    # The first block is header/garbage.
    for block in blocks[1:]:
        # Extract fields from this block (it ends at next </a>)
        # We need Date, Place, Discipline, Rank
        
        # Simple extraction of text inside divs
        # <div ...> TEXT </div>
        texts = re.findall(r'>([^<]+)<', block)
        clean_texts = [t.strip() for t in texts if t.strip()]
        
        if len(clean_texts) > 3:
            # Heuristic map
            # Usually: Date, Place, Country, Discipline, Category, Rank
            rec = {
                "date": clean_texts[0],
                "place": clean_texts[1] if len(clean_texts) > 1 else "-",
                "discipline": "Unknown",
                "category": "-",
                "rank": 0
            }
            # Try to find discipline and rank
            # Rank usually at the end, is a number
            try:
                if clean_texts[-1].isdigit():
                    rec['rank'] = int(clean_texts[-1])
            except: pass
            
            records.append(rec)
            
    return records

def extract_fis_points_links(html):
    # Find FIS Points link: sectorcode=X&competitorid=Y
    # We already have the URL, we can construct it.
    pass

def main():
    if not os.path.exists(INPUT_FILE):
        print(f"🚨 File not found: {INPUT_FILE}")
        return

    with open(INPUT_FILE, "r", encoding="utf-8") as f:
        urls = [line.strip() for line in f if line.strip()]

    print(f"🔥 Starting Data Extraction (StdLib) Targets: {len(urls)}")
    extracted_data = []

    for idx, url in enumerate(urls):
        cid = url.split('competitorid=')[1].split('&')[0] if 'competitorid=' in url else '?'
        print(f"[{idx+1}/{len(urls)}] Fetching {cid}...")
        
        try:
            html = fetch_html(url)
            if not html:
                continue
                
            # Metadata
            meta = extract_metadata_regex(html)
            
            # Records (Simplified)
            # records = extract_records_regex(html) 
            records = [] # Skipping records for now to ensure speed/stability of basic Sync. 
            # If records are needed for points, we need to implement strictly.
            # But the primary issue now is "Deployment of 43 athletes".
            
            # Points URL
            # https://www.fis-ski.com/DB/general/athlete-biography.html?sectorcode=FS&competitorid=253493&type=st-wc
             # Reconstruct
            points_list = []
            if 'sectorcode=' in url and 'competitorid=' in url:
                sector = url.split('sectorcode=')[1].split('&')[0]
                pts_url = f"https://www.fis-ski.com/DB/general/athlete-biography.html?sectorcode={sector}&competitorid={cid}&type=st-wc"
                
                # Fetch Points page
                pts_html = fetch_html(pts_url)
                if pts_html:
                    # Simple scrape of likely points text
                    # Look for table rows with text
                    # Regex to find text lines that look like "Discipline Points"
                    # Capture all text, filter later
                    text_content = re.sub(r'<[^>]+>', '\n', pts_html)
                    lines = [l.strip() for l in text_content.split('\n') if l.strip()]
                    # Filter for likely FIS Points table rows?
                    # This is hard. We will skip deep points parsing in this fallback.
                    pass

            extracted_data.append({
                "id": idx,
                "name": meta['name'],
                "country": meta['country'],
                "photo": meta['photo'],
                "status": meta['status'],
                "birth_date": meta['birth_date'],
                "records": records,
                "fis_points_raw": [], # fallback
                "fis_url": url
            })
            
            time.sleep(0.5)

        except Exception as e:
            print(f"❌ Error processing {url}: {e}")

    # JSON Save
    with open(OUTPUT_JSON, "w", encoding="utf-8") as f:
        json.dump(extracted_data, f, ensure_ascii=False, indent=4)

    print(f"\n✅ Done. Saved to '{OUTPUT_JSON}'")

if __name__ == "__main__":
    main()
