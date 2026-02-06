import json
import re
import os
from datetime import datetime
from typing import Tuple, Optional, List, Dict

# COMPLETE Korean athlete database
ATHLETE_DATA = {
    "SEUNGHUN LEE": {"ko": "이승훈", "gender": "M", "sport": "freeski", "birth_year": 2005},
    "Heesung MOON": {"ko": "문희성", "gender": "M", "sport": "freeski", "birth_year": 2006},
    "Yeongseop SHIN": {"ko": "신영섭", "gender": "M", "sport": "freeski", "birth_year": 2005},
    "Yujin JANG": {"ko": "장유진", "gender": "F", "sport": "freeski", "birth_year": 2001},
    "Daeun KIM": {"ko": "김다은", "gender": "F", "sport": "freeski", "birth_year": 2005},
    "Daeyoon JUNG": {"ko": "정대윤", "gender": "M", "sport": "moguls", "birth_year": 2005},
    "Yoonseung LEE": {"ko": "이윤승", "gender": "M", "sport": "moguls", "birth_year": 2006},
    "Shin-Ee YUN": {"ko": "윤신이", "gender": "F", "sport": "moguls", "birth_year": 2007},
    "Sangho LEE": {"ko": "이상호", "gender": "M", "sport": "snowboard_alpine", "birth_year": 1995},
    "Sangkyum KIM": {"ko": "김상겸", "gender": "M", "sport": "snowboard_alpine", "birth_year": 1989},
    "Wanhee CHO": {"ko": "조완희", "gender": "F", "sport": "snowboard_alpine", "birth_year": 1998},
    "Junho MA": {"ko": "마준호", "gender": "M", "sport": "snowboard_alpine", "birth_year": 2002},
    "Seungyeong HONG": {"ko": "홍승영", "gender": "F", "sport": "snowboard_alpine", "birth_year": 1998},
    "Haerim JEONG": {"ko": "정해림", "gender": "F", "sport": "snowboard_alpine", "birth_year": 1995},
    "Subeen WOO": {"ko": "우수빈", "gender": "F", "sport": "snowboard_cross", "birth_year": 2003},
    "Chaeun LEE": {"ko": "이채운", "gender": "F", "sport": "snowboard_park", "birth_year": 2006},
    "Jio LEE": {"ko": "이지오", "gender": "M", "sport": "snowboard_park", "birth_year": 2008},
    "Geonhui KIM": {"ko": "김건희", "gender": "F", "sport": "snowboard_park", "birth_year": 2008},
    "Gaon CHOI": {"ko": "최가온", "gender": "F", "sport": "snowboard_park", "birth_year": 2008},
    "Nayoon LEE": {"ko": "이나윤", "gender": "F", "sport": "snowboard_park", "birth_year": 2003},
    "Dongheon LEE": {"ko": "이동헌", "gender": "M", "sport": "snowboard_park", "birth_year": 2006},
    "Seungeun YU": {"ko": "유승은", "gender": "F", "sport": "snowboard_park", "birth_year": 2008},
    "Heung Chul CHOI": {"ko": "최흥철", "gender": "M", "sport": "ski_jumping", "birth_year": 1981},
    "Sunwoong JANG": {"ko": "장선웅", "gender": "M", "sport": "ski_jumping", "birth_year": 2007},
    "JOONSEO LEE": {"ko": "이준서", "gender": "M", "sport": "cross_country", "birth_year": 2003},
    "JI YEONG BYUN": {"ko": "변지영", "gender": "F", "sport": "cross_country", "birth_year": 1998},
    "JINBOK LEE": {"ko": "이진복", "gender": "M", "sport": "cross_country", "birth_year": 2002},
    "Jongwon JEONG": {"ko": "정종원", "gender": "M", "sport": "cross_country", "birth_year": 1992},
    "GEONYONG LEE": {"ko": "이건용", "gender": "M", "sport": "cross_country", "birth_year": 1993},
    "Eui Jin LEE": {"ko": "이의진", "gender": "F", "sport": "cross_country", "birth_year": 2001},
    "Dasom HAN": {"ko": "한다솜", "gender": "F", "sport": "cross_country", "birth_year": 1994},
    "JI YE LEE": {"ko": "이지예", "gender": "F", "sport": "cross_country", "birth_year": 2001},
    "Sangmi JE": {"ko": "제상미", "gender": "F", "sport": "cross_country", "birth_year": 1999},
    "Donghyun JUNG": {"ko": "정동현", "gender": "M", "sport": "alpine_skiing", "birth_year": 1988},
    "Jeyun PARK": {"ko": "박제윤", "gender": "M", "sport": "alpine_skiing", "birth_year": 1994},
    "Dongkwan HONG": {"ko": "홍동관", "gender": "M", "sport": "alpine_skiing", "birth_year": 1995},
    "Dong Woo KIM": {"ko": "김동우", "gender": "M", "sport": "alpine_skiing", "birth_year": 1995},
    "Minsik JUNG": {"ko": "정민식", "gender": "M", "sport": "alpine_skiing", "birth_year": 1997},
    "HANHEE LEE": {"ko": "이한희", "gender": "M", "sport": "alpine_skiing", "birth_year": 1997},
    "Jeongwoo SHIN": {"ko": "신정우", "gender": "M", "sport": "alpine_skiing", "birth_year": 1999},
    "Sohui GIM": {"ko": "김소희", "gender": "F", "sport": "alpine_skiing", "birth_year": 1996},
    "Taehee CHOI": {"ko": "최태희", "gender": "F", "sport": "alpine_skiing", "birth_year": 2005},
    "Seoyun PARK": {"ko": "박서윤", "gender": "F", "sport": "alpine_skiing", "birth_year": 2005},
}

