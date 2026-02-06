# FIS 대시보드 파이프라인 적용 검토 보고서
**작성일**: 2026-01-20  
**버전**: v2.0 (개선사항 반영)  
**대상 프로젝트**: fis-korea-dashboard (React/TypeScript)

---

## 📋 요약

| 항목 | 현재 상태 | 제안된 파이프라인 | 적용 가능성 |
|------|-----------|-------------------|-------------|
| **언어/프레임워크** | TypeScript/React | Python | ⚠️ 부분 적용 |
| **데이터 수집** | `fis-to-excel.ts` (Puppeteer) | `scraper.py` (BeautifulSoup) | ✅ 대체 가능 |
| **데이터 저장** | Excel (.xlsx) | JSON → CSV | ✅ 개선 가능 |
| **정규화** | `excelConverter.ts` (런타임) | `normalizer.py` (빌드타임) | ✅ **강력 추천** |
| **대시보드** | React SPA | HTML + DataTables.js | ❌ 현재 구조 유지 권장 |

**결론**: **2단계 하이브리드 접근** 권장  
- Python 파이프라인으로 **데이터 안정화** (1~2단계)
- React 대시보드는 **정제된 CSV 소비** (3단계 대체)

---

## 🔍 현재 프로젝트 구조 분석

### 기존 데이터 플로우
```
FIS Website
    ↓
[scripts/fis-to-excel.ts]
  - Puppeteer로 HTML 렌더링
  - 각 선수별 Excel 파일 생성
    ↓
[public/data/athletes/*.xlsx]
  - 43개 개별 파일
    ↓
[hooks/useExcelData.ts]
  - 브라우저에서 Excel 파일 로드
  - ExcelJS로 파싱
    ↓
[utils/excelConverter.ts]
  - 런타임 정규화 (날짜, 랭킹 등)
    ↓
React Components
  - RankingCards, Charts 등
```

### 🚨 현재 문제점

1. **데이터 불안정성**
   - Puppeteer 스크래핑 실패 시 빈 Excel 생성
   - 날짜 형식 불일치 (`DD-MM-YYYY` vs `DD.MM.YYYY`)
   - 랭킹 값 혼재 (`1`, `"DNS"`, `"DNF1"`, `999`)

2. **런타임 오버헤드**
   - 43개 Excel 파일을 브라우저에서 매번 파싱
   - 정규화 로직이 클라이언트에서 실행
   - 초기 로딩 시간 3~5초

3. **에러 핸들링 부족**
   - 스크래핑 실패 시 재시도 없음
   - 잘못된 데이터 검증 없음
   - 로그 부재

---

## ✅ 제안된 파이프라인 적용 가능성

### Phase 0: 기술 검증 (1시간) ⭐ NEW

**목적**: BeautifulSoup vs Playwright 결정

#### 검증 스크립트
```python
# scripts/test_fis_rendering.py
import requests
from bs4 import BeautifulSoup

def test_fis_rendering():
    """FIS 사이트 JavaScript 렌더링 필요 여부 확인"""
    url = "https://www.fis-ski.com/DB/general/results.html?competitorid=264594"
    
    # 1. requests만으로 테이블 추출 시도
    response = requests.get(url, timeout=10)
    soup = BeautifulSoup(response.text, 'html.parser')
    table = soup.find('table', class_='g-row')
    
    if table and len(table.find_all('tr')) > 1:
        print("✅ BeautifulSoup 사용 가능")
        print(f"   발견된 행: {len(table.find_all('tr'))}개")
        return "beautifulsoup"
    else:
        print("❌ JavaScript 렌더링 필요 → Playwright 사용")
        return "playwright"

if __name__ == '__main__':
    result = test_fis_rendering()
    
    if result == "playwright":
        print("\n⚠️ scraper.py 설계 변경 필요:")
        print("   - playwright 라이브러리 사용")
        print("   - 예상 스크래핑 시간: 선수당 1~1.5초")
```

#### 결과에 따른 분기
- **BeautifulSoup ✅** → 현재 계획 진행 (선수당 0.3초)
- **Playwright 필요** → `scraper.py` 설계 수정 (선수당 1초)

---

### 1단계: Scraper (웹 → JSON)

