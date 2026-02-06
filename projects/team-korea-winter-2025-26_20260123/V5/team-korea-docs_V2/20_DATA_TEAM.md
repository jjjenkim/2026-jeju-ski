# 20_DATA_TEAM.md
**Data Team Agents**  
**데이터 수집, 처리, 검증**

---

## 🎯 팀 미션

FIS 공식 데이터를 수집하고 정제하여 **정확하고 신뢰할 수 있는** 선수 데이터를 제공합니다.

---

## 👥 팀 구성

### Agent A: FIS 스크래퍼
**역할**: 선수별 FIS 페이지 크롤링 및 데이터 추출

### Agent B: 데이터 정제
**역할**: 수집된 데이터 검증, 표준화, 통계 계산

---

## 📊 데이터 수집 전략

### 하이브리드 접근법

```
1차: FIS API 시도
    ↓ (실패 시)
2차: 웹 스크래핑
    ↓
검증 및 병합
    ↓
최종 JSON 생성
```

---

## 🔍 Agent A: FIS 스크래퍼

### 입력 데이터

**선수 URL 리스트** (예시):
```
https://www.fis-ski.com/DB/general/athlete.html?sectorcode=FS&competitorid=123456
https://www.fis-ski.com/DB/general/athlete.html?sectorcode=SB&competitorid=789012
...
```

### 크롤링 대상 정보

**선수 프로필**:
- 이름 (영문, 한글 가능하면)
- 생년월일
- 성별
- 국적
- FIS 코드

**성적 데이터**:
- 현재 시즌 순위
- 역대 최고 순위
- 출전 경기 수
- 메달 획득 (금/은/동)

**최근 결과** (최대 5경기):
- 대회 날짜
- 대회명
- 순위
- 포인트

### 구현 예시 (Python)

