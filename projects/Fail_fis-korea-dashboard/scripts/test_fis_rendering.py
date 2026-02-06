#!/usr/bin/env python3
"""
FIS 사이트 렌더링 방식 검증 스크립트
목적: BeautifulSoup vs Playwright 결정
"""

import requests
from bs4 import BeautifulSoup
import sys

def test_fis_rendering():
    """FIS 사이트 JavaScript 렌더링 필요 여부 확인"""
    
    # 테스트 URL (이승훈 선수 - 실제 프로젝트에서 사용 중인 URL 형식)
    test_url = "https://www.fis-ski.com/DB/general/athlete-biography.html?sectorcode=FS&competitorid=235622&type=result"
    
    print("=" * 60)
    print("FIS 사이트 렌더링 방식 검증")
    print("=" * 60)
    print(f"\n테스트 URL: {test_url}\n")
    
    try:
        # 1. requests만으로 테이블 추출 시도
        print("1️⃣ requests + BeautifulSoup 테스트 중...")
        
        # User-Agent 헤더 추가 (403 Forbidden 방지)
        headers = {
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        }
        
        response = requests.get(test_url, headers=headers, timeout=10)
        response.raise_for_status()
        
        soup = BeautifulSoup(response.text, 'html.parser')
        
        # FIS 사이트는 #results-body 내부에 a.table-row 사용
        results_body = soup.find('div', id='results-body')
        
        if results_body:
            rows = results_body.find_all('a', class_='table-row')
            if len(rows) > 0:  # 데이터 있는지 확인
                print(f"   ✅ 결과 발견: {len(rows)}개 행")
                print(f"   ✅ BeautifulSoup 사용 가능!\n")
                
                # 샘플 데이터 출력
                print("📊 샘플 데이터 (첫 3개 행):")
                for i, row in enumerate(rows[:3], 1):
                    # FIS 구조: div.container > div 셀들
                    container = row.find('div', class_='container')
                    if container:
                        cells = container.find_all('div', recursive=False)
                        if len(cells) >= 4:
                            date_text = cells[0].text.strip()
                            # 장소는 hidden-sm-down 클래스 내부
                            location_cells = container.find_all('div', class_='hidden-sm-down')
                            location_text = location_cells[0].text.strip() if location_cells else 'N/A'
                            print(f"   {i}. 날짜: {date_text}, 장소: {location_text}")
                
                print("\n" + "=" * 60)
                print("결론: BeautifulSoup 사용 권장")
                print("=" * 60)
                print("장점:")
                print("  - 빠른 속도 (선수당 ~0.3초)")
                print("  - 낮은 메모리 사용량")
                print("  - 간단한 구현")
                print("\n다음 단계: scraper.py 구현 (BeautifulSoup 기반)")
                
                return "beautifulsoup"
            else:
                print("   ⚠️ results-body는 있지만 데이터 없음")
        else:
            print("   ❌ results-body 없음 (id='results-body' 찾을 수 없음)")
        
        # 2. JavaScript 렌더링 필요
        print("\n2️⃣ JavaScript 렌더링 필요 판정\n")
        print("=" * 60)
        print("결론: Playwright 사용 필요")
        print("=" * 60)
        print("이유:")
        print("  - FIS 사이트가 JavaScript로 테이블 생성")
        print("  - 정적 HTML에 데이터 없음")
        print("\n예상 영향:")
        print("  - 스크래핑 속도: 선수당 ~1~1.5초")
        print("  - 메모리 사용량: 증가")
        print("  - 구현 복잡도: 증가")
        print("\n다음 단계: scraper.py 설계 변경 (Playwright 기반)")
        
        return "playwright"
        
    except requests.RequestException as e:
        print(f"❌ 네트워크 오류: {e}")
        print("\n해결 방법:")
        print("  1. 인터넷 연결 확인")
        print("  2. FIS 사이트 접속 가능 여부 확인")
        print("  3. VPN/프록시 설정 확인")
        return "error"
    
    except Exception as e:
        print(f"❌ 예상치 못한 오류: {e}")
        return "error"

if __name__ == '__main__':
    result = test_fis_rendering()
    
    # 종료 코드
    if result == "beautifulsoup":
        sys.exit(0)  # 성공
    elif result == "playwright":
        sys.exit(1)  # Playwright 필요
    else:
        sys.exit(2)  # 오류