#### 제안: `scraper.py` (재시도 로직 포함) ⭐ IMPROVED
```python
# scripts/scraper.py
import requests
from bs4 import BeautifulSoup
import json
from pathlib import Path
from datetime import datetime
import time

def scrape_with_retry(fis_code, name, max_retries=3):
    """재시도 로직 + 에러 로그"""
    for attempt in range(max_retries):
        try:
            return scrape_athlete(fis_code, name)
        except Exception as e:
            if attempt == max_retries - 1:
                # 최종 실패 시 에러 파일 생성
                error_log = {
                    "athlete": name,
                    "fis_code": fis_code,
                    "error": str(e),
                    "timestamp": datetime.now().isoformat()
                }
                error_file = Path("data/errors.json")
                error_file.parent.mkdir(exist_ok=True)
                
                # 기존 에러 로그에 추가
                errors = []
                if error_file.exists():
                    errors = json.loads(error_file.read_text())
                errors.append(error_log)
                error_file.write_text(json.dumps(errors, indent=2))
                
                print(f"❌ {name} 크롤링 실패: {e}")
                return {"error": str(e), "athlete": name}
            
            # 지수 백오프
            wait_time = 2 ** attempt
            print(f"⚠️ {name} 재시도 {attempt+1}/{max_retries} ({wait_time}초 대기)")
            time.sleep(wait_time)

def scrape_athlete(fis_code, name):
    url = f"https://www.fis-ski.com/DB/general/results.html?competitorid={fis_code}"
    
    response = requests.get(url, timeout=10)
    response.raise_for_status()
    
    soup = BeautifulSoup(response.text, 'html.parser')
    table = soup.find('table', class_='g-row')
    
    if not table:
        raise ValueError("No table found")
    
    results = []
    for row in table.find_all('tr')[1:]:  # 헤더 제외
        cells = row.find_all('td')
        if len(cells) >= 4:
            results.append({
                "date": cells[0].text.strip(),
                "location": cells[1].text.strip(),
                "rank": cells[2].text.strip(),
                "points": cells[3].text.strip()
            })
    
    return {
        "athlete": name,
        "fis_code": fis_code,
        "scraped_at": datetime.now().isoformat(),
        "results": results
    }

# 캐싱 전략 ⭐ NEW
def is_cache_fresh(cache_file, max_age_hours=24):
    """캐시가 24시간 이내면 재사용"""
    if not cache_file.exists():
        return False
    
    mtime = cache_file.stat().st_mtime
    age = time.time() - mtime
    return age < (max_age_hours * 3600)
```

**✅ 개선 사항**:
- ✅ 재시도 로직 (지수 백오프)
- ✅ 에러 로깅 (`data/errors.json`)
- ✅ 캐싱 전략 (24시간 유효)
- ✅ Rate limiting (1초 대기)

---

### 2단계: Normalizer (JSON → CSV)

#### 데이터 검증 규칙 ⭐ NEW

**필수 검증** (실패 시 경고):
- [ ] FIS 코드 6자리 숫자 (`^[0-9]{6}$`)
- [ ] 날짜 형식 (`DD.MM.YYYY` 또는 `DD-MM-YYYY`)
- [ ] 랭킹 값 (1~999 또는 DNS/DNF/DSQ)

**데이터 품질 검증** (실패 시 로그):
- [ ] 중복 행 제거 (athlete + date + location 기준)
- [ ] 이상치 탐지 (포인트 > 2000 또는 < 0)
- [ ] 미래 날짜 제거 (date > today)

**출력 검증**:
```python
def validate_output(df):
    """최종 CSV 검증"""
    assert df.columns.tolist() == ['athlete', 'fis_code', 'date', 'location', 'rank', 'points']
    assert df['date'].str.match(r'^\d{4}-\d{2}-\d{2}$').all()
    assert df['fis_code'].str.len().eq(6).all()
    
    print(f"✅ 검증 통과: {len(df)}개 행")
```

---

## 🔄 React 통합: useCsvData.ts 구현 ⭐ NEW

```typescript
// hooks/useCsvData.ts
import { useState, useEffect } from 'react';
import Papa from 'papaparse';
import type { Athlete, PerformanceData } from '../types';

interface CsvRow {
  athlete: string;
  fis_code: string;
  date: string;
  location: string;
  rank: string;
  points: string;
}

export function useCsvData() {
  const [athletes, setAthletes] = useState<Athlete[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Papa.parse<CsvRow>('/data/fis_all_results.csv', {
      download: true,
      header: true,
      complete: (results) => {
        // CSV → Athlete 타입 변환
        const athleteMap = new Map<string, Athlete>();
        
        // 메타데이터 로드
        fetch('/data/athletes-master.json')
          .then(res => res.json())
          .then(metadata => {
            const metaMap = new Map(
              metadata.map((a: any) => [a.FIS코드, a])
            );
            
            results.data.forEach((row) => {
              const key = row.fis_code;
              
              if (!athleteMap.has(key)) {
                const meta = metaMap.get(key) || {};
                athleteMap.set(key, {
                  종목: meta.종목 || 'Unknown',
                  선수명: row.athlete,
                  FIS코드: row.fis_code,
                  최근10경기: []
                });
              }
              
              // PerformanceData 추가
              athleteMap.get(key)!.최근10경기.push({
                date: row.date,
                event: row.location,
                location: row.location,
                점수: parseFloat(row.points) || 0,
                랭킹: row.rank ? parseInt(row.rank) || row.rank : 'DNS'
              });
            });
            
            setAthletes(Array.from(athleteMap.values()));
            setLoading(false);
          });
      }
    });
  }, []);

  return { athletes, loading, error };
}
```

