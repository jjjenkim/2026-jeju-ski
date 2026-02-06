#!/usr/bin/env python3
"""
FIS 데이터 스크래퍼 (BeautifulSoup 기반)
목적: FIS 사이트에서 선수별 경기 결과 수집
"""

import requests
from bs4 import BeautifulSoup
import json
from pathlib import Path
from datetime import datetime
import time
import sys

def scrape_with_retry(profile_url, name, max_retries=3):
    """재시도 로직 + 에러 로그"""
    for attempt in range(max_retries):
        try:
            return scrape_athlete(profile_url, name)
        except Exception as e:
            if attempt == max_retries - 1:
                # 최종 실패 시 에러 파일 생성
                error_log = {
                    "athlete": name,
                    "profile_url": profile_url,
                    "error": str(e),
                    "timestamp": datetime.now().isoformat()
                }
                error_file = Path("data/errors.json")
                error_file.parent.mkdir(exist_ok=True, parents=True)
                
                # 기존 에러 로그에 추가
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
            
            # 지수 백오프
            wait_time = 2 ** attempt
            print(f"⚠️ {name} 재시도 {attempt+1}/{max_retries} ({wait_time}초 대기)")
            time.sleep(wait_time)

def scrape_athlete(profile_url, name):
    """단일 선수 데이터 스크래핑"""
    
    headers = {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
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
        if i >= 150:  # 최근 150개 결과만 (약 3-4 시즌)
            break
        
        container = row.find('div', class_='container')
        if not container:
            continue
        
        cells = container.find_all('div', recursive=False)
        if len(cells) < 4:
            continue
        
        # 날짜
        date_text = cells[0].text.strip()
        
        # 장소 (hidden-sm-down 클래스 내부)
        location_cells = container.find_all('div', class_='hidden-sm-down')
        location_text = location_cells[0].text.strip() if len(location_cells) > 0 else ''
        
        # 대회 종류 (event)
        event_text = location_cells[1].text.strip() if len(location_cells) > 1 else ''
        
        # 세부종목 (discipline)
        discipline_text = location_cells[2].text.strip() if len(location_cells) > 2 else ''
        
        # 국가 (nation)
        nation_cells = container.find_all('div', class_='country__name-short')
        nation_text = nation_cells[0].text.strip() if nation_cells else ''
        
        # 순위 및 포인트 (마지막 셀)
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

# 캐싱 전략
def is_cache_fresh(cache_file, max_age_hours=24):
    """캐시가 24시간 이내면 재사용"""
    if not cache_file.exists():
        return False
    
    mtime = cache_file.stat().st_mtime
    age = time.time() - mtime
    return age < (max_age_hours * 3600)

def main():
    """메인 실행 함수"""
    
    # athletes-master.json 읽기
    master_file = Path("scripts/athletes-master.json")
    if not master_file.exists():
        print(f"❌ {master_file} 파일을 찾을 수 없습니다.")
        sys.exit(1)
    
    athletes = json.loads(master_file.read_text())
    
    print("=" * 60)
    print(f"FIS 데이터 스크래핑 시작 ({len(athletes)}명)")
    print("=" * 60)
    
    success_count = 0
    error_count = 0
    cache_count = 0
    
    for i, athlete in enumerate(athletes, 1):
        name = athlete['name']
        profile_url = athlete['profileUrl']
        competitor_id = athlete['competitorId']
        
        print(f"\n[{i}/{len(athletes)}] {name} (ID: {competitor_id})")
        
        # 캐시 확인
        cache_file = Path(f"data/cache/cache_{competitor_id}.json")
        if is_cache_fresh(cache_file):
            print(f"  ✅ 캐시 사용 (24시간 이내)")
            cache_count += 1
            continue
        
        # 스크래핑
        data = scrape_with_retry(profile_url, name)
        
        if "error" in data:
            error_count += 1
            continue
        
        # 저장
        output_path = Path(f"data/raw/raw_{name}_{competitor_id}.json")
        output_path.parent.mkdir(exist_ok=True, parents=True)
        output_path.write_text(json.dumps(data, ensure_ascii=False, indent=2))
        
        # 캐시 저장
        cache_file.parent.mkdir(exist_ok=True, parents=True)
        cache_file.write_text(json.dumps(data, ensure_ascii=False, indent=2))
        
        print(f"  ✅ 완료 ({data['results_count']}개 결과)")
        success_count += 1
        
        # Rate limiting (1초 대기)
        time.sleep(1)
    
    # 최종 결과
    print("\n" + "=" * 60)
    print("스크래핑 완료")
    print("=" * 60)
    print(f"성공: {success_count}명")
    print(f"캐시: {cache_count}명")
    print(f"실패: {error_count}명")
    print(f"총: {len(athletes)}명")
    
    if error_count > 0:
        print(f"\n⚠️ 에러 로그: data/errors.json")

if __name__ == '__main__':
    main()