SPORT_DISPLAY_KR = {
    'alpine_skiing': '알파인 스키',
    'cross_country': '크로스컨트리',
    'freeski': '프리스키',
    'moguls': '모굴',
    'ski_jumping': '스키점프',
    'snowboard_alpine': '스노보드 알파인',
    'snowboard_cross': '스노보드 크로스',
    'snowboard_park': '스노보드 파크'
}

SPORT_TO_FIS_CODES = {
    "freeski": ["HP", "SS", "BA"],
    "moguls": ["MO", "DM"],
    "snowboard_park": ["HP", "SS", "BA"],
    "snowboard_alpine": ["PAR", "PGS", "PSL"],
    "snowboard_cross": ["SBX"],
    "alpine_skiing": ["Slalom", "Giant Slalom", "Super G", "Downhill", "SL", "GS", "SG", "DH", "AC"],
    "cross_country": ["DI", "SP"],
    "ski_jumping": ["JP"]
}

SPORT_TO_TEAM = {
    "freeski": "Freestyle Ski Team",
    "moguls": "Mogul Ski Team",
    "snowboard_alpine": "Snowboard Alpine Team",
    "snowboard_cross": "Snowboard Cross Team",
    "snowboard_park": "Snowboard Park Team",
    "ski_jumping": "Ski Jumping Team",
    "cross_country": "Cross Country Team",
    "alpine_skiing": "Alpine Skiing Team"
}

def normalize_date(date_str: str) -> str:
    if not date_str or date_str == "-": return "2024-01-01"
    if re.match(r'^\d{4}-\d{2}-\d{2}$', date_str): return date_str
    
    match = re.search(r'(\d{2})[-./](\d{2})[-./](\d{4})', date_str)
    if match: return f"{match.group(3)}-{match.group(2)}-{match.group(1)}"
    
    return "2024-01-01"

def calculate_age(birth_date_str: str) -> int:
    try:
        birth_year = int(birth_date_str.split('-')[0])
        return 2026 - birth_year
    except:
        return 20

def sanitize_rank(rank_value) -> Tuple[Optional[int], Optional[str]]:
    if isinstance(rank_value, int): return (rank_value, None)
    if isinstance(rank_value, str):
        status_codes = ['DNF', 'DNS', 'DSQ', 'DNQ', 'DQ']
        for code in status_codes:
            if code in rank_value.upper(): return (None, code)
        match = re.search(r'(\d+)', rank_value)
        if match: return (int(match.group(1)), None)
    return (None, None)

def parse_fis_points_full(raw_list: List[str]) -> Tuple[Dict[str, int], Dict[str, float]]:
    if not raw_list: return {}, {}
    target_lists = ["Base List 2026", "Base List 2025", "List 2025/2026", "List 2024/2025"]
    best_ranks = {}; best_points = {}
    active_line = ""
    for target in target_lists:
        for line in raw_list:
            if target in line: active_line = line; break
        if active_line: break
    if not active_line and raw_list: active_line = raw_list[-1]
    matches = re.findall(r'([A-Z]{2,6})\s+([\d\.]+)\s+(\d+)', active_line)
    for code, pts_str, rank_str in matches:
        if code in ["RE", "FIS", "WC"]: continue
        try:
            r = int(rank_str); p = float(pts_str)
            if r > 0: best_ranks[code] = r; best_points[code] = p
        except: pass
    return best_ranks, best_points

