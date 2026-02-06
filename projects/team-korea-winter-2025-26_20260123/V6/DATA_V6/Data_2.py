import requests
from bs4 import BeautifulSoup
import json
import time
import random
import os
import re

# =========================================================
# ⚙️ 설정
# =========================================================
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
# Check if we are in V6/DATA_V6 or root
if os.path.basename(BASE_DIR) == "DATA_V6":
    INPUT_FILE = os.path.join(os.path.dirname(os.path.dirname(BASE_DIR)), "athlete_urls.txt") 
    # Try V6/athlete_urls.txt
    v6_urls = os.path.join(os.path.dirname(BASE_DIR), "athlete_urls.txt")
    if os.path.exists(v6_urls):
        INPUT_FILE = v6_urls
    else:
         INPUT_FILE = "athlete_urls.txt"
    OUTPUT_JSON = "/Users/jenkim/Downloads/JEN Group/Project_멀티오케스트레이션/results/v6_pipeline/raw_team_korea.json"
else:
    # Assuming running from project root
    INPUT_FILE = "V6/athlete_urls.txt"
    if not os.path.exists(INPUT_FILE):
        INPUT_FILE = "athlete_urls.txt"
    OUTPUT_JSON = "/Users/jenkim/Downloads/JEN Group/Project_멀티오케스트레이션/results/v6_pipeline/raw_team_korea.json"

print(f"📂 Input: {INPUT_FILE}")
print(f"📂 Output: {OUTPUT_JSON}")

# ✅ 1. 종목 사전
VALID_DISCIPLINES = [
    "Moguls", "Dual Moguls", "Dual Moguls Team", "Aerials", "Aerials Team",
    "Ski Cross", "Ski Cross Team", "Freeski Halfpipe", "Freeski Slopestyle",
    "Freeski Big Air", "Snowboard Cross", "Snowboard Cross Team",
    "Giant Slalom", "Slalom", "Super G", "Downhill", "Alpine Combined",
    "Parallel Giant Slalom", "Parallel Slalom", "Parallel Giant Slalom Team",
    "Cross-Country", "Ski Jumping", "Individual", "Sprint"
]

# ✅ 2. 등급 사전
VALID_CATEGORIES = [
    "WC", "WSC", "FIS", "NC", "EC", "YOG", "WJC", "AC", "OPN", "NAC", "SAC", "ANC", "FEC"
]

def parse_row_text(cols):
    data = {
        "date": "-", "place": "-", "discipline": "Unknown", 
        "category": "-", "rank": 0
    }
    all_texts = [col.get_text(strip=True) for col in cols]
    if not all_texts: return None
    data['date'] = all_texts[0]
    for text in all_texts:
        clean_text = text.strip()
        for disc in VALID_DISCIPLINES:
            if disc.lower() == clean_text.lower():
                data['discipline'] = disc
                break
        if clean_text in VALID_CATEGORIES:
            data['category'] = clean_text

    candidates = []
    for text in all_texts:
        t = text.strip()
        if (t != data['date'] and t != data['discipline'] and t != data['category'] and not t.isdigit() and len(t) > 2):
            candidates.append(t)
    if candidates:
        data['place'] = candidates[0]

    try:
        score_box = cols[-1].find_all("div", recursive=False)
        rank_text = score_box[0].get_text(strip=True) if score_box else "0"
        if rank_text.isdigit():
            data['rank'] = int(rank_text)
        else:
            return None
    except:
        return None
    return data

def get_photo_url(soup):
    img_div = soup.find("div", class_="avatar__image")
    if img_div and 'style' in img_div.attrs:
        match = re.search(r"url\('([^']+)'\)", img_div['style'])
        if match: return match.group(1)
    return "https://via.placeholder.com/150?text=No+Image"

