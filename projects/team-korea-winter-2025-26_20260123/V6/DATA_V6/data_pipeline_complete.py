import requests
from bs4 import BeautifulSoup
import json
import time
import random
import re

# =========================================================
# 1. TEAM KOREA 명단 데이터 (네가 준 거 그대로 넣음)
# =========================================================
RAW_TEAM_DATA = """
## **프리스타일 스키 하프파이프·슬로프스타일 국가대표**
- 이승훈(05) —
https://www.fis-ski.com/DB/general/athlete-biography.html?sectorcode=FS&competitorid=235622&type=result
- 문희성(06) —
https://www.fis-ski.com/DB/general/athlete-biography.html?sectorcode=FS&competitorid=239278&type=result
- 신영섭(05) —
https://www.fis-ski.com/DB/general/athlete-biography.html?sectorcode=FS&competitorid=233691&type=result
- 장유진(01) —
https://www.fis-ski.com/DB/general/athlete-biography.html?sectorcode=FS&competitorid=203633&type=result
- 김다은(05) —
https://www.fis-ski.com/DB/general/athlete-biography.html?sectorcode=FS&competitorid=235623&type=result

## **프리스타일 모글 국가대표**
- 정대윤(05) —
https://www.fis-ski.com/DB/general/athlete-biography.html?sectorcode=FS&competitorid=229480&type=result
- 이윤승(06) —
https://www.fis-ski.com/DB/general/athlete-biography.html?sectorcode=FS&competitorid=252896&type=result
- 윤신이(07) —
https://www.fis-ski.com/DB/general/athlete-biography.html?sectorcode=FS&competitorid=258758&type=result

## **스노보드 알파인 국가대표**
- 이상호(95) —
https://www.fis-ski.com/DB/general/athlete-biography.html?sectorcode=SB&competitorid=163744&type=result
- 김상겸(89) —
https://www.fis-ski.com/DB/general/athlete-biography.html?sectorcode=SB&competitorid=111837&type=result
- 조완희(98) —
https://www.fis-ski.com/DB/general/athlete-biography.html?sectorcode=SB&competitorid=188938&type=result
- 마준호(02) —
https://www.fis-ski.com/DB/general/athlete-biography.html?sectorcode=SB&competitorid=220950&type=result
- 홍승영(98) —
https://www.fis-ski.com/DB/general/athlete-biography.html?sectorcode=SB&competitorid=188936&type=result
- 정해림(95) —
https://www.fis-ski.com/DB/general/athlete-biography.html?sectorcode=SB&competitorid=156415&type=result

## **스노보드 크로스 국가대표**
- 우수빈(03) —
https://www.fis-ski.com/DB/general/athlete-biography.html?sectorcode=SB&competitorid=229485&type=result

## **스노보드 하프파이프·슬로프스타일·빅에어 국가대표**
- 이채운(06) —
https://www.fis-ski.com/DB/general/athlete-biography.html?sectorcode=SB&competitorid=239112&type=result
- 이지오(08) —
https://www.fis-ski.com/DB/general/athlete-biography.html?sectorcode=SB&competitorid=261333&type=result
- 김건희(08) —
https://www.fis-ski.com/DB/general/athlete-biography.html?sectorcode=SB&competitorid=261977&type=result
- 최가온(08) —
https://www.fis-ski.com/DB/general/athlete-biography.html?sectorcode=SB&competitorid=264594&type=result
- 이나윤(03) —
https://www.fis-ski.com/DB/general/athlete-biography.html?sectorcode=SB&competitorid=212759&type=result
- 이동헌(06) —
https://www.fis-ski.com/DB/general/athlete-biography.html?sectorcode=SB&competitorid=239111&type=result
- 유승은(08) —
https://www.fis-ski.com/DB/general/athlete-biography.html?sectorcode=SB&competitorid=261339&type=result

## **스키점프 국가대표**
- 최흥철(81) —
https://www.fis-ski.com/DB/general/athlete-biography.html?sectorcode=JP&competitorid=10064&type=result
- 장선웅(07) —
https://www.fis-ski.com/DB/general/athlete-biography.html?sectorcode=JP&competitorid=270266&type=result

## **크로스컨트리 국가대표**
- 이준서(03) —
https://www.fis-ski.com/DB/general/athlete-biography.html?sectorcode=CC&competitorid=229479&type=result
- 변지영(98) —
https://www.fis-ski.com/DB/general/athlete-biography.html?sectorcode=CC&competitorid=188923&type=result
- 이진복(02) —
https://www.fis-ski.com/DB/general/athlete-biography.html?sectorcode=CC&competitorid=229490&type=result
- 정종원(92) —
https://www.fis-ski.com/DB/general/athlete-biography.html?sectorcode=CC&competitorid=136287&type=result
- 이건용(93) —
https://www.fis-ski.com/DB/general/athlete-biography.html?sectorcode=CC&competitorid=154934&type=result
- 이의진(01) —
https://www.fis-ski.com/DB/general/athlete-biography.html?sectorcode=CC&competitorid=221223&type=result
- 한다솜(94) —
https://www.fis-ski.com/DB/general/athlete-biography.html?sectorcode=CC&competitorid=162284&type=result
- 이지예(01) —
https://www.fis-ski.com/DB/general/athlete-biography.html?sectorcode=CC&competitorid=212563&type=result
- 제상미(99) —
https://www.fis-ski.com/DB/general/athlete-biography.html?sectorcode=CC&competitorid=195562&type=result

## **알파인 국가대표**
- 정동현(88) —
https://www.fis-ski.com/DB/general/athlete-biography.html?sectorcode=AL&competitorid=93945&type=result
- 박제윤(94) —
https://www.fis-ski.com/DB/general/athlete-biography.html?sectorcode=AL&competitorid=154866&type=result
- 홍동관(95) —
https://www.fis-ski.com/DB/general/athlete-biography.html?sectorcode=AL&competitorid=163737&type=result
- 김동우(95) —
https://www.fis-ski.com/DB/general/athlete-biography.html?sectorcode=AL&competitorid=163740&type=result
- 정민식(97) —
https://www.fis-ski.com/DB/general/athlete-biography.html?sectorcode=AL&competitorid=189170&type=result
- 이한희(97) —
https://www.fis-ski.com/DB/general/athlete-biography.html?sectorcode=AL&competitorid=188824&type=result
- 신정우(99) —
https://www.fis-ski.com/DB/general/athlete-biography.html?sectorcode=AL&competitorid=203604&type=result
- 김소희(96) —
https://www.fis-ski.com/DB/general/athlete-biography.html?sectorcode=AL&competitorid=177571&type=result
- 최태희(05) —
https://www.fis-ski.com/DB/general/athlete-biography.html?sectorcode=AL&competitorid=263315&type=result
- 박서윤(05) —
https://www.fis-ski.com/DB/general/athlete-biography.html?sectorcode=AL&competitorid=261321&type=result
"""

