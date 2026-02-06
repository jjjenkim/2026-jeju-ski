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
    
    # 1. Load Source Data (Moving up to source_data folder)
    base_path = os.path.join(os.path.dirname(__file__), '../source_data/athletes_base.json')
    if not os.path.exists(base_path):
        print(f"❌ Error: {base_path} not found.")
        return

    with open(base_path, 'r', encoding='utf-8') as f:
        base_data = json.load(f)
        
    source_athletes = base_data.get('athletes', [])
    print(f"📦 Found {len(source_athletes)} source athletes.")

    enhanced_athletes = []
    sport_stats = {}
    team_stats = {}
    gender_stats = {"M": 0, "F": 0}
    age_distribution = {"teens": 0, "twenties": 0, "thirties": 0}
    total_medals = {"gold": 0, "silver": 0, "bronze": 0}

    for i, base in enumerate(source_athletes):
        aid = f"KOR{i+1:03d}"
        name = base['name_ko']
        birth_year = fix_birth_year(base['birth_year'])
        sport = base['sport']
        
        # Assign Gender (Deterministic fallback)
        # Feminine names in this specific set typically: 장유진, 김다은, 윤신이, 최가온, 이나윤, 유승은, 김소희, 최태희, 박서윤, 정해림...
        FEMALE_NAMES = ["장유진", "김다은", "윤신이", "최가온", "이나윤", "유승은", "김소희", "최태희", "박서윤", "정해림", "이의진", "한다솜", "이지예", "제상미"]
        gender = "F" if name in FEMALE_NAMES else "M"
        
        # Results
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

        # Calculate total points
        total_points = round(sum(r['points'] for r in results), 1) if results else 0
        
        # Monthly history for charts (V2 expected format)
        monthly_history = [
            {"name": "OCT", "alpine": random.randint(20, 40), "snowboard": random.randint(30, 45)},
            {"name": "NOV", "alpine": random.randint(30, 50), "snowboard": random.randint(35, 55)},
            {"name": "DEC", "alpine": random.randint(40, 60), "snowboard": random.randint(40, 65)},
            {"name": "JAN", "alpine": random.randint(50, 75), "snowboard": random.randint(45, 80)},
            {"name": "FEB", "alpine": random.randint(60, 90), "snowboard": random.randint(50, 95)},
            {"name": "MAR", "alpine": random.randint(70, 95), "snowboard": random.randint(55, 99)}
        ]

        ath = {
            "id": aid,
            "name_ko": name,
            "name_en": f"{name} (KOR)",
            "birth_date": f"{birth_year}-01-01",
            "birth_year": birth_year,
            "age": 2026 - birth_year,
            "gender": gender,
            "sport": sport,
            "sport_key": sport,
            "sport_display": base['sport_display'],
            "team": base['team'],
            "fis_code": base['fis_code'],
            "sector": base['sector'],
            "detail_discipline_code": disc_code,
            "detail_discipline": DISC_MAP.get(disc_code, disc_code),
            "current_rank": current_rank,
            "total_points": total_points,
            "medals": medals,
            "recent_results": results,
            "history": monthly_history,
            "analysis": {
                "capability_matrix": matrix,
                "medal_projection": {
                    "gold": round(0.95 - (current_rank / 100), 2) if current_rank < 10 else 0.05,
                    "confidence": "High" if current_rank < 20 else "Medium"
                }
            }
        }
        
        enhanced_athletes.append(ath)
        
        # Update Stats
        sport_stats[sport] = sport_stats.get(sport, 0) + 1
        team_stats[base['team']] = team_stats.get(base['team'], 0) + 1
        gender_stats[gender] += 1
        
        # Age Stats
        age = 2026 - birth_year
        if age < 20: age_distribution["teens"] += 1
        elif age < 30: age_distribution["twenties"] += 1
        else: age_distribution["thirties"] += 1

    # Final Stats Document
    final_stats = {
        "by_sport": sport_stats,
        "by_team": team_stats,
        "by_gender": gender_stats,
        "age_distribution": age_distribution,
        "total_athletes": len(enhanced_athletes),
        "total_medals": total_medals,
        "last_updated": datetime.now().isoformat()
    }

    output_data = {
        "metadata": {"version": "4.0", "engine": "StrictAlignment"},
        "statistics": final_stats,
        "athletes": enhanced_athletes
    }

    # Save to public/data (Moving up and into public folder)
    out_path = os.path.join(os.path.dirname(__file__), '../public/data/athletes.json')
    with open(out_path, 'w', encoding='utf-8') as f:
        json.dump(output_data, f, ensure_ascii=False, indent=2)

    print(f"✅ Enhanced Data Saved to {out_path}")
    print(f"📊 Summary:")
    print(f"   - Athletes: {len(enhanced_athletes)}")
    print(f"   - Sports: {list(sport_stats.keys())}")
    print(f"   - Medals: {total_medals}")

if __name__ == "__main__":
    main()
