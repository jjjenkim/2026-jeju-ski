#!/usr/bin/env python3
"""
파일럿 테스트용 스크래퍼 (5명만)
"""

import requests
from bs4 import BeautifulSoup
import json
from pathlib import Path
from datetime import datetime
import time
import sys

# scraper.py의 함수들 복사
def scrape_with_retry(profile_url, name, max_retries=3):
    """재시도 로직 + 에러 로그"""
    for attempt in range(max_retries):
        try:
            return scrape_athlete(profile_url, name)
        except Exception as e:
            if attempt == max_retries - 1:
                error_log = {
                    "athlete": name,
                    "profile_url": profile_url,
                    "error": str(e),
                    "timestamp": datetime.now().isoformat()
                }
                error_file = Path("data/errors.json")
                error_file.parent.mkdir(exist_ok=True, parents=True)
                
                errors = []
                if error_file.exists():
                    try:
                        errors = json.loads(error_file.read_text())
                    except:
                        errors = []
                errors.append(error_log)
                error_file.write_text(json.dumps(errors, indent=2, ensure_ascii=False))
                
                print(f"❌ {name} 크롤링 실패: {e}")
                return {"error": str(e), "athlete": name}
            
            wait_time = 2 ** attempt
            print(f"⚠️ {name} 재시도 {attempt+1}/{max_retries} ({wait_time}초 대기)")
            time.sleep(wait_time)

def scrape_athlete(profile_url, name):
    """단일 선수 데이터 스크래핑"""
    
    headers = {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
    }
    
    response = requests.get(profile_url, headers=headers, timeout=10)
    response.raise_for_status()
    
    soup = BeautifulSoup(response.text, 'html.parser')
    results_body = soup.find('div', id='results-body')
    
    if not results_body:
        raise ValueError("results-body not found")
    
    rows = results_body.find_all('a', class_='table-row')
    
    if len(rows) == 0:
        raise ValueError("No results found")
    
    results = []
    for i, row in enumerate(rows):
        if i >= 150:
            break
        
        container = row.find('div', class_='container')
        if not container:
            continue
        
        cells = container.find_all('div', recursive=False)
        if len(cells) < 4:
            continue
        
        date_text = cells[0].text.strip()
        
        location_cells = container.find_all('div', class_='hidden-sm-down')
        location_text = location_cells[0].text.strip() if len(location_cells) > 0 else ''
        event_text = location_cells[1].text.strip() if len(location_cells) > 1 else ''
        discipline_text = location_cells[2].text.strip() if len(location_cells) > 2 else ''
        
        nation_cells = container.find_all('div', class_='country__name-short')
        nation_text = nation_cells[0].text.strip() if nation_cells else ''
        
        rank_cells = container.find_all('div', class_='g-xs-6')
        if rank_cells:
            last_cell = rank_cells[-1]
            rank_divs = last_cell.find_all('div', recursive=False)
            
            rank_text = rank_divs[0].text.strip() if len(rank_divs) > 0 else ''
            fis_points_text = rank_divs[1].text.strip() if len(rank_divs) > 1 else ''
            cup_points_text = rank_divs[2].text.strip() if len(rank_divs) > 2 else ''
        else:
            rank_text = ''
            fis_points_text = ''
            cup_points_text = ''
        
        results.append({
            "date": date_text,
            "location": location_text,
            "nation": nation_text,
            "category": event_text,
            "discipline": discipline_text,
            "rank": rank_text,
            "fis_points": fis_points_text,
            "cup_points": cup_points_text
        })
    
    return {
        "athlete": name,
        "profile_url": profile_url,
        "scraped_at": datetime.now().isoformat(),
        "results_count": len(results),
        "results": results
    }

def main():
    """파일럿 테스트 (5명)"""
    
    master_file = Path("scripts/athletes-master.json")
    athletes = json.loads(master_file.read_text())
    
    # 처음 5명만
    pilot_athletes = athletes[:5]
    
    print("=" * 60)
    print(f"파일럿 테스트 시작 ({len(pilot_athletes)}명)")
    print("=" * 60)
    
    start_time = time.time()
    success_count = 0
    error_count = 0
    
    for i, athlete in enumerate(pilot_athletes, 1):
        name = athlete['name']
        profile_url = athlete['profileUrl']
        competitor_id = athlete['competitorId']
        
        print(f"\n[{i}/{len(pilot_athletes)}] {name} (ID: {competitor_id})")
        
        data = scrape_with_retry(profile_url, name)
        
        if "error" in data:
            error_count += 1
            continue
        
        output_path = Path(f"data/raw/raw_{name}_{competitor_id}.json")
        output_path.parent.mkdir(exist_ok=True, parents=True)
        output_path.write_text(json.dumps(data, ensure_ascii=False, indent=2))
        
        print(f"  ✅ 완료 ({data['results_count']}개 결과)")
        success_count += 1
        
        time.sleep(1)
    
    elapsed_time = time.time() - start_time
    
    print("\n" + "=" * 60)
    print("파일럿 테스트 완료")
    print("=" * 60)
    print(f"성공: {success_count}명")
    print(f"실패: {error_count}명")
    print(f"소요 시간: {elapsed_time:.1f}초")
    print(f"평균 시간: {elapsed_time/len(pilot_athletes):.1f}초/명")

if __name__ == '__main__':
    main()
