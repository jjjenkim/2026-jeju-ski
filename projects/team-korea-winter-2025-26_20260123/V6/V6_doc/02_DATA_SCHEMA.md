# 데이터 스키마 명세

**파일:** `src/data/athletes.json`  
**목적:** 프론트엔드와 데이터 엔지니어 간 데이터 계약  
**최종 업데이트:** 2026-01-31

---

## 📊 **전체 구조**

```json
{
  "statistics": {
    "by_sport": { ... },
    "by_gender": { ... },
    "age_distribution": { ... },
    "total_athletes": 43
  },
  "athletes": [ ... ]
}
```

---

## 📈 **Statistics 객체**

### 구조
```typescript
interface Statistics {
  by_sport: Record<string, number>;
  by_gender: Record<'M' | 'F', number>;
  age_distribution: {
    teens: number;
    twenties: number;
    thirties: number;
  };
  total_athletes: number;
}
```

### 예시
```json
{
  "statistics": {
    "by_sport": {
      "alpine_skiing": 10,
      "cross_country": 9,
      "snowboard_park": 7,
      "snowboard_alpine": 6,
      "freeski": 5,
      "moguls": 3,
      "ski_jumping": 2,
      "snowboard_cross": 1
    },
    "by_gender": {
      "M": 23,
      "F": 20
    },
    "age_distribution": {
      "teens": 6,
      "twenties": 25,
      "thirties": 12
    },
    "total_athletes": 43
  }
}
```

### 필드 설명

#### `by_sport` (종목별 인원)
- **타입:** `Record<string, number>`
- **키:** 8개 종목 영문명
- **값:** 해당 종목 선수 수
- **합계:** 43명

**허용된 종목 (8개):**
```typescript
type Sport =
  | "alpine_skiing"      // 알파인 스키
  | "cross_country"      // 크로스컨트리
  | "freeski"            // 프리스키
  | "moguls"             // 모굴
  | "ski_jumping"        // 스키점프
  | "snowboard_alpine"   // 스노보드 알파인
  | "snowboard_cross"    // 스노보드 크로스
  | "snowboard_park";    // 스노보드 파크
```

#### `by_gender` (성별 분포)
- **타입:** `Record<'M' | 'F', number>`
- **키:** "M" (남성) 또는 "F" (여성)
- **값:** 해당 성별 선수 수
- **합계:** 43명

#### `age_distribution` (연령대 분포)
- **타입:** `{ teens, twenties, thirties }`
- **계산:** `2026 - birth_year`
- **분류:**
  - `teens`: 10-19세
  - `twenties`: 20-29세
  - `thirties`: 30-39세
- **합계:** 43명

#### `total_athletes` (전체 선수 수)
- **타입:** `number`
- **값:** 43 (고정)
- **검증:** `by_sport` 합계 = `by_gender` 합계 = `total_athletes`

---

## 👤 **Athlete 객체**

### 구조
```typescript
interface Athlete {
  // 기본 정보
  id: string;
  name_ko: string;
  name_en: string;
  birth_date: string;      // YYYY-MM-DD 형식
  birth_year: number;
  age: number;             // 2026 - birth_year
  gender: 'M' | 'F';
  
  // 종목 정보
  sport: Sport;            // 8개 종목 중 하나
  sport_display: string;   // 영문 표시명
  detail_discipline: string;  // 상세 종목
  team: string;            // 한글 팀명
  
  // FIS 정보
  fis_code: string;
  photo_url?: string;      // 선택적
  fis_url?: string;        // 선택적
  
  // 성적 정보
  current_rank?: number;   // 현재 순위 (선택적)
  best_rank?: number;      // 최고 순위 (선택적)
  season_starts?: number;  // 시즌 출전 횟수 (선택적)
  
  // 메달
  medals: {
    gold: number;
    silver: number;
    bronze: number;
  };
  
  // 최근 경기 결과
  recent_results: Result[];
}
```

