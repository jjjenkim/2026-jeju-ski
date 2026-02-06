import json
import re
import os

# Paths
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
JSON_FILE = os.path.join(BASE_DIR, 'athletes_real_fixed.json')
PIPELINE_FILE = os.path.join(BASE_DIR, 'data_pipeline_complete.py')

def extract_urls_from_pipeline():
    """Extracts (name_kr, fis_url) pairs from the RAW_TEAM_DATA string in the pipeline file."""
    print(f"Reading pipeline file: {PIPELINE_FILE}")
    with open(PIPELINE_FILE, 'r', encoding='utf-8') as f:
        content = f.read()

    # Find the RAW_TEAM_DATA string
    start_marker = 'RAW_TEAM_DATA = """'
    end_marker = '"""'
    
    start_idx = content.find(start_marker)
    if start_idx == -1:
        raise ValueError("Could not find RAW_TEAM_DATA in pipeline file")
    
    start_idx += len(start_marker)
    end_idx = content.find(end_marker, start_idx)
    
    raw_data = content[start_idx:end_idx]
    
    # Parse the raw data
    url_map = {}
    lines = raw_data.split('\n')
    i = 0
    while i < len(lines):
        line = lines[i].strip()
        # Look for name line: "- Name(YY) —"
        if line.startswith("-") and "(" in line:
            name_part = line.split("—")[0].replace("-", "").strip()
            match = re.match(r"([가-힣]+)\((\d+)\)", name_part)
            if match:
                name_kr = match.group(1)
                # Check next line for URL
                if i + 1 < len(lines) and "http" in lines[i+1]:
                    fis_url = lines[i+1].strip()
                    url_map[name_kr] = fis_url
                    i += 1
        i += 1
    
    return url_map

def update_json_file(url_map):
    """Updates the JSON file with the extracted URLs."""
    print(f"Reading JSON file: {JSON_FILE}")
    with open(JSON_FILE, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    # Check if data is a list or dict
    if isinstance(data, list):
        athletes = data
    elif isinstance(data, dict) and 'athletes' in data:
        athletes = data['athletes']
    else:
        raise ValueError("Unknown JSON structure: Could not find athlete list")
    
    updated_count = 0
    
    for athlete in athletes:
        name = athlete.get('name_ko')
        if name and name in url_map:
            athlete['fis_url'] = url_map[name]
            updated_count += 1
        # else:
        #     print(f"Warning: No URL found for {name}")

    print(f"Writing updated data back to {JSON_FILE}")
    with open(JSON_FILE, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=4)
        
    print(f"✅ Successfully updated {updated_count} athletes with FIS URLs.")

def main():
    try:
        url_map = extract_urls_from_pipeline()
        print(f"Found {len(url_map)} URLs in pipeline data.")
        update_json_file(url_map)
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    main()