# =========================================================
# 2. 정밀 필터링 설정 (종목 / 등급 구분용)
# =========================================================
# FIS 사이트에서 이 단어들이 보이면 무조건 '종목'으로 인식
VALID_DISCIPLINES = [
    "Moguls", "Dual Moguls", "Dual Moguls Team", "Aerials", "Aerials Team",
    "Ski Cross", "Ski Cross Team", "Freeski Halfpipe", "Freeski Slopestyle",
    "Freeski Big Air", "Snowboard Cross", "Snowboard Cross Team", "Snowboard Halfpipe",
    "Snowboard Slopestyle", "Snowboard Big Air",
    "Giant Slalom", "Slalom", "Super G", "Downhill", "Alpine Combined",
    "Parallel Giant Slalom", "Parallel Slalom", "Parallel Giant Slalom Team",
    "Sprint Free", "Sprint Classic", "10km Interval Start Free", "10km Interval Start Classic",
    "15km Mass Start Free", "Ski Jumping", "Flying Hill", "Large Hill", "Normal Hill"
]

# FIS 사이트에서 이 단어들이 보이면 무조건 '대회 등급(Category)'으로 인식 (절대 안 버림)
VALID_CATEGORIES = [
    "WC", "WSC", "FIS", "NC", "EC", "YOG", "WJC", "AC", "OPN", "NAC", "SAC", "ANC", "FEC", "OWG", "UVS"
]