### 예시
```json
{
  "id": "KOR235622",
  "name_ko": "이승훈",
  "name_en": "SEUNGHUN LEE",
  "birth_date": "2005-01-01",
  "birth_year": 2005,
  "age": 21,
  "gender": "M",
  "sport": "freeski",
  "sport_display": "Freeski",
  "detail_discipline": "Freeski Halfpipe",
  "team": "프리스키",
  "fis_code": "235622",
  "photo_url": "https://data.fis-ski.com/.../235622.html",
  "fis_url": "https://www.fis-ski.com/.../235622",
  "current_rank": 1,
  "best_rank": 1,
  "season_starts": 49,
  "medals": {
    "gold": 0,
    "silver": 0,
    "bronze": 0
  },
  "recent_results": [
    {
      "date": "2020-01-31",
      "event": "FIS",
      "location": "Pyeongchang",
      "discipline": "Freeski Big Air",
      "rank": 2,
      "status": null,
      "fis_points": 0.0
    }
  ]
}
```

### 필드 상세 설명

#### 기본 정보

**`id`**
- **타입:** `string`
- **형식:** "KOR" + FIS 코드
- **예:** "KOR235622"
- **필수:** ✅

**`name_ko`**
- **타입:** `string`
- **형식:** 한글 성명
- **예:** "이승훈"
- **필수:** ✅

**`name_en`**
- **타입:** `string`
- **형식:** 영문 대문자 (FIS 공식 표기)
- **예:** "SEUNGHUN LEE"
- **필수:** ✅

**`birth_date`**
- **타입:** `string`
- **형식:** `YYYY-MM-DD` (ISO 8601)
- **예:** "2005-01-01"
- **필수:** ✅
- **검증:** 정규식 `^\d{4}-\d{2}-\d{2}$`

**`birth_year`**
- **타입:** `number`
- **형식:** 4자리 연도
- **예:** 2005
- **필수:** ✅
- **검증:** `1900 < birth_year < 2020`

**`age`**
- **타입:** `number`
- **계산:** `2026 - birth_year`
- **예:** 21
- **필수:** ✅
- **검증:** `age > 0 && age < 100`

**`gender`**
- **타입:** `'M' | 'F'`
- **값:** "M" (남성) 또는 "F" (여성)
- **필수:** ✅

#### 종목 정보

**`sport`**
- **타입:** `Sport` (8개 종목 중 하나)
- **값:** `"alpine_skiing" | "cross_country" | "freeski" | "moguls" | "ski_jumping" | "snowboard_alpine" | "snowboard_cross" | "snowboard_park"`
- **필수:** ✅
- **검증:** 화이트리스트 내 값만 허용

**`sport_display`**
- **타입:** `string`
- **형식:** 영문 표시명 (보기 좋게)
- **예:** "Freeski", "Alpine Skiing"
- **필수:** ✅

**`detail_discipline`**
- **타입:** `string`
- **형식:** FIS 공식 종목명
- **예:** "Freeski Halfpipe", "Giant Slalom"
- **필수:** ✅

**`team`**
- **타입:** `string`
- **형식:** 한글 팀 명칭
- **예:** "프리스키", "알파인"
- **필수:** ✅

#### FIS 정보

**`fis_code`**
- **타입:** `string`
- **형식:** FIS 선수 코드 (숫자)
- **예:** "235622"
- **필수:** ✅

**`photo_url`**
- **타입:** `string | undefined`
- **형식:** URL
- **예:** "https://data.fis-ski.com/.../235622.html"
- **필수:** ❌ (선택적)

**`fis_url`**
- **타입:** `string | undefined`
- **형식:** URL
- **예:** "https://www.fis-ski.com/.../235622"
- **필수:** ❌ (선택적)

#### 성적 정보

**`current_rank`**
- **타입:** `number | undefined`
- **의미:** 현재 FIS 세계 랭킹
- **예:** 1, 15, 203
- **필수:** ❌ (선택적)

**`best_rank`**
- **타입:** `number | undefined`
- **의미:** 역대 최고 FIS 랭킹
- **예:** 1
- **필수:** ❌ (선택적)

**`season_starts`**
- **타입:** `number | undefined`
- **의미:** 이번 시즌 출전 횟수
- **예:** 49
- **필수:** ❌ (선택적)

#### 메달

**`medals`**
- **타입:** `{ gold, silver, bronze }`
- **필수:** ✅
- **기본값:** `{ gold: 0, silver: 0, bronze: 0 }`

**각 필드:**
- **타입:** `number`
- **값:** 0 이상 정수
- **의미:** 해당 메달 개수

---

## 🏆 **Result 객체**

### 구조
```typescript
interface Result {
  date: string;            // YYYY-MM-DD
  event: string;
  location: string;
  discipline: string;
  rank: number | null;     // 순위 (숫자만)
  status: string | null;   // 상태 코드
  fis_points: number;
}
```