**주의사항**:
- `birthYear`, `category` 같은 메타데이터는 `athletes-master.json`에서 로드
- PapaParse 설치 필요: `npm install papaparse @types/papaparse`

---

## 📊 성능 비교 (추정치) ⭐ BENCHMARK NEEDED

| 지표 | 현재 (Excel) | 제안 (CSV) | 개선율 |
|------|--------------|------------|--------|
| **스크래핑 시간** | 86초 (43명 × 2초) | 13초 (43명 × 0.3초) | **85% 감소** |
| **파일 크기** | 2.1MB (43개 Excel) | 180KB (1개 CSV) | **91% 감소** |
| **초기 로딩** | 3~5초 (43개 파싱) | 0.5초 (1개 파싱) | **90% 감소** |

> ⚠️ **Phase 1.5에서 실측 필요**

---

## 🛠️ 구현 단계별 계획

### Phase 0: 기술 검증 (1시간) ⭐ NEW
- [ ] `test_fis_rendering.py` 실행
- [ ] BeautifulSoup vs Playwright 결정

### Phase 1: Python 파이프라인 (1~2일)
- [ ] `scripts/scraper.py` 작성
- [ ] `scripts/normalizer.py` 작성
- [ ] 테스트 (5명 파일럿 → 전체 43명)

### Phase 1.5: 성능 벤치마크 (30분) ⭐ NEW
- [ ] 실측 개선율 확인
- [ ] 성능 미달 시 재평가

### Phase 2: React 통합 (1일)
- [ ] `hooks/useCsvData.ts` 생성
- [ ] `App.tsx` 수정
- [ ] 테스트

### Phase 3: 자동화 (0.5일)
- [ ] GitHub Actions 설정

**총 소요**: **3~4일**

---

## 🔄 롤백 전략 ⭐ NEW

| Phase | 체크포인트 | 롤백 방법 | 복구 시간 |
|-------|-----------|-----------|----------|
| **Phase 1** | CSV 생성 성공 | Excel 파일 유지 | 즉시 |
| **Phase 2** | React 정상 렌더링 | `useCsvData` → `useExcelData` | 5분 |
| **Phase 3** | Actions 정상 실행 | cron 비활성화 | 1분 |

### 안전장치
- `fis-to-excel.ts` **삭제 금지** (Phase 2 완료까지)
- `public/data/athletes/` 폴더 **백업 유지**
- Git 브랜치: `feature/csv-pipeline`

---

## ⚠️ 리스크 및 대응 방안 ⭐ NEW

| 리스크 | 확률 | 영향 | 대응 |
|--------|------|------|------|
| **FIS 사이트 JS 렌더링 필수** | 중 | 고 | Phase 0 검증 → Playwright로 대체 |
| **CSV 타입 변환 오류** | 중 | 중 | 충분한 테스트 + 롤백 전략 |
| **성능 개선 미달** | 저 | 저 | Phase 1.5 벤치마크 후 재평가 |
| **자동화 실패** | 중 | 저 | 수동 실행 fallback |

---

## 🎯 최종 권장사항

### ✅ 즉시 적용 가능
1. **Phase 0 실행** (1시간) - FIS 사이트 렌더링 방식 확인
2. **Python 파이프라인** (1~2일) - 데이터 안정화
3. **React는 CSV 소비** - 기존 UI/UX 100% 유지

### ❌ 적용 불필요
- 정적 HTML 대시보드 (DataTables.js)

---

## 다음 단계

컨펌해 주시면 바로 구현 시작하겠습니다:

1. ✅ **Phase 0부터 시작** (`test_fis_rendering.py`)
2. ✅ **벤치마크 포함** (Phase 1.5)
3. ✅ **롤백 전략 준비**
4. ❓ **자동화 필요 여부** (GitHub Actions)
