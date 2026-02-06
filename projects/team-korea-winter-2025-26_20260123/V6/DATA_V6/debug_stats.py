import json

try:
    with open('athletes_real_fixed.json', 'r') as f:
        data = json.load(f)

    stats = {}
    detailed = {}
    
    for p in data:
        disc = p.get('discipline', 'Unknown')
        sect = p.get('sector', 'Unknown')
        
        # Count primary discipline
        stats[disc] = stats.get(disc, 0) + 1
        
        # Count detailed key
        key = f"{disc} | {sect}"
        detailed[key] = detailed.get(key, 0) + 1

    output = "--- Primary Discipline ---\n"
    for k, v in stats.items():
        output += f"{k}: {v}\n"
        
    output += "\n--- Detailed (Discipline | Sector) ---\n"
    for k, v in detailed.items():
        output += f"{k}: {v}\n"

    output_path = "/Users/jenkim/Downloads/stats_output.txt"
    with open(output_path, 'w') as f:
        f.write(output)
    print("Write success")

except Exception as e:
    with open("/Users/jenkim/Downloads/stats_output.txt", 'w') as f:
        f.write(f"Error: {e}")
    print(f"Error: {e}")
