import json
import os
import sys

def audit_data(file_path):
    print(f"🔍 Auditing Data File: {file_path}")
    
    if not os.path.exists(file_path):
        print("❌ Error: File not found!")
        return False

    with open(file_path, 'r', encoding='utf-8') as f:
        try:
            data = json.load(f)
        except json.JSONDecodeError as e:
            print(f"❌ JSON Decode Error: {e}")
            return False

    athletes = data.get('athletes', [])
    print(f"📊 Total Athletes Found: {len(athletes)} (Expected: 43)")
    
    if len(athletes) != 43:
        print(f"❌ Critical Error: Expected 43 athletes, found {len(athletes)}")
        return False

    score = 100
    errors = []

    for i, athlete in enumerate(athletes):
        # 1. Check Vital IDs
        if not athlete.get('id'):
            errors.append(f"Athlete #{i}: Missing ID")
            score -= 5
        if not athlete.get('name_ko'):
            errors.append(f"Athlete #{i}: Missing Korean Name")
            score -= 5
            
        # 2. Check FIS URL
        fis_url = athlete.get('fis_url', '')
        if not fis_url or 'fis-ski.com' not in fis_url:
            errors.append(f"Athlete {athlete.get('name_ko')}: Invalid or Missing FIS URL")
            score -= 2

        # 3. Check Stats (Rank should be number or null, not undefined string)
        # Note: Rank can be null if unranked, that's fine, but ensure the field exists
        if 'current_rank' not in athlete:
            errors.append(f"Athlete {athlete.get('name_ko')}: Missing logical field 'current_rank'")
            score -= 1

    print("\n📝 Audit Results:")
    if not errors:
        print("✅ No integrity errors found.")
    else:
        for err in errors:
            print(f"   - {err}")
    
    print(f"\n🏆 Data Quality Score: {score}/100")
    
    if score >= 90:
        print("✅ PASSED (Score >= 90)")
        return True
    else:
        print("❌ FAILED (Score < 90)")
        return False

if __name__ == "__main__":
    success = audit_data('public/data/athletes_enhanced.json')
    if not success:
        sys.exit(1)