### 예시
```json
{
  "date": "2020-01-31",
  "event": "FIS",
  "location": "Pyeongchang",
  "discipline": "Freeski Big Air",
  "rank": 2,
  "status": null,
  "fis_points": 0.0
}
```

### 필드 설명

**`date`**
- **타입:** `string`
- **형식:** `YYYY-MM-DD`
- **예:** "2020-01-31"
- **필수:** ✅
- **검증:** 정규식 `^\d{4}-\d{2}-\d{2}$`

**`event`**
- **타입:** `string`
- **예:** "FIS", "World Cup", "Olympics"
- **필수:** ✅

**`location`**
- **타입:** `string`
- **예:** "Pyeongchang", "Val d'Isère"
- **필수:** ✅

**`discipline`**
- **타입:** `string`
- **형식:** FIS 공식 종목명
- **예:** "Freeski Big Air", "Giant Slalom"
- **필수:** ✅

**`rank`**
- **타입:** `number | null`
- **값:** 순위 (1, 2, 3, ...) 또는 `null`
- **필수:** ✅
- **검증:** `rank > 0` 또는 `null`
- **중요:** DNF/DNS는 `null`로 저장, `status` 필드에 별도 표시

**`status`**
- **타입:** `string | null`
- **값:** "DNF" | "DNS" | "DSQ" | "DNQ" | "DQ" | `null`
- **필수:** ✅
- **의미:**
  - `"DNF"`: Did Not Finish (완주 실패)
  - `"DNS"`: Did Not Start (출전 못함)
  - `"DSQ"`: Disqualified (실격)
  - `"DNQ"`: Did Not Qualify (예선 탈락)
  - `"DQ"`: Disqualified (실격)
  - `null`: 정상 완주

**`fis_points`**
- **타입:** `number`
- **값:** FIS 포인트 (0.0 ~)
- **필수:** ✅
- **검증:** `fis_points >= 0`

---

## 🔒 **데이터 계약 (Contract)**

### 보장 사항 (데이터 엔지니어)

**1. 날짜 형식 통일**
```
✅ 100% YYYY-MM-DD 형식
❌ DD-MM-YYYY, DD.MM.YYYY, 기타 형식 금지
```

**2. 순위 데이터 순수성**
```
✅ rank: 숫자 또는 null만
❌ rank: "DNF", "5 (Q)" 같은 문자열 금지
```

**3. 종목 화이트리스트**
```
✅ 8개 종목만 존재
❌ "High1", "WC" 같은 비종목 값 금지
```

**4. 필수 필드 보장**
```typescript
// 모든 선수는 다음 필드를 반드시 포함
id: string;
name_ko: string;
name_en: string;
birth_date: string;
birth_year: number;
age: number;
gender: 'M' | 'F';
sport: Sport;
medals: { gold: number; silver: number; bronze: number; };
recent_results: Result[];
```

**5. 통계 정합성**
```
✅ total_athletes = by_sport 합계 = by_gender 합계 = 43
✅ age_distribution 합계 = 43
```

### 사용 규칙 (프론트엔드)

**1. 읽기 전용**
```typescript
// ✅ 허용
const { athletes } = useAthletes();
const filtered = athletes.filter(a => a.sport === 'freeski');

// ❌ 금지
athletes.push(newAthlete);  // 절대 금지!
athletes[0].name_ko = "변경";  // 절대 금지!
```

**2. 타입 안전성**
```typescript
// ✅ 타입 가드 사용
if (typeof athlete.current_rank === 'number') {
  console.log(`순위: ${athlete.current_rank}`);
}

// ✅ Null 체크
const rank = result.rank ?? '기권';
const status = result.status ?? '정상';
```

**3. 날짜 처리**
```typescript
// ✅ 정확한 날짜 파싱
const date = new Date(athlete.birth_date);  // YYYY-MM-DD

// ❌ 잘못된 가정
const year = athlete.birth_date.split('-')[0];  // 위험!
```

---

## 🧪 **검증 규칙**

### 데이터 엔지니어 (변환 시)