def main():
    if not os.path.exists(INPUT_FILE):
        print(f"🚨 파일 없음: {INPUT_FILE}")
        return

    with open(INPUT_FILE, "r", encoding="utf-8") as f:
        urls = [line.strip() for line in f if line.strip()]

    print(f"🔥 데이터 정밀 추출 시작 (대상: {len(urls)}명)")
    extracted_data = []
    headers = {"User-Agent": "Mozilla/5.0"}

    for idx, url in enumerate(urls):
        print(f"[{idx+1}/{len(urls)}] Processing {url.split('competitorid=')[1] if 'competitorid=' in url else '...'}")
        try:
            response = requests.get(url, headers=headers, timeout=10)
            if response.status_code != 200: continue
            soup = BeautifulSoup(response.text, 'html.parser')
            
            # --- Profile ---
            name_tag = soup.find("h1", class_="athlete-profile__name")
            name = name_tag.get_text(" ", strip=True) if name_tag else "Unknown"
            
            country_tag = soup.select_one(".athlete-profile__country .country__name")
            country = country_tag.get_text(strip=True) if country_tag else "-"
            
            photo = get_photo_url(soup)
            
            # NEW Birthdate Logic
            birth_date = "-"
            birth_li = soup.find("li", id="Birthdate")
            if birth_li:
                val = birth_li.find("span", class_="profile-info__value")
                if val: birth_date = val.get_text(strip=True)
            
            # NEW Status Logic
            status = "Active"
            status_li = soup.find("li", id="Status")
            if status_li:
                val = status_li.find("span", class_="profile-info__value")
                if val: status = val.get_text(strip=True)

            # --- Records ---
            records = []
            rows = soup.find_all("a", class_="table-row")
            for row in rows:
                container = row.find("div", class_="container")
                if not container: continue
                cols = container.find_all("div", recursive=False)
                row_data = parse_row_text(cols)
                if row_data: records.append(row_data)
            records.reverse()

            # --- FIS Points (New) ---
            fis_points_list = []
            match = re.search(r"sectorcode=([A-Z]+)&competitorid=(\d+)", url)
            if match:
                sector, cid = match.groups()
                # Use type=fis-points if that exists? No, st-wc (Standings/Points)
                pts_url = f"https://www.fis-ski.com/DB/general/athlete-biography.html?sectorcode={sector}&competitorid={cid}&type=st-wc"
                
                try:
                    pts_resp = requests.get(pts_url, headers=headers, timeout=10)
                    if pts_resp.status_code == 200:
                        pts_soup = BeautifulSoup(pts_resp.text, 'html.parser')
                        
                        # Capture rows from 'a.table-row' (often used for data rows)
                        # AND 'div.g-row' (header/simple rows)
                        
                        found_rows = []
                        # 1. table-row links (most common for lists)
                        for row in pts_soup.find_all("a", class_="table-row"):
                             found_rows.append(row.get_text(" ", strip=True))
                        
                        # 2. g-row divs (headers or simple text)
                        # Only capture if they contain point-like data to avoid junk
                        for div in pts_soup.find_all("div", class_="g-row"):
                            txt = div.get_text(" ", strip=True)
                            # Only add if it looks like points table (headers or data)
                            if "FIS Points List" in txt or any(kp in txt for kp in ["MO", "HP", "Slalom", "Sprint"]):
                                found_rows.append(txt)
                        
                        # Reduce duplicates (some g-rows might be parents of table-rows)
                        # We'll just dump all unique strings that look relevant
                        # transform_data.py will parse them with regex.
                        unique_rows = sorted(list(set(found_rows)))
                        fis_points_list = unique_rows
                            
                except Exception as e:
                    print(f"Error fetching points: {e}")

            extracted_data.append({
                "id": idx,
                "name": name,
                "country": country,
                "photo": photo,
                "status": status,
                "birth_date": birth_date,
                "records": records,
                "fis_points_raw": fis_points_list,
                "fis_url": url
            })
            
            time.sleep(random.uniform(0.1, 0.3))

        except Exception as e:
            print(f"❌ 에러: {e}")

    # JSON 저장
    with open(OUTPUT_JSON, "w", encoding="utf-8") as f:
        json.dump(extracted_data, f, ensure_ascii=False, indent=4)

    print(f"\n✅ 완료. '{OUTPUT_JSON}' 파일이 생성되었습니다.")

if __name__ == "__main__":
    main()