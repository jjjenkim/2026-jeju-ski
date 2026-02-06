#!/usr/bin/env python3
"""
Team Korea Dashboard - Data Enhancement Script V4.0 (STRICT ALIGNMENT)
- Reads strictly from `files_step1/athletes_base.json`.
- Maps the EXACT 43 athletes and 7 FIS sports.
- Fixes birth year parsing ("05" -> 2005).
- Generates realistic FIS points and results.
"""

import json
import random
from datetime import datetime, timedelta
import os

# Target Disciplines (Canonical & Schema Mapped)
TARGET_MAP = {
    "alpine_skiing": "ALPINE_SKIING",
    "cross_country": "CROSS_COUNTRY",
    "moguls": "FREESKI_MOGULS",
    "freeski": "FREESKI_PARK",
    "snowboard_park": "SNOWBOARD_PARK",
    "snowboard_cross": "SNOWBOARD_CROSS",
    "snowboard_alpine": "SNOWBOARD_ALPINE"
}

# Discipline Code Mapping for ID (KOR_[CODE]_001)
DISC_CODE_MAP = {
    "ALPINE_SKIING": "AL",
    "CROSS_COUNTRY": "CC",
    "FREESKI_MOGULS": "FS_MO",
    "FREESKI_PARK": "FS_PK",
    "SNOWBOARD_PARK": "SB_PK",
    "SNOWBOARD_CROSS": "SB_CX",
    "SNOWBOARD_ALPINE": "SB_AL"
}

DISC_MAP = {
    "HP": "Halfpipe (HP)",
    "SS": "Slopestyle (SS)",
    "BA": "Big Air (BA)",
    "MO": "Moguls (MO)",
    "DM": "Dual Moguls (DM)",
    "PGS": "Parallel GS (PGS)",
    "SL": "Slalom (SL)",
    "GS": "Giant Slalom (GS)",
    "SX": "Ski Cross (SX)",
    "SBX": "Snowboard Cross (SBX)",
    "PSL": "Parallel Slalom (PSL)"
}

def fix_birth_year(year_str):
    year_int = int(year_str)
    if year_int < 100:
        return 1900 + year_int if year_int > 40 else 2000 + year_int
    return year_int

def generate_results(name_ko, sport, sector):
    results = []
    # Realistic locations
    locs = ["Laax, SUI", "Aspen, USA", "Calgary, CAN", "Deer Valley, USA", "Cortina, ITA", "Beijing, CHN", "Pyeongchang, KOR"]
    
    # Establish a "skill level" for better consistency
    # Top names from Korean winter sports history/current
    ELITE_NAMES = ["이채운", "최가온", "이상호", "장유진", "정동현", "김상겸"]
    is_elite = name_ko in ELITE_NAMES
    
    base_rank = 1 if is_elite else random.randint(10, 40)
    
    start_date = datetime(2025, 11, 15)
    
    # Generate 5-8 results for each athlete
    num_results = random.randint(5, 8)
    for i in range(num_results):
        # Result dates spread across the season
        d = start_date + timedelta(days=i * 12 + random.randint(0, 5))
        if d > datetime(2026, 1, 27): continue # Not in future
        
        # Elite athletes stay top 1-10, Others are 10-50
        rank = max(1, base_rank + random.randint(-5, 10))
        if is_elite and rank > 15: rank = random.randint(1, 8)
        
        points = max(0, 100 - (rank * 1.5) + random.uniform(-2, 2))
        
        results.append({
            "date": d.strftime("%Y-%m-%d"),
            "event": "FIS World Cup" if rank > 3 else "FIS World Cup Podium",
            "location": random.choice(locs),
            "discipline": sector, # Temporary, will be refined in loop
            "rank": rank,
            "points": round(points, 2)
        })
    
    return sorted(results, key=lambda x: x['date'], reverse=True)

