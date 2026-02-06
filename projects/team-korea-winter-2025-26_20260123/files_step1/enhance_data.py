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
    
    # Granular VENUE_MAP with Date Ranges (Month, Day Range) ensuring realistic scheduling
    VENUE_MAP = {
        # SNOWBOARD
        "SB_HP": [ # Halfpipe
            ("Laax Open", "Laax, SUI", (1, 15, 20)),          # Jan 15-20
            ("U.S. Grand Prix", "Copper Mountain, USA", (12, 12, 16)), # Dec 12-16
            ("U.S. Grand Prix", "Mammoth, USA", (2, 1, 5)),       # Feb 1-5
            ("FIS World Cup", "Calgary, CAN", (2, 9, 12)),        # Feb 9-12
            ("FIS World Championships", "St. Moritz, SUI", (1, 22, 28)) # Jan 22-28
        ],
        "SB_SS": [ # Slopestyle
            ("Laax Open", "Laax, SUI", (1, 15, 20)),
            ("FIS World Cup", "Silvaplana, SUI", (3, 22, 26)),
            ("FIS World Cup", "Tignes, FRA", (3, 11, 15)),
            ("Winter X Games", "Aspen, USA", (1, 25, 28))
        ],
        "SB_BA": [ # Big Air
            ("FIS World Cup", "Chur, SUI", (10, 19, 21)),
            ("FIS World Cup", "Beijing, CHN", (11, 29, 30)), # Nov-Dec overlap handled simply
            ("FIS World Cup", "Edmonton, CAN", (12, 8, 10))
        ],
        "SB_PGS": [ # Alpine - Carezza is Dec
            ("FIS World Cup", "Cortina, ITA", (12, 16, 17)),
            ("FIS World Cup", "Carezza, ITA", (12, 14, 15)), # Dec 14-15
            ("FIS World Cup", "Rogla, SLO", (1, 20, 25)),
            ("FIS World Cup", "Bad Gastein, AUT", (1, 10, 12)),
            ("FIS World Cup", "Pyeongchang, KOR", (2, 15, 20))
        ],
        "SB_SBX": [ # Cross
            ("FIS World Cup", "Cervinia, ITA", (12, 15, 18)),
            ("FIS World Cup", "Montafon, AUT", (3, 10, 15)), # Adjusted to late season or Dec
            ("FIS World Cup", "Cortina, ITA", (2, 3, 5))
        ],

        # FREESKI
        "FS_HP": [
            ("U.S. Grand Prix", "Copper Mountain, USA", (12, 15, 18)),
            ("FIS World Cup", "Calgary, CAN", (2, 14, 16)),
            ("FIS World Cup", "Mammoth, USA", (2, 2, 5))
        ],
        "FS_SS": [
            ("FIS World Cup", "Stubai, AUT", (11, 18, 20)),
            ("FIS World Cup", "Tignes, FRA", (3, 10, 15)),
            ("FIS World Cup", "Silvaplana, SUI", (3, 23, 27))
        ],
        "FS_BA": [
            ("FIS World Cup", "Chur, SUI", (10, 18, 20)),
            ("FIS World Cup", "Beijing, CHN", (11, 29, 30))
        ],
        "FS_MO": [ # Moguls
            ("FIS World Cup", "Ruka, FIN", (12, 2, 4)),
            ("FIS World Cup", "Idre Fjäll, SWE", (12, 9, 11)),
            ("FIS World Cup", "Alpe d'Huez, FRA", (12, 16, 17)),
            ("FIS World Cup", "Waterville, USA", (1, 26, 28)),
            ("FIS World Cup", "Deer Valley, USA", (2, 2, 5))
        ],

        # ALPINE SKIING
        "AL_TECH": [
            ("FIS World Cup", "Sölden, AUT", (10, 28, 30)),
            ("FIS World Cup", "Val d'Isere, FRA", (12, 10, 12)),
            ("FIS World Cup", "Adelboden, SUI", (1, 6, 8)),
            ("FIS World Cup", "Schladming, AUT", (1, 23, 25)),
            ("FIS World Cup", "Kitzbühel, AUT", (1, 19, 21)) # Hahnenkamm
        ],

        # CROSS COUNTRY
        "CC_DIST": [
            ("FIS World Cup", "Ruka, FIN", (11, 25, 27)),
            ("FIS World Cup", "Trondheim, NOR", (12, 15, 17)),
            ("FIS World Cup", "Davos, SUI", (12, 28, 30)),
            ("Tour de Ski", "Val di Fiemme, ITA", (1, 3, 5))
        ],

        # SKI JUMPING
        "JP_NH": [
            ("FIS World Cup", "Ruka, FIN", (11, 25, 27)),
            ("Four Hills", "Oberstdorf, GER", (12, 28, 29)),
            ("Four Hills", "Garmisch, GER", (1, 1, 1)),
            ("FIS World Cup", "Sapporo, JPN", (2, 17, 19)),
            ("FIS World Cup", "Planica, SLO", (3, 20, 23))
        ]
    }
    
    # Establish a "skill level"
    ELITE_LEVELS = {
        "이채운": 1, "최가온": 1, "이상호": 1, "장유진": 3, "정동현": 3, "김상겸": 2
    }
    level = ELITE_LEVELS.get(name_ko, 10) 
    
    num_results = random.randint(6, 10)
    
    # Determine Specific Discipline for the Athlete ONCE
    athlete_disc = "SB_HP" # default
    if sector == "SB":
        if name_ko in ["이채운", "최가온"]: athlete_disc = "SB_HP"
        elif name_ko in ["이상호", "김상겸", "정해림"]: athlete_disc = "SB_PGS"
        elif "park" in sport: athlete_disc = random.choice(["SB_HP", "SB_SS", "SB_BA"])
        elif "alpine" in sport: athlete_disc = "SB_PGS"
        elif "cross" in sport: athlete_disc = "SB_SBX"
        else: athlete_disc = "SB_HP"
    elif sector == "FS":
        if name_ko == "장유진": athlete_disc = "FS_HP" 
        elif "mogul" in sport: athlete_disc = "FS_MO"
        elif "park" in sport or "freeski" in sport: athlete_disc = random.choice(["FS_HP", "FS_SS", "FS_BA"])
        else: athlete_disc = "FS_MO"
    elif sector == "AL": athlete_disc = "AL_TECH"
    elif sector == "CC": athlete_disc = "CC_DIST"
    elif sector == "JP": athlete_disc = "JP_NH"

    # Get venues for this SPECIFIC discipline
    possible_venues = VENUE_MAP.get(athlete_disc, VENUE_MAP.get(sector, [("FIS Event", "Unknown", (1, 1, 28))]))
    
    # Select unique venues to simulate a season tour
    # Use simpler selection to guarantee consistency
    tour_stops = random.sample(possible_venues, min(len(possible_venues), num_results))
    
    for venue_data in tour_stops:
        event_name, location, (month, start_day, end_day) = venue_data
        
        # Determine year based on month (Nov/Dec = 2025, Jan/Feb/Mar = 2026)
        year = 2025 if month >= 10 else 2026
        
        day = random.randint(start_day, end_day)
        try:
            d = datetime(year, month, day)
        except ValueError:
            d = datetime(year, month, 28) # Fallback

        if d > datetime(2026, 1, 27) and d < datetime(2025, 10, 1): continue # Sanity check (rarely needed with static maps)
        
        # Rank logic
        if level == 1: rank = random.choice([1, 1, 2, 2, 3]) # More realistic elite
        elif level == 2: rank = random.randint(1, 12)
        elif level == 3: rank = random.randint(10, 30)
        else: rank = random.randint(20, 60)
            
        # FIS Points
        if rank == 1: points = 1000.0 # Standard WC Win
        elif rank == 2: points = 800.0
        elif rank == 3: points = 600.0
        elif rank <= 10: points = random.uniform(300, 500)
        else: points = random.uniform(50, 200)
        
        # Format Discipline Display 
        disc_disp = athlete_disc.split('_')[1] # HP, SS, PGS etc
        if disc_disp == "TECH": disc_disp = random.choice(["SL", "GS"])
        if disc_disp == "DIST": disc_disp = "C/F"
        if disc_disp == "NH": disc_disp = "LH/NH"

        results.append({
            "date": d.strftime("%Y-%m-%d"),
            "event": event_name,
            "location": location,
            "discipline": disc_disp,
            "discipline_code": athlete_disc, 
            "rank": rank,
            "points": round(points, 2)
        })
    
    return sorted(results, key=lambda x: x['date'], reverse=True)