```python
import requests
from bs4 import BeautifulSoup
import json
from datetime import datetime
import time

class FISScraper:
    """FIS 선수 데이터 스크래퍼"""
    
    def __init__(self, cache_file="data/cache/scraper_cache.json"):
        self.cache_file = cache_file
        self.cache = self._load_cache()
        self.headers = {
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)'
        }
    
    def _load_cache(self):
        """캐시 로드"""
        try:
            with open(self.cache_file, 'r') as f:
                return json.load(f)
        except FileNotFoundError:
            return {}
    
    def _save_cache(self):
        """캐시 저장"""
        with open(self.cache_file, 'w') as f:
            json.dump(self.cache, f, indent=2)
    
    def scrape_athlete(self, url):
        """선수 데이터 크롤링"""
        
        # 캐시 확인
        if url in self.cache:
            cache_time = datetime.fromisoformat(self.cache[url]['timestamp'])
            if (datetime.now() - cache_time).days < 7:
                print(f"캐시 사용: {url}")
                return self.cache[url]['data']
        
        try:
            response = requests.get(url, headers=self.headers, timeout=10)
            response.raise_for_status()
            soup = BeautifulSoup(response.content, 'html.parser')
            
            # 데이터 추출 (실제 FIS 페이지 구조에 맞게 조정 필요)
            data = {
                'fis_url': url,
                'fis_code': self._extract_fis_code(url),
                'name_en': self._extract_name(soup),
                'birth_date': self._extract_birth_date(soup),
                'gender': self._extract_gender(soup),
                'current_rank': self._extract_current_rank(soup),
                'best_rank': self._extract_best_rank(soup),
                'season_starts': self._extract_season_starts(soup),
                'medals': self._extract_medals(soup),
                'recent_results': self._extract_recent_results(soup)
            }
            
            # 캐시 저장
            self.cache[url] = {
                'timestamp': datetime.now().isoformat(),
                'data': data
            }
            self._save_cache()
            
            # Rate limiting
            time.sleep(2)
            
            return data
            
        except Exception as e:
            print(f"크롤링 실패: {url} - {str(e)}")
            return None
    
    def _extract_fis_code(self, url):
        """URL에서 FIS 코드 추출"""
        # competitorid=123456
        try:
            return url.split('competitorid=')[1]
        except:
            return None
    
    def _extract_name(self, soup):
        """이름 추출"""
        # 실제 페이지 구조에 맞게 구현
        try:
            name_elem = soup.find('h1', class_='athlete-name')
            return name_elem.text.strip() if name_elem else None
        except:
            return None
    
    def _extract_birth_date(self, soup):
        """생년월일 추출"""
        # 실제 페이지 구조에 맞게 구현
        try:
            birth_elem = soup.find('span', class_='birth-date')
            return birth_elem.text.strip() if birth_elem else None
        except:
            return None
    
    def _extract_gender(self, soup):
        """성별 추출"""
        # 실제 페이지 구조에 맞게 구현
        return "M"  # 임시
    
    def _extract_current_rank(self, soup):
        """현재 랭킹 추출"""
        # 실제 페이지 구조에 맞게 구현
        return None
    
    def _extract_best_rank(self, soup):
        """최고 랭킹 추출"""
        # 실제 페이지 구조에 맞게 구현
        return None
    
    def _extract_season_starts(self, soup):
        """시즌 출전 횟수 추출"""
        # 실제 페이지 구조에 맞게 구현
        return 0
    
    def _extract_medals(self, soup):
        """메달 추출"""
        # 실제 페이지 구조에 맞게 구현
        return {'gold': 0, 'silver': 0, 'bronze': 0}
    
    def _extract_recent_results(self, soup):
        """최근 5경기 결과 추출"""
        # 실제 페이지 구조에 맞게 구현
        return []
    
    def scrape_all(self, urls):
        """전체 선수 크롤링"""
        results = []
        for i, url in enumerate(urls):
            print(f"크롤링 진행: {i+1}/{len(urls)}")
            data = self.scrape_athlete(url)
            if data:
                results.append(data)
        return results


# 사용 예시
if __name__ == "__main__":
    scraper = FISScraper()
    
    # 선수 URL 리스트 (실제 데이터로 교체 필요)
    urls = [
        "https://www.fis-ski.com/DB/general/athlete.html?sectorcode=FS&competitorid=123456",
        # ... 43명 전체 URL
    ]
    
    results = scraper.scrape_all(urls)
    
    # 결과 저장
    with open('data/raw/scraped_data.json', 'w', encoding='utf-8') as f:
        json.dump(results, f, indent=2, ensure_ascii=False)
    
    print(f"완료: {len(results)}명 데이터 수집")
```

---

## 🔧 Agent B: 데이터 정제

### 주요 작업

1. **종목명 표준화**
2. **누락 데이터 체크**
3. **통계 계산**
4. **최종 JSON 생성**

### 종목 매핑

```json
{
  "AL": "alpine_skiing",
  "SX": "ski_cross",
  "MO": "freestyle_moguls",
  "FS": "freestyle_park",
  "SB": "snowboard_park",
  "SBX": "snowboard_cross",
  "PSL": "snowboard_alpine"
}
```

### 구현 예시 (Python)