def main():
    print("🚀 Running Strict Data Pipeline V4.0...")
    
    # 1. Load Source Data
    base_path = 'files_step1/athletes_base.json'
    if not os.path.exists(base_path):
        print(f"❌ Error: {base_path} not found.")
        return

    with open(base_path, 'r', encoding='utf-8') as f:
        base_data = json.load(f)
        
    source_athletes = base_data.get('athletes', [])
    print(f"📦 Found {len(source_athletes)} source athletes.")

    enhanced_athletes = []
    sport_stats = {}
    gender_stats = {"M": 0, "F": 0}
    total_medals = {"gold": 0, "silver": 0, "bronze": 0}

    # Main processing loop
    for idx, base in enumerate(source_athletes):
        # aid = f"KOR{idx+1:03d}" # Original line, but athlete_id is generated later
        name = base['name_ko']
        birth_year = fix_birth_year(base['birth_year'])
        sport = base['sport']
        
        # Assign Gender (Deterministic fallback)
        FEMALE_NAMES = ["장유진", "김다은", "윤신이", "최가온", "이나윤", "유승은", "김소희", "최태희", "박서윤", "정해림", "이의진", "한다솜", "이지예", "제상미"]
        gender = "F" if name in FEMALE_NAMES else "M"
        
        # Canonical Sport Mapping
        canonical_sport = sport
        if sport == "alpine_skiing":
            canonical_sport = "Alpine Skiing"
        elif sport == "cross_country":
            canonical_sport = "Cross country"
        elif sport == "moguls":
            canonical_sport = "Freesski - Moguls"
        elif sport == "freeski":
            canonical_sport = "Freesski - HP,SS,BA"
        elif sport == "snowboard_park":
            canonical_sport = "Snowboard - HP,SS,BA"
        elif sport == "snowboard_cross":
            canonical_sport = "Snowboard Cross"
        elif sport == "snowboard_alpine":
            canonical_sport = "Snowboard Alpine"
        if sport == "ski_jumping":
            print(f"⚠️ Skipping {name} (Ski Jumping not in Target 7)")
            continue
            
        canonical_discipline = TARGET_MAP.get(sport, "OTHER")
        disc_code = DISC_CODE_MAP.get(canonical_discipline, "XX")
        
        # New ID Format: KOR_[CODE]_[INDEX]
        athlete_id = f"KOR_{disc_code}_{idx+1:03d}"
        
        # Transliteration Map for common surnames (Simple heuristic for demo)
        SURNAME_MAP = {
            "이": "LEE", "김": "KIM", "최": "CHOI", "박": "PARK", "정": "JUNG", 
            "장": "JANG", "신": "SHIN", "문": "MOON", "윤": "YOON", "안": "AHN",
            "한": "HAN", "서": "SEO", "백": "BAEK", "홍": "HONG", "권": "KWON"
        }
        surname_ko = name[0]
        given_ko = name[1:]
        surname_en = SURNAME_MAP.get(surname_ko, "KOR")
        name_en = f"{surname_en} {given_ko}" # Ideally transliterate given name too, but this follows "KIM Cheolsu" style
        results = generate_results(name, sport, base['sector'])
        
        # Discipline selection grounded in Sector
        sector_code = base['sector']
        disc_code = sector_code # Fallback
        
        # Define possibilities by Sector
        if sector_code == "FS":
            if "park" in sport:
                disc_code = random.choice(["HP", "SS", "BA"])
            else:
                disc_code = "MO"
        elif sector_code == "SB":
            if "alpine" in sport:
                disc_code = "PGS"
            elif "cross" in sport:
                disc_code = "SBX"
            else:
                disc_code = random.choice(["HP", "SS", "BA"])
        elif sector_code == "AL":
            disc_code = random.choice(["SL", "GS"])
        elif sector_code == "JP":
            disc_code = "NH"
        elif sector_code == "CC":
            disc_code = "DIST"
            
        current_rank = results[0]['rank'] if results else 50
        
        # Medal Logic
        medals = {"gold": 0, "silver": 0, "bronze": 0}
        for r in results:
            if r['rank'] == 1: medals['gold'] += 1
            elif r['rank'] == 2: medals['silver'] += 1
            elif r['rank'] == 3: medals['bronze'] += 1
        
        total_medals['gold'] += medals['gold']
        total_medals['silver'] += medals['silver']
        total_medals['bronze'] += medals['bronze']

        # Capability Matrix - Grounded in current rank
        # Higher rank = higher stats
        base_stat = 95 - (current_rank / 2)
        matrix = {
            "technical": round(max(60, min(99, base_stat + random.uniform(-5, 5)))),
            "stamina": round(max(60, min(99, base_stat + random.uniform(-10, 2)))),
            "strategy": round(max(60, min(99, base_stat + random.uniform(-3, 7)))),
            "mental": round(max(60, min(99, base_stat + random.uniform(-2, 8)))),
            "experience": round(max(40, min(99, (2026 - birth_year) * 3 + random.randint(0, 10))))
        }

        entry = {
            "id": athlete_id,
            "name_ko": name,
            "name_en": name_en,
            "fis_code": base['fis_code'],
            "discipline": canonical_discipline,
            "sub_disciplines": [canonical_discipline + "_" + disc_code], 
            "team": "KOR_A",
            "birth_date": f"{birth_year}-01-01",
            "birth_year": birth_year, # Keep for convenience
            "status": "ACTIVE",
            "age": 2026 - birth_year,
            "gender": gender,
            "sport": sport, # Keep for compatibility if needed
            "sport_display": canonical_sport, # Keep for display
            "sector": base['sector'], # Keep for compatibility
            "detail_discipline_code": disc_code, # Keep for compatibility
            "detail_discipline": DISC_MAP.get(disc_code, disc_code), # Keep for compatibility
            "current_rank": current_rank,
            "medals": medals,
            "recent_results": results,
            "analysis": {
                "capability_matrix": matrix,
                "medal_projection": {
                    "gold": round(0.95 - (current_rank / 100), 2) if current_rank < 10 else 0.05,
                    "confidence": "High" if current_rank < 20 else "Medium"
                }
            }
        }
        
        enhanced_athletes.append(entry)
        
        # Update Stats
        sport_stats[sport] = sport_stats.get(sport, 0) + 1
        gender_stats[gender] += 1

    # Final Stats Document
    final_stats = {
        "by_sport": sport_stats,
        "by_gender": gender_stats,
        "total_athletes": len(enhanced_athletes),
        "total_medals": total_medals,
        "last_updated": datetime.now().isoformat()
    }

    output_data = {
        "metadata": {"version": "4.0", "engine": "StrictAlignment"},
        "statistics": final_stats,
        "athletes": enhanced_athletes
    }

    # Save to athletes.json (Production Source of Truth for V6)
    output_path = 'V6/src/data/athletes.json'
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(output_data, f, ensure_ascii=False, indent=2)

    print(f"✅ Enhanced Data Saved to {output_path}")
    print(f"📊 Summary:")
    print(f"   - Athletes: {len(enhanced_athletes)}")
    print(f"   - Sports: {list(sport_stats.keys())}")
    print(f"   - Medals: {total_medals}")

if __name__ == "__main__":
    main()
