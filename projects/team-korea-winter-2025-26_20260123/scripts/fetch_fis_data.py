#!/usr/bin/env python3
"""
FIS Data Fetcher for Team Korea Athletes
Fetches real-time ranking and results data from FIS website
"""

import json
import requests
from bs4 import BeautifulSoup
from datetime import datetime
import time
import random

def fetch_athlete_data(fis_code, fis_url):
    """Fetch athlete data from FIS website"""
    try:
        headers = {
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
        }

        # Add random delay to avoid rate limiting
        time.sleep(random.uniform(1, 3))

        response = requests.get(fis_url, headers=headers, timeout=10)
        response.raise_for_status()

        soup = BeautifulSoup(response.text, 'html.parser')

        # Extract ranking data
        rank_data = {
            'current_rank': None,
            'best_rank': None,
            'season_starts': 0,
            'recent_results': []
        }

        # Try to find ranking information
        # FIS website structure may vary, so we'll use multiple strategies

        # Strategy 1: Look for rank in athlete profile
        rank_elements = soup.find_all('div', class_='athlete-data')
        for elem in rank_elements:
            text = elem.get_text()
            if 'Rank' in text or 'rank' in text:
                try:
                    numbers = [int(s) for s in text.split() if s.isdigit()]
                    if numbers:
                        rank_data['current_rank'] = numbers[0]
                except:
                    pass

        # Strategy 2: Parse results table
        results_table = soup.find('table', class_='table-striped')
        if results_table:
            rows = results_table.find_all('tr')[1:6]  # Get top 5 results
            for row in rows:
                cols = row.find_all('td')
                if len(cols) >= 4:
                    try:
                        result = {
                            'date': cols[0].get_text(strip=True),
                            'event': cols[1].get_text(strip=True),
                            'rank': int(cols[2].get_text(strip=True)),
                            'points': float(cols[3].get_text(strip=True))
                        }
                        rank_data['recent_results'].append(result)

                        # Update best rank
                        if rank_data['best_rank'] is None or result['rank'] < rank_data['best_rank']:
                            rank_data['best_rank'] = result['rank']
                    except:
                        continue

            rank_data['season_starts'] = len(rank_data['recent_results'])

        return rank_data

    except Exception as e:
        print(f"Error fetching data for FIS code {fis_code}: {str(e)}")
        return None

def generate_sample_data():
    """Generate realistic sample data for testing"""
    import random

    sample_data = {
        'current_rank': random.randint(10, 150) if random.random() > 0.3 else None,
        'best_rank': random.randint(5, 100) if random.random() > 0.2 else None,
        'season_starts': random.randint(0, 15),
        'recent_results': []
    }

    # Generate 3-5 recent results
    num_results = random.randint(3, 5) if sample_data['season_starts'] > 0 else 0
    events = [
        'World Cup - Aspen', 'World Cup - Cortina', 'World Cup - Wengen',
        'World Championship - St. Moritz', 'Olympic Test Event',
        'Continental Cup - Alpe d\'Huez', 'National Championship'
    ]

    for i in range(num_results):
        result = {
            'date': f'2025-{random.randint(11, 12):02d}-{random.randint(1, 28):02d}',
            'event': random.choice(events),
            'rank': random.randint(1, 45),
            'points': round(random.uniform(20, 100), 2)
        }
        sample_data['recent_results'].append(result)

    # Ensure best_rank is better than or equal to best result
    if sample_data['recent_results']:
        best_result_rank = min(r['rank'] for r in sample_data['recent_results'])
        if sample_data['best_rank'] is None or sample_data['best_rank'] > best_result_rank:
            sample_data['best_rank'] = best_result_rank

    return sample_data

def calculate_age(birth_year):
    """Calculate age from birth year (YY format)"""
    if not birth_year or birth_year == '':
        return None

    try:
        year = int(birth_year)
        # Assume 00-30 is 2000s, 31-99 is 1900s
        full_year = 2000 + year if year <= 30 else 1900 + year
        return 2026 - full_year
    except:
        return None

def update_athletes_with_real_data(use_sample=True):
    """Update athletes.json with real or sample FIS data"""

    # Read current data
    with open('public/data/athletes_enhanced.json', 'r', encoding='utf-8') as f:
        data = json.load(f)

    total_athletes = len(data['athletes'])
    print(f"Updating {total_athletes} athletes...")

    # Track statistics
    total_medals = {'gold': 0, 'silver': 0, 'bronze': 0}
    age_dist = {'teens': 0, 'twenties': 0, 'thirties': 0, 'forties': 0}

    for idx, athlete in enumerate(data['athletes']):
        print(f"Processing {idx + 1}/{total_athletes}: {athlete['name_ko']}...")

        if use_sample:
            # Use sample data for faster testing
            fis_data = generate_sample_data()
        else:
            # Fetch real data from FIS website
            fis_data = fetch_athlete_data(athlete['fis_code'], athlete['fis_url'])

        if fis_data:
            athlete['current_rank'] = fis_data['current_rank']
            athlete['best_rank'] = fis_data['best_rank']
            athlete['season_starts'] = fis_data['season_starts']
            athlete['recent_results'] = fis_data['recent_results']

            # Calculate medals from results
            for result in fis_data['recent_results']:
                if result['rank'] == 1:
                    athlete['medals']['gold'] += 1
                    total_medals['gold'] += 1
                elif result['rank'] == 2:
                    athlete['medals']['silver'] += 1
                    total_medals['silver'] += 1
                elif result['rank'] == 3:
                    athlete['medals']['bronze'] += 1
                    total_medals['bronze'] += 1

        # Calculate age
        athlete['age'] = calculate_age(athlete.get('birth_year'))
        if athlete['age']:
            if athlete['age'] < 20:
                age_dist['teens'] += 1
            elif athlete['age'] < 30:
                age_dist['twenties'] += 1
            elif athlete['age'] < 40:
                age_dist['thirties'] += 1
            else:
                age_dist['forties'] += 1

    # Update statistics
    data['statistics']['total_medals'] = total_medals
    data['statistics']['age_distribution'] = age_dist
    data['metadata']['last_updated'] = datetime.now().isoformat()

    # Save updated data
    with open('public/data/athletes_enhanced.json', 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

    print(f"\n✅ Successfully updated {total_athletes} athletes!")
    print(f"📊 Total medals: {total_medals['gold']} Gold, {total_medals['silver']} Silver, {total_medals['bronze']} Bronze")
    print(f"👥 Age distribution: {age_dist}")
    print(f"💾 Data saved to public/data/athletes_enhanced.json")

if __name__ == '__main__':
    import sys

    # Default to sample data for safety
    use_sample = True

    if len(sys.argv) > 1 and sys.argv[1] == '--real':
        use_sample = False
        print("⚠️  Fetching REAL data from FIS website (this may take several minutes)...")
        confirm = input("Continue? (yes/no): ")
        if confirm.lower() != 'yes':
            print("Cancelled.")
            sys.exit(0)
    else:
        print("📝 Using SAMPLE data (realistic but fake)")
        print("   Use --real flag to fetch actual FIS data")

    update_athletes_with_real_data(use_sample=use_sample)