def get_current_rank_and_points(athlete_info: dict, fis_points_raw: List[str]) -> Tuple[int, float, str]:
    parsed_ranks, parsed_points = parse_fis_points_full(fis_points_raw)
    sport = athlete_info.get("sport", "freeski")
    valid_codes = SPORT_TO_FIS_CODES.get(sport, [])
    best_rank = 9999; best_points = 0.0; best_code = ""; found = False
    for code in valid_codes:
        if code in parsed_ranks:
            rank = parsed_ranks[code]
            if rank < best_rank:
                best_rank = rank; best_points = parsed_points.get(code, 0.0); best_code = code; found = True
    if found: return best_rank, best_points, f"FIS-{best_code}"
    return 0, 0.0, "Unranked"

def transform_fis_to_dashboard():
    # Load FIS URLs from file
    url_map = {}
    try:
        with open("V6/DATA_V6/athlete_urls.txt", "r") as f:
            for line in f:
                url = line.strip()
                if not url: continue
                # Extract competitorid
                match = re.search(r'competitorid=(\d+)', url)
                if match:
                    comp_id = match.group(1)
                    url_map[comp_id] = url
    except Exception as e:
        print(f"Warning mapping URLs: {e}")

    input_path = "V6/DATA_V6/team_korea_data.json"
    if not os.path.exists(input_path): input_path = "team_korea_data.json"
    
    with open(input_path, "r", encoding="utf-8") as f: fis_data = json.load(f)
    print(f"✅ Loaded {len(fis_data)} athletes.")

    athletes = []
    for athlete in fis_data:
        name_en = athlete.get("name_en", athlete.get("name", "TBD Athlete"))
        # Match metadata
        athlete_meta = ATHLETE_DATA.get(name_en)
        if not athlete_meta:
            for k, v in ATHLETE_DATA.items():
                if k.lower() == name_en.lower(): athlete_meta = v; break
        if not athlete_meta: athlete_meta = {"ko": name_en, "gender": "M", "sport": "freeski", "birth_year": 2000}

        norm_birth = normalize_date(athlete.get("birth_date", ""))
        age = calculate_age(norm_birth)
        if (age < 12 or age > 60):
            year = athlete_meta.get("birth_year", 2000)
            age = 2026 - year
            norm_birth = f"{year}-01-01"
        
        rank, points, rank_ctx = get_current_rank_and_points(athlete_meta, athlete.get("fis_points_raw", []))
        
        # FIS URL and Code
        photo_url = athlete.get("photo", "")
        fis_code = ""
        # Try to extract code from photo URL: load-competitor-picture/235622.html
        code_match = re.search(r'/(\d+)\.html', photo_url)
        if code_match: fis_code = code_match.group(1)
        
        fis_url = url_map.get(fis_code, "")

        processed_records = []
        for r in athlete.get("records", []):
             processed_records.append({
                 "date": normalize_date(r.get("date")),
                 "place": r.get("place", "TBD"),
                 "category": r.get("category", "FIS").replace("Unknown", "FIS"),
                 "discipline": r.get("discipline", "General").replace("Unknown", "General"),
                 "rank": sanitize_rank(r.get("rank"))[0] or 0,
                 "result_code": sanitize_rank(r.get("rank"))[1],
                 "fis_points": 0
             })

        athlete_obj = {
            "id": fis_code or str(athlete.get("id", 0)),
            "fis_code": fis_code,
            "fis_url": fis_url,
            "name_en": name_en,
            "name_ko": athlete_meta["ko"], # REVERTED TO name_ko TO MATCH TS
            "gender": athlete_meta["gender"],
            "sport": athlete_meta["sport"],
            "sport_display": SPORT_DISPLAY_KR.get(athlete_meta["sport"], athlete_meta["sport"]),
            "team": SPORT_TO_TEAM.get(athlete_meta["sport"], "Team Korea"),
            "birth_date": norm_birth,
            "age": age,
            "current_rank": rank, 
            "fis_points": points,
            "rank_context": rank_ctx,
            "status": athlete.get("status", "Active"),
            "photo_url": photo_url,
            "recent_results": processed_records
        }
        athletes.append(athlete_obj)

    out = "V6/DATA_V6/athletes_real_fixed.json"
    with open(out, "w", encoding="utf-8") as f:
        json.dump(athletes, f, ensure_ascii=False, indent=4)
    print(f"✅ Generated {out}")

if __name__ == "__main__":
    transform_fis_to_dashboard()
