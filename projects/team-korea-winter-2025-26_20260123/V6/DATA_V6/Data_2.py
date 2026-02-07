import urllib.request
import urllib.parse
import json
import time
import random
import os
import re
import sys

# =========================================================
# ⚙️ 설정
# =========================================================
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
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

OUTPUT_JSON = "/Users/jenkim/Downloads/JEN Group/Project_멀티오케스트레이션/results/v6_pipeline/raw_team_korea.json"
# Ensure output dir exists
os.makedirs(os.path.dirname(OUTPUT_JSON), exist_ok=True)

print(f"📂 Input: {INPUT_FILE}")
print(f"📂 Output: {OUTPUT_JSON}")

HEADERS = {"User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)"}

def fetch_html(url, retries=3):
    req = urllib.request.Request(url, headers=HEADERS)
    for i in range(retries):
        try:
            with urllib.request.urlopen(req, timeout=15) as response:
                return response.read().decode('utf-8', errors='ignore')
        except Exception as e:
            print(f"   ⚠️ Fetch error ({i+1}/{retries}): {e}")
            time.sleep(1)
    return None

def extract_meta(html):
    data = {}
    # Name
    name_m = re.search(r'<h1[^>]*class="[^"]*athlete-profile__name[^"]*"[^>]*>(.*?)</h1>', html, re.DOTALL)
    if name_m:
        data['name'] = re.sub(r'<[^>]+>', '', name_m.group(1)).strip()
    else: data['name'] = "Unknown"
    
    # Country
    country_m = re.search(r'<span[^>]*class="[^"]*country__name[^"]*"[^>]*>(.*?)</span>', html, re.DOTALL)
    data['country'] = country_m.group(1).strip() if country_m else "-"

    # Photo
    photo_m = re.search(r'class="[^"]*avatar__image[^"]*"[^>]*style="[^"]*url\(\'([^\']+)\'\)', html)
    data['photo'] = photo_m.group(1) if photo_m else "https://via.placeholder.com/150?text=No+Image"
    
    # Birthdate
    birth_m = re.search(r'<li[^>]*id="Birthdate"[^>]*>.*?<span[^>]*class="[^"]*profile-info__value[^"]*"[^>]*>(.*?)</span>', html, re.DOTALL)
    data['birth_date'] = birth_m.group(1).strip() if birth_m else "-"
    
    # Status
    status_m = re.search(r'<li[^>]*id="Status"[^>]*>.*?<span[^>]*class="[^"]*profile-info__value[^"]*"[^>]*>(.*?)</span>', html, re.DOTALL)
    data['status'] = status_m.group(1).strip() if status_m else "Active"
    
    return data

def extract_records(html):
    records = []
    # Find table rows
    rows = re.findall(r'<a[^>]*class="[^"]*table-row[^"]*"[^>]*>(.*?)</a>', html, re.DOTALL)
    for row_html in rows:
        # Extract text from divs
        texts = re.findall(r'>([^<]+)<', row_html)
        clean = [t.strip() for t in texts if t.strip()]
        if len(clean) >= 4:
            rec = {
                "date": clean[0],
                "place": clean[1],
                "discipline": clean[3] if len(clean) > 3 else "Unknown",
                "category": clean[4] if len(clean) > 4 else "-",
                "rank": 0
            }
            # Try to find rank (often last number)
            for t in reversed(clean):
                if t.isdigit():
                    rec['rank'] = int(t)
                    break
            records.append(rec)
    return records

def main():
    if not os.path.exists(INPUT_FILE):
        print(f"🚨 파일 없음: {INPUT_FILE}")
        return

    with open(INPUT_FILE, "r", encoding="utf-8") as f:
        urls = [line.strip() for line in f if line.strip()]

    print(f"🔥 데이터 정밀 추출 시작 (대상: {len(urls)}명)")
    extracted_data = []

    for idx, url in enumerate(urls):
        print(f"[{idx+1}/{len(urls)}] Processing {url.split('competitorid=')[1] if 'competitorid=' in url else '...'}")
        try:
            html = fetch_html(url)
            if not html: continue
            
            meta = extract_meta(html)
            records = extract_records(html)
            
            extracted_data.append({
                "id": idx,
                "name": meta['name'],
                "country": meta['country'],
                "photo": meta['photo'],
                "status": meta['status'],
                "birth_date": meta['birth_date'],
                "records": records,
                "fis_points_raw": [], # Best effort
                "fis_url": url
            })
            time.sleep(random.uniform(0.1, 0.3))
        except Exception as e:
            print(f"❌ 에러: {e}")

    with open(OUTPUT_JSON, "w", encoding="utf-8") as f:
        json.dump(extracted_data, f, ensure_ascii=False, indent=4)
    print(f"\n✅ 완료. '{OUTPUT_JSON}' 파일이 생성되었습니다.")

if __name__ == "__main__":
    main()