# =========================================================
# 3. 핵심 로직 함수
# =========================================================

def parse_team_data(raw_text):
    """한글 명단 텍스트를 파싱해서 구조화된 리스트로 변환"""
    athletes = []
    current_category = "Unknown"
    
    lines = raw_text.split('\n')
    i = 0
    while i < len(lines):
        line = lines[i].strip()
        
        if line.startswith("##"):
            current_category = line.replace("##", "").replace("**", "").strip()
            i += 1
            continue
            
        # 선수 이름 라인 감지 (예: "- 이승훈(05) —")
        if line.startswith("-") and "(" in line:
            name_part = line.split("—")[0].replace("-", "").strip()
            # 이름과 생년 분리
            match = re.match(r"([가-힣]+)\((\d+)\)", name_part)
            if match:
                name_kr = match.group(1)
                birth_year = match.group(2)
                
                # 다음 줄이 URL인지 확인
                if i + 1 < len(lines) and "http" in lines[i+1]:
                    url = lines[i+1].strip()
                    # URL에서 ID 추출
                    id_match = re.search(r"competitorid=(\d+)", url)
                    athlete_id = id_match.group(1) if id_match else f"TEMP_{random.randint(1000,9999)}"
                    
                    athletes.append({
                        "id": athlete_id,
                        "name_kr": name_kr,
                        "birth_year": birth_year,
                        "team_category": current_category,
                        "fis_url": url
                    })
                    i += 1 # URL 줄 건너뛰기
        i += 1
    return athletes

def parse_row_text(cols):
    """
    [핵심] FIS 테이블 한 줄(Row)을 분석해서 
    날짜, 장소, 종목, 등급, 순위를 정확히 발라내는 필터
    """
    data = {
        "date": "-", "place": "-", "discipline": "Unknown", 
        "category": "-", "rank": 0
    }
    
    # 1. 모든 텍스트 추출 (빈칸 제외)
    all_texts = [col.get_text(strip=True) for col in cols if col.get_text(strip=True)]
    if not all_texts: return None

    # [Rule 1] 날짜: 무조건 첫 번째 데이터
    data['date'] = all_texts[0]

    # 나머지 텍스트 분석
    remaining_texts = all_texts[1:]
    
    # [Rule 2 & 3] 종목과 등급 찾기
    for text in remaining_texts:
        clean_text = text.strip()
        
        # 종목 사전 대조
        for disc in VALID_DISCIPLINES:
            if disc.lower() in clean_text.lower():
                data['discipline'] = disc # 정확한 종목명 매핑
                break
        
        # 등급 사전 대조
        if clean_text in VALID_CATEGORIES:
            data['category'] = clean_text

    # [Rule 4] 장소 찾기 (소거법: 날짜/종목/등급/순위가 아닌 것 중 가장 긴 텍스트)
    candidates = []
    for text in remaining_texts:
        t = text.strip()
        is_digit = t.isdigit()
        is_disc = any(d.lower() in t.lower() for d in VALID_DISCIPLINES)
        is_cat = t in VALID_CATEGORIES
        
        if not is_digit and not is_disc and not is_cat:
            candidates.append(t)
    
    if candidates:
        # 가장 긴 문자열을 장소로 선택 (보통 장소명이 긺)
        data['place'] = max(candidates, key=len)

    # [Rule 5] 순위: 마지막 칸의 첫 번째 숫자
    try:
        score_box = cols[-1].find_all("div", recursive=False)
        rank_text = score_box[0].get_text(strip=True) if score_box else "0"
        
        if rank_text.isdigit():
            data['rank'] = int(rank_text)
        else:
            return None # 순위가 없거나 DNF면 데이터에서 제외
    except:
        return None

    # 필수 데이터 없으면 버림 (종목이 Unknown이면 장소가 잘못 들어간 것일 수 있음)
    if data['discipline'] == "Unknown":
        # 추가 보정: 텍스트 중 Disciplines에 포함되는게 있는지 다시 확인
        pass 

    return data