```python
import json
from datetime import datetime
from collections import Counter

class DataProcessor:
    """데이터 정제 및 통계 생성"""
    
    def __init__(self, input_file="data/raw/scraped_data.json"):
        self.input_file = input_file
        self.sport_mapping = {
            "AL": "alpine_skiing",
            "SX": "ski_cross",
            "MO": "freestyle_moguls",
            "FS": "freestyle_park",
            "SB": "snowboard_park",
            "SBX": "snowboard_cross",
            "PSL": "snowboard_alpine"
        }
        self.sport_display = {
            "alpine_skiing": "Alpine Skiing",
            "ski_cross": "Ski Cross",
            "freestyle_moguls": "Freestyle - Moguls",
            "freestyle_park": "Freestyle - Park & Pipe",
            "snowboard_park": "Snowboard - Park & Pipe",
            "snowboard_cross": "Snowboard Cross",
            "snowboard_alpine": "Snowboard Alpine"
        }
        self.team_mapping = {
            "freestyle_moguls": "프리스타일",
            "freestyle_park": "프리스타일",
            "snowboard_park": "스노보드",
            "snowboard_cross": "스노보드",
            "snowboard_alpine": "스노보드"
        }
    
    def load_data(self):
        """원본 데이터 로드"""
        with open(self.input_file, 'r', encoding='utf-8') as f:
            return json.load(f)
    
    def calculate_age(self, birth_date):
        """나이 계산"""
        if not birth_date:
            return None
        try:
            birth = datetime.strptime(birth_date, "%Y-%m-%d")
            today = datetime.now()
            return today.year - birth.year - ((today.month, today.day) < (birth.month, birth.day))
        except:
            return None
    
    def standardize_sport(self, sport_code):
        """종목 표준화"""
        return self.sport_mapping.get(sport_code, "unknown")
    
    def process_athletes(self, raw_data):
        """선수 데이터 처리"""
        processed = []
        
        for i, athlete in enumerate(raw_data):
            sport = self.standardize_sport(athlete.get('sport_code', ''))
            
            processed_athlete = {
                'id': f"KOR{i+1:03d}",
                'name_ko': athlete.get('name_ko', ''),
                'name_en': athlete.get('name_en', ''),
                'birth_date': athlete.get('birth_date'),
                'age': self.calculate_age(athlete.get('birth_date')),
                'gender': athlete.get('gender', 'M'),
                'sport': sport,
                'sport_display': self.sport_display.get(sport, ''),
                'team': self.team_mapping.get(sport, '기타'),
                'fis_code': athlete.get('fis_code'),
                'fis_url': athlete.get('fis_url'),
                'current_rank': athlete.get('current_rank'),
                'best_rank': athlete.get('best_rank'),
                'season_starts': athlete.get('season_starts', 0),
                'medals': athlete.get('medals', {'gold': 0, 'silver': 0, 'bronze': 0}),
                'recent_results': athlete.get('recent_results', [])
            }
            
            processed.append(processed_athlete)
        
        return processed
    
    def generate_statistics(self, athletes):
        """통계 생성"""
        stats = {
            'total_athletes': len(athletes),
            'by_sport': Counter(a['sport'] for a in athletes),
            'by_team': Counter(a['team'] for a in athletes),
            'by_gender': Counter(a['gender'] for a in athletes),
            'age_distribution': {
                'teens': sum(1 for a in athletes if a['age'] and 10 <= a['age'] < 20),
                'twenties': sum(1 for a in athletes if a['age'] and 20 <= a['age'] < 30),
                'thirties': sum(1 for a in athletes if a['age'] and 30 <= a['age'] < 40),
            },
            'total_medals': {
                'gold': sum(a['medals']['gold'] for a in athletes),
                'silver': sum(a['medals']['silver'] for a in athletes),
                'bronze': sum(a['medals']['bronze'] for a in athletes)
            }
        }
        return stats
    
    def validate_data(self, athletes):
        """데이터 검증"""
        issues = []
        
        for athlete in athletes:
            # 필수 필드 체크
            if not athlete.get('name_en'):
                issues.append(f"{athlete['id']}: 영문 이름 누락")
            if not athlete.get('fis_code'):
                issues.append(f"{athlete['id']}: FIS 코드 누락")
            if not athlete.get('birth_date'):
                issues.append(f"{athlete['id']}: 생년월일 누락")
        
        return issues
    
    def save_final_data(self, athletes, output_file="data/athletes.json"):
        """최종 JSON 저장"""
        stats = self.generate_statistics(athletes)
        
        final_data = {
            'metadata': {
                'last_updated': datetime.now().isoformat(),
                'total_athletes': stats['total_athletes'],
                'sports': len(stats['by_sport']),
                'teams': len(stats['by_team'])
            },
            'statistics': stats,
            'athletes': athletes
        }
        
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(final_data, f, indent=2, ensure_ascii=False)
        
        print(f"✅ 최종 데이터 저장 완료: {output_file}")
        print(f"   - 총 선수: {stats['total_athletes']}명")
        print(f"   - 종목: {stats['by_sport']}")
        print(f"   - 팀: {stats['by_team']}")
    
    def process(self):
        """전체 프로세스 실행"""
        print("📊 데이터 처리 시작...")
        
        # 1. 데이터 로드
        raw_data = self.load_data()
        print(f"✓ 원본 데이터 로드: {len(raw_data)}건")
        
        # 2. 데이터 처리
        athletes = self.process_athletes(raw_data)
        print(f"✓ 데이터 처리 완료: {len(athletes)}명")
        
        # 3. 데이터 검증
        issues = self.validate_data(athletes)
        if issues:
            print("⚠️  데이터 검증 이슈:")
            for issue in issues:
                print(f"   - {issue}")
        else:
            print("✓ 데이터 검증 통과")
        
        # 4. 최종 저장
        self.save_final_data(athletes)
        
        return athletes


# 사용 예시
if __name__ == "__main__":
    processor = DataProcessor()
    athletes = processor.process()
```

