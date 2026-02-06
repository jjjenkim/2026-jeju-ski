import json
import collections

try:
    with open('/Users/jenkim/Downloads/2026_Antigravity/projects/team-korea-winter-2025-26_20260123/V6/DATA_V6/athletes_real_fixed.json', 'r') as f:
        data = json.load(f)

    stats = collections.defaultdict(int)
    details = collections.defaultdict(list)

    for p in data:
        sport = p.get('sport', 'Unknown')
        rank_context = p.get('rank_context', 'Unknown')
        name = p.get('name_en', 'Unknown')
        
        # Create a specific key for the breakdown
        key = f"{sport} | {rank_context}"
        stats[key] += 1
        details[key].append(name)

    print("--- BREAKDOWN START ---")
    for key in sorted(stats.keys()):
        print(f"{key}: {stats[key]}")
    print("--- BREAKDOWN END ---")

except Exception as e:
    print(f"Error: {e}")