def get_photo_url(soup):
    """CSS background-image에서 URL 추출"""
    img_div = soup.find("div", class_="avatar__image")
    if img_div and 'style' in img_div.attrs:
        match = re.search(r"url\('([^']+)'\)", img_div['style'])
        if match: return match.group(1)
    return "https://via.placeholder.com/150?text=No+Image"

# =========================================================
# 4. 실행 부 (MAIN)
# =========================================================
def main():
    print("🔥 Team Korea 데이터 파이프라인 가동...")
    
    # 1. 한글 명단 파싱
    target_athletes = parse_team_data(RAW_TEAM_DATA)
    print(f"👉 총 {len(target_athletes)}명의 선수 명단을 확인했습니다.")
    
    headers = {
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    }
    
    final_data = []

    # 2. FIS 크롤링 및 데이터 병합
    for idx, athlete in enumerate(target_athletes):
        print(f"[{idx+1}/{len(target_athletes)}] 데이터 수집 중: {athlete['name_kr']} ({athlete['team_category']})...", end="\r")
        
        try:
            # FIS 접속
            res = requests.get(athlete['fis_url'], headers=headers, timeout=10)
            if res.status_code != 200: continue
            
            soup = BeautifulSoup(res.text, 'html.parser')
            
            # [A] FIS 영문 이름 및 사진 가져오기
            name_en_tag = soup.find("h1", class_="athlete-profile__name")
            name_en = name_en_tag.get_text(" ", strip=True) if name_en_tag else "Unknown"
            photo_url = get_photo_url(soup)
            
            # [B] 경기 기록 정밀 추출
            records = []
            rows = soup.find_all("a", class_="table-row")
            
            for row in rows:
                container = row.find("div", class_="container")
                if not container: continue
                
                cols = container.find_all("div", recursive=False)
                row_data = parse_row_text(cols) # 정밀 필터 적용
                
                if row_data:
                    records.append(row_data)
            
            # 최신순 -> 과거순 (차트용으로 정렬 변경 필요시 여기서 reverse)
            # 보통 차트는 왼쪽(과거) -> 오른쪽(현재)이므로 reverse() 추천
            records.reverse()

            # [C] 데이터 병합 (Merge)
            final_data.append({
                "id": athlete['id'],
                "name_kr": athlete['name_kr'],
                "name_en": name_en,
                "birth_year": athlete['birth_year'],
                "team_category": athlete['team_category'],
                "photo": photo_url,
                "records": records # 정제된 기록 리스트
            })
            
            time.sleep(random.uniform(0.5, 1.0)) # 차단 방지 딜레이

        except Exception as e:
            print(f"\n❌ 에러 발생 ({athlete['name_kr']}): {e}")

    # 3. 결과 저장
    output_file = "team_korea_data.json"
    with open(output_file, "w", encoding="utf-8") as f:
        json.dump(final_data, f, ensure_ascii=False, indent=4)

    print(f"\n✅ 완료! '{output_file}' 파일이 생성되었습니다.")
    print("👉 이 JSON 파일을 대시보드에 연결하면 한글 이름과 정확한 기록이 나옵니다.")

if __name__ == "__main__":
    main()