---

## 📅 자동화 스케줄러

### Cron 설정

```bash
# 매주 수요일 오전 9시 실행
0 9 * * 3 cd /path/to/project && python src/data_pipeline.py
```

### 전체 파이프라인

```python
#!/usr/bin/env python3
"""
data_pipeline.py
전체 데이터 수집 및 처리 파이프라인
"""

import sys
from pathlib import Path

# 프로젝트 루트를 sys.path에 추가
project_root = Path(__file__).parent.parent
sys.path.insert(0, str(project_root))

from src.fis_scraper import FISScraper
from src.data_processor import DataProcessor

def main():
    print("=" * 50)
    print("Team Korea Data Pipeline")
    print("=" * 50)
    
    # 1. 선수 URL 리스트 로드
    url_file = project_root / "data" / "raw" / "athlete_urls.txt"
    with open(url_file, 'r') as f:
        urls = [line.strip() for line in f if line.strip()]
    
    print(f"\n📋 선수 URL: {len(urls)}개")
    
    # 2. FIS 데이터 크롤링
    print("\n🔍 FIS 데이터 크롤링 시작...")
    scraper = FISScraper()
    raw_data = scraper.scrape_all(urls)
    print(f"✓ 크롤링 완료: {len(raw_data)}명")
    
    # 3. 데이터 처리
    print("\n📊 데이터 처리 시작...")
    processor = DataProcessor()
    athletes = processor.process()
    
    print("\n✅ 전체 파이프라인 완료!")
    print("=" * 50)

if __name__ == "__main__":
    main()
```

---

## 📂 데이터 파일 구조

```
data/
├── raw/
│   ├── athlete_urls.txt        # 선수 URL 리스트
│   └── scraped_data.json       # 크롤링 원본
├── processed/
│   └── validated_data.json     # 검증된 데이터
├── cache/
│   └── scraper_cache.json      # 크롤링 캐시
└── athletes.json               # 최종 데이터 (배포용)
```

---

## 🔔 에러 처리

### 일반적인 에러

1. **네트워크 에러**: 재시도 (최대 3회)
2. **파싱 에러**: 로그 기록, 해당 선수 스킵
3. **인코딩 에러**: UTF-8 강제 적용
4. **Rate Limit**: 2초 지연

### 로깅

```python
import logging

logging.basicConfig(
    filename='logs/data_pipeline.log',
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)

logger = logging.getLogger(__name__)
```

---

## ✅ 체크리스트

- [ ] 선수 URL 리스트 수신 (43명)
- [ ] FIS 스크래퍼 개발
- [ ] 데이터 정제 스크립트 개발
- [ ] athletes.json 생성
- [ ] 데이터 검증 (누락 체크)
- [ ] Cron 스케줄러 설정
- [ ] 에러 핸들링 구현
- [ ] 로깅 시스템 구축

---

**담당자**: Data Team Agents  
**마지막 업데이트**: 2026-01-23  
**상태**: 🟡 선수 URL 대기 중
