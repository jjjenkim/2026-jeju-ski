import json
import os
from datetime import datetime

# V3 Schema Definition
# ID Format: KOR_{DISCIPLINE}_{SEQ} given by index

DISCIPLINE_MAP = {
    "alpine_skiing": "AL",
    "cross_country": "CC", 
    "ski_jumping": "JP",
    "freeski": "FS", # Needs refinement based on display?
    "moguls": "MO",
    "snowboard_alpine": "SBA",
    "snowboard_cross": "SBX",
    "snowboard_park": "SBP"
}

def normalize_data():
    base_path = "data/raw/athletes_base.json"
    output_path = "data/processed/athletes.json"
    
    # Ensure processed dir exists
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    
    with open(base_path, 'r', encoding='utf-8') as f:
        raw = json.load(f)
        
    athletes_v3 = []
    
    for idx, p in enumerate(raw['athletes']):
        # Determine Discipline Code
        sport_key = p.get('sport', 'unknown')
        discipline_code = DISCIPLINE_MAP.get(sport_key, "OT")
        
        # Generator V3 ID
        v3_id = f"KOR_{discipline_code}_{idx+1:03d}"
        
        # Estimate Birth Date (YYYY-01-01) if only year provided
        birth_date = f"{p['birth_year']}-01-01"
        
        athlete_obj = {
            "id": v3_id,
            "name_ko": p['name_ko'],
            "name_en": "Unknown", # Placeholder for Scraper to fill
            "fis_code": p['fis_code'],
            "discipline": sport_key.upper(),
            "sport_display": p['sport_display'],
            "team": p['team'],
            "birth_date": birth_date,
            "status": "ACTIVE",
            "stats": {
                "medals": {"gold": 0, "silver": 0, "bronze": 0},
                "world_rank": None
            }
        }
        athletes_v3.append(athlete_obj)
        
    # Write V3 Data
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(athletes_v3, f, indent=2, ensure_ascii=False)
        
    print(f"✅ Normalized {len(athletes_v3)} athletes to V3 Relational Schema.")

if __name__ == "__main__":
    normalize_data()