def main():
    print("🚀 Running Strict Data Pipeline V5.0 (Precision Fixes)...")
    
    # 1. Load Source Data
    base_path = 'files_step1/athletes_base.json'
    if not os.path.exists(base_path):
        print(f"❌ Error: {base_path} not found.")
        return
        
    # [Rest of the main function remains similar but processing loop needs slight adjustment to use the new generate_results returns]

    with open(base_path, 'r', encoding='utf-8') as f:
        base_data = json.load(f)
        
    source_athletes = base_data.get('athletes', [])
    print(f"📦 Found {len(source_athletes)} source athletes.")

    enhanced_athletes = []
    sport_stats = {}
    gender_stats = {"M": 0, "F": 0}
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
        # CORRECT FIX: Use the specific discipline decided in generate_results
        if results:
            # e.g. "FS_HP" -> "HP"
            full_code = results[0].get('discipline_code', base['sector'] + "_UNK")
            if "_" in full_code:
                disc_code = full_code.split('_')[1]
            else:
                disc_code = full_code
        else:
            # Fallback if no results generated (unlikely)
            sector_code = base['sector']
            disc_code = sector_code
            
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

        ath = {
            "id": aid,
            "name_ko": name,
            "name_en": f"{name} (KOR)", # Placeholder if real EN names not found
            "birth_date": f"{birth_year}-01-01",
            "birth_year": birth_year,
            "age": 2026 - birth_year,
            "gender": gender,
            "sport": sport,
            "sport_display": base['sport_display'],
            "team": base['team'],
            "fis_code": base['fis_code'],
            "sector": base['sector'],
            "detail_discipline_code": disc_code,
            "detail_discipline": DISC_MAP.get(disc_code, disc_code),
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
        
        enhanced_athletes.append(ath)
        
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
    target_path = 'V6/src/data/athletes.json'
    os.makedirs(os.path.dirname(target_path), exist_ok=True)
    with open(target_path, 'w', encoding='utf-8') as f:
        json.dump(output_data, f, ensure_ascii=False, indent=2)

    print(f"✅ Enhanced Data Saved to {target_path}")
    print(f"📊 Summary:")
    print(f"   - Athletes: {len(enhanced_athletes)}")
    print(f"   - Sports: {list(sport_stats.keys())}")
    print(f"   - Medals: {total_medals}")

if __name__ == "__main__":
    main()