```python
# verify_counts.py 검증 항목

def validate_data(data):
    # 1. 총 선수 수
    assert len(data['athletes']) == 43
    
    # 2. 종목별 합계
    by_sport_total = sum(data['statistics']['by_sport'].values())
    assert by_sport_total == 43
    
    # 3. 성별 합계
    by_gender_total = sum(data['statistics']['by_gender'].values())
    assert by_gender_total == 43
    
    # 4. 연령대 합계
    age_total = sum(data['statistics']['age_distribution'].values())
    assert age_total == 43
    
    # 5. 날짜 형식
    for athlete in data['athletes']:
        assert re.match(r'^\d{4}-\d{2}-\d{2}$', athlete['birth_date'])
        
        for result in athlete['recent_results']:
            assert re.match(r'^\d{4}-\d{2}-\d{2}$', result['date'])
    
    # 6. 순위 타입
    for athlete in data['athletes']:
        for result in athlete['recent_results']:
            assert isinstance(result['rank'], (int, type(None)))
            assert isinstance(result['status'], (str, type(None)))
    
    # 7. 종목 화이트리스트
    allowed_sports = {
        'alpine_skiing', 'cross_country', 'freeski', 'moguls',
        'ski_jumping', 'snowboard_alpine', 'snowboard_cross', 'snowboard_park'
    }
    for athlete in data['athletes']:
        assert athlete['sport'] in allowed_sports
```

### 프론트엔드 (런타임)

```typescript
// useAthletes.ts 검증 로직

const validateAthletes = (data: any): boolean => {
  // 1. 기본 구조 확인
  if (!data.statistics || !data.athletes) return false;
  
  // 2. 선수 수 확인
  if (data.athletes.length !== 43) {
    console.warn('Expected 43 athletes, got', data.athletes.length);
  }
  
  // 3. 필수 필드 확인
  for (const athlete of data.athletes) {
    if (!athlete.id || !athlete.name_ko || !athlete.sport) {
      console.error('Missing required fields', athlete);
      return false;
    }
  }
  
  return true;
};
```

---

## 📋 **변경 프로세스**

### 스키마 변경이 필요한 경우

**1. 협의**
```
프론트엔드 → 데이터 엔지니어
"새 필드 'coach_name' 추가 필요합니다"
```

**2. 문서 업데이트**
```
DATA_SCHEMA.md 수정
- 새 필드 정의
- 타입 명시
- 예시 추가
```

**3. 구현**
```python
# transform_data_fixed.py 수정
athlete_data['coach_name'] = get_coach_name(athlete)
```

**4. 배포**
```bash
# 데이터 재생성
python3 transform_data_fixed.py
cp processed/athletes_real_fixed.json ../src/data/athletes.json
```

**5. 프론트엔드 적용**
```typescript
// types/index.ts 업데이트
interface Athlete {
  // ... 기존 필드
  coach_name?: string;  // 새 필드
}
```

**6. 기록**
```
CHANGELOG.md 업데이트
- [2026-XX-XX] Added: coach_name field to Athlete
```

---

## 🚨 **주의 사항**

### 절대 금지

1. ❌ **날짜 형식 변경**
   ```
   YYYY-MM-DD 외 다른 형식 금지
   ```

2. ❌ **순위에 문자열 혼입**
   ```
   rank: "5 (Q)"  ← 금지!
   rank: 5, status: null  ← 정확!
   ```

3. ❌ **종목 임의 추가**
   ```
   sport: "curling"  ← 화이트리스트에 없음, 금지!
   ```

4. ❌ **필수 필드 누락**
   ```typescript
   // 모든 선수는 id, name_ko, sport 등 필수
   ```

### 권장 사항

1. ✅ **선택적 필드 활용**
   ```typescript
   // 데이터가 없으면 undefined
   current_rank?: number;
   ```

2. ✅ **타입 가드 사용**
   ```typescript
   if (athlete.current_rank !== undefined) {
     // 안전하게 사용
   }
   ```

3. ✅ **검증 후 배포**
   ```bash
   python3 verify_counts.py  # 항상 실행!
   ```

---

## 📚 **관련 문서**

- [아키텍처](../ARCHITECTURE.md) - 전체 데이터 플로우
- [데이터 엔지니어 가이드](../roles/DATA_ENGINEER.md) - 데이터 작업 상세
- [프론트엔드 가이드](../roles/FRONTEND_DEVELOPER.md) - 데이터 사용법

---

**마지막 업데이트:** 2026-01-31  
**문서 버전:** 1.0  
**중요도:** ⭐⭐⭐⭐⭐ (최고)

**이 스키마는 데이터 엔지니어와 프론트엔드 간 계약입니다!**
