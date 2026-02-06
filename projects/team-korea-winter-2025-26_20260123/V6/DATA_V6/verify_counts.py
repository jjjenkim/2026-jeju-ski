import json

# 1. Load Defined Data (The Source of Truth for Mapping)
try:
    from transform_data_fixed import ATHLETE_DATA
    print("--- 1. Defined Athlete Map (ATHLETE_DATA) ---")
    defined_counts = {}
    for name, data in ATHLETE_DATA.items():
        sport = data['sport']
        defined_counts[sport] = defined_counts.get(sport, 0) + 1
    
    for sport, count in sorted(defined_counts.items()):
        print(f"{sport}: {count}")
    print(f"Total Defined: {len(ATHLETE_DATA)}")
except ImportError:
    print("Could not import ATHLETE_DATA from transform_data_fixed.py")

# 2. Load Raw Scraped Data
print("\n--- 2. Raw Scraped Data (team_korea_data.json) ---")
try:
    with open("team_korea_data.json", "r", encoding="utf-8") as f:
        raw_data = json.load(f)
    print(f"Total Raw Records: {len(raw_data)}")
except FileNotFoundError:
    print("team_korea_data.json not found.")

# 3. Load Transformed Output
print("\n--- 3. Final Transformed Output (athletes_real_fixed.json) ---")
try:
    with open("athletes_real_fixed.json", "r", encoding="utf-8") as f:
        final_data = json.load(f)
    
    print(f"Total Final Athletes: {len(final_data['athletes'])}")
    print("Counts by Sport (from metadata):")
    stats = final_data.get("statistics", {}).get("by_sport", {})
    for sport, count in sorted(stats.items()):
        print(f"{sport}: {count}")
        
    print("\nCounts by Sport (calculated from list):")
    calc_counts = {}
    for a in final_data['athletes']:
        s = a['sport']
        calc_counts[s] = calc_counts.get(s, 0) + 1
    for sport, count in sorted(calc_counts.items()):
        print(f"{sport}: {count}")

except FileNotFoundError:
    print("athletes_real_fixed.json not found.")
