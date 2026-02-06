# V6 시스템 아키텍처

**문서 목적:** V6 프로젝트의 전체 시스템 구조와 데이터 흐름을 이해  
**대상:** 모든 역할 (데이터 엔지니어, 프론트엔드 개발자, 프로젝트 매니저)

---

## 🏗️ **시스템 전체 구조**

```
┌─────────────────────────────────────────────────────────────┐
│                     FIS Website                              │
│            (International Ski Federation)                    │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ 1. 스크래핑
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                  data-pipeline/                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  scripts/scrape_fis.py                                 │ │
│  │  - 대한민국 선수 데이터 수집                              │ │
│  │  - FIS 공식 API/웹 스크래핑                              │ │
│  └────────────────────────────────────────────────────────┘ │
│                            │                                 │
│                            │ 2. 원본 저장                     │
│                            ▼                                 │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  raw/team_korea_data.json                              │ │
│  │  - FIS 원본 데이터 (변환 전)                             │ │
│  └────────────────────────────────────────────────────────┘ │
│                            │                                 │
│                            │ 3. 변환 및 정제                  │
│                            ▼                                 │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  scripts/transform_data_fixed.py                       │ │
│  │  - 날짜 형식 통일 (YYYY-MM-DD)                          │ │
│  │  - 종목 분류 (8개 카테고리)                              │ │
│  │  - 순위/상태 분리                                        │ │
│  │  - 통계 계산                                             │ │
│  └────────────────────────────────────────────────────────┘ │
│                            │                                 │
│                            │ 4. 처리 완료                     │
│                            ▼                                 │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  processed/athletes_real_fixed.json                    │ │
│  │  - 정제된 데이터                                         │ │
│  └────────────────────────────────────────────────────────┘ │
│                            │                                 │
│                            │ 5. 검증                         │
│                            ▼                                 │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  scripts/verify_counts.py                              │ │
│  │  - 선수 수 확인 (43명)                                   │ │
│  │  - 종목별 분포 확인                                      │ │
│  │  - 데이터 무결성 검증                                    │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ 6. 프로덕션 배포
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                      src/                                    │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  data/athletes.json                                    │ │
│  │  - 프론트엔드 프로덕션 데이터                              │ │
│  │  - 읽기 전용!                                            │ │
│  └────────────────────────────────────────────────────────┘ │
│                            │                                 │
│                            │ 7. React 로드                   │
│                            ▼                                 │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  hooks/useAthletes.ts                                  │ │
│  │  - 데이터 로딩 및 제공                                   │ │
│  └────────────────────────────────────────────────────────┘ │
│                            │                                 │
│                            │ 8. 컴포넌트 사용                 │
│                            ▼                                 │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  pages/                                                │ │
│  │  - V6_DashboardPage.tsx                                │ │
│  │  - V6_AthletesPage.tsx                                 │ │
│  │  - V6_ResultsPage.tsx                                  │ │
│  └────────────────────────────────────────────────────────┘ │
│                            │                                 │
│                            │ 9. 렌더링                       │
│                            ▼                                 │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  components/                                           │ │
│  │  - V6_HeroSection.tsx                                  │ │
│  │  - V6_PerformanceAnalysis.tsx                          │ │
│  │  - V6_DistributionCharts.tsx                           │ │
│  │  - AthleteProfileModal.tsx                             │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ 10. 브라우저 표시
                            ▼
                    ┌───────────────┐
                    │  User Browser │
                    └───────────────┘
```

---

## 🔄 **데이터 플로우 상세**

### 1단계: 데이터 수집 (Data Collection)
```
FIS Website → scrape_fis.py → raw/team_korea_data.json
```

**담당:** 데이터 엔지니어  
**주기:** 수동 (주 1회 권장)  
**산출물:** 원본 JSON (FIS 형식 그대로)

---

### 2단계: 데이터 변환 (Data Transformation)
```
raw/team_korea_data.json → transform_data_fixed.py → processed/athletes_real_fixed.json
```

**담당:** 데이터 엔지니어  
**처리 내용:**
- 날짜 정규화: `DD-MM-YYYY` → `YYYY-MM-DD`
- 종목 필터링: FIS 화이트리스트 적용
- 순위 분리: `rank` (숫자) + `status` (DNF/DNS)
- 통계 생성: 종목별/성별/연령대별 집계
- 선수 정보 보강: `sport`, `age`, `medals` 등

**품질 보장:**
- 총 선수: 43명
- 8개 종목 카테고리
- 100% 날짜 형식 통일
- 100% 종목 분류 정확도

---

### 3단계: 데이터 검증 (Data Validation)
```
processed/athletes_real_fixed.json → verify_counts.py → ✅ 검증 통과
```

**담당:** 데이터 엔지니어  
**검증 항목:**
- 선수 수 확인
- 종목별 분포 확인
- 필수 필드 존재 확인
- 타입 검증

---

### 4단계: 프로덕션 배포 (Production Deployment)
```
processed/athletes_real_fixed.json → (복사) → src/data/athletes.json
```

**담당:** 데이터 엔지니어  
**방법:**
```bash
cp data-pipeline/processed/athletes_real_fixed.json src/data/athletes.json
```

**중요:** 이 시점부터 프론트엔드가 사용 가능

---

### 5단계: React 데이터 로딩 (Frontend Data Loading)
```
src/data/athletes.json → useAthletes.ts → { athletes, stats }
```

**담당:** 프론트엔드 개발자  
**제공 데이터:**
- `athletes`: 선수 배열 (43명)
- `stats`: 통계 객체

**사용 예:**
```tsx
import { useAthletes } from '../hooks/useAthletes';

const MyComponent = () => {
  const { athletes, stats } = useAthletes();
  
  return <div>{athletes.length}명의 선수</div>;
};
```

---

### 6단계: UI 렌더링 (UI Rendering)
```
{ athletes, stats } → React Components → Browser
```

**담당:** 프론트엔드 개발자  
**페이지별 사용:**
- **Dashboard**: 통계, 차트, 히어로
- **Athletes**: 선수 목록, 필터링, 프로필
- **Results**: 경기 결과 타임라인

---

## 🔀 **역할 간 인터페이스**

### 데이터 엔지니어 ↔ 프론트엔드

**계약 (Contract):**
```
파일: src/data/athletes.json
형식: JSON
구조: DATA_SCHEMA.md 참조
```

**규칙:**
1. ✅ 데이터 엔지니어만 수정 가능
2. ✅ 프론트엔드는 읽기 전용
3. ✅ 구조 변경 시 양측 협의 필요
4. ✅ 변경사항은 CHANGELOG에 기록

**데이터 보장 사항 (SLA):**
- ✅ 날짜 형식: 100% YYYY-MM-DD
- ✅ 순위: 숫자 또는 null
- ✅ 상태: "DNF"/"DNS"/"DSQ" 또는 null
- ✅ 종목: 8개 카테고리 중 하나
- ✅ 필수 필드: id, name_ko, sport, gender

---

## 📂 **폴더 구조 (최종)**

```
V6/
├── docs/                          # 📚 모든 문서
│   ├── 00_PROJECT_OVERVIEW.md
│   ├── ARCHITECTURE.md            # 이 파일
│   ├── roles/
│   │   ├── DATA_ENGINEER.md
│   │   └── FRONTEND_DEVELOPER.md
│   ├── specs/
│   │   ├── DATA_SCHEMA.md
│   │   ├── COMPONENT_GUIDE.md
│   │   └── DESIGN_SYSTEM.md
│   └── CHANGELOG.md
│
├── data-pipeline/                 # 🔧 데이터 엔지니어 영역
│   ├── README.md
│   ├── scripts/
│   │   ├── scrape_fis.py
│   │   ├── transform_data_fixed.py
│   │   └── verify_counts.py
│   ├── raw/
│   │   └── team_korea_data.json
│   └── processed/
│       └── athletes_real_fixed.json
│
├── src/                           # 🎨 프론트엔드 영역
│   ├── App.tsx
│   ├── main.tsx
│   ├── components/
│   │   ├── common/
│   │   │   └── AthleteProfileModal.tsx
│   │   ├── dashboard/
│   │   │   ├── V6_HeroSection.tsx
│   │   │   ├── V6_PerformanceAnalysis.tsx
│   │   │   └── V6_DistributionCharts.tsx
│   │   └── layout/
│   │       ├── Header.tsx
│   │       └── V6_BottomNav.tsx
│   ├── pages/
│   │   ├── V6_DashboardPage.tsx
│   │   ├── V6_AthletesPage.tsx
│   │   └── V6_ResultsPage.tsx
│   ├── hooks/
│   │   └── useAthletes.ts
│   ├── data/
│   │   └── athletes.json          # 📊 공유 데이터 (읽기 전용)
│   └── types/
│       └── index.ts
│
├── public/                        # 정적 파일
├── dist/                          # 빌드 결과
├── archive/                       # 과거 파일
│
├── package.json
├── vite.config.ts
├── tailwind.config.js
└── tsconfig.json
```

---

## 🚫 **역할 경계 (Critical Boundaries)**

### ❌ 절대 금지

**데이터 엔지니어:**
- ❌ `src/` 폴더 수정
- ❌ React 컴포넌트 수정
- ❌ CSS/디자인 변경

**프론트엔드 개발자:**
- ❌ `data-pipeline/` 폴더 수정
- ❌ Python 스크립트 수정
- ❌ `src/data/athletes.json` 직접 수정

### ✅ 협업 프로세스

**시나리오 1: 새 데이터 필드 추가**
```
1. 프론트엔드: "메달 색상 정보 필요합니다"
2. 양측 협의: DATA_SCHEMA.md 업데이트
3. 데이터 엔지니어: transform_data_fixed.py 수정
4. 데이터 엔지니어: athletes.json 업데이트
5. 프론트엔드: 새 필드 사용
```

**시나리오 2: 데이터 오류 발견**
```
1. 프론트엔드: "선수 X의 종목이 잘못되었습니다"
2. 데이터 엔지니어: 원인 파악 및 수정
3. 데이터 엔지니어: verify_counts.py로 검증
4. 데이터 엔지니어: athletes.json 재배포
5. 프론트엔드: 확인 및 테스트
```

---

## 🔄 **업데이트 주기**

### 데이터 업데이트
**주기:** 주 1회 (월요일 권장)

**프로세스:**
```bash
cd data-pipeline

# 1. 데이터 수집
python3 scripts/scrape_fis.py

# 2. 변환
python3 scripts/transform_data_fixed.py

# 3. 검증
python3 scripts/verify_counts.py

# 4. 배포
cp processed/athletes_real_fixed.json ../src/data/athletes.json

# 5. Git 커밋
git add src/data/athletes.json
git commit -m "Data: Weekly update $(date +%Y-%m-%d)"
```

### 향후 자동화 계획
```yaml
Schedule: 매주 월요일 오전 9시
Action:
  - scrape_fis.py 실행
  - transform_data_fixed.py 실행
  - verify_counts.py 검증
  - athletes.json 자동 업데이트
  - Git auto-commit (선택)
```

---

## 📊 **데이터 플로우 시간 추정**

| 단계 | 소요 시간 | 담당 |
|------|----------|------|
| 1. 스크래핑 | 5-10분 | 데이터 |
| 2. 변환 | 1-2분 | 데이터 |
| 3. 검증 | 30초 | 데이터 |
| 4. 배포 | 10초 | 데이터 |
| 5. 프론트 테스트 | 2-5분 | 프론트 |
| **전체** | **10-20분** | 양측 |

---

## 🛠️ **기술 스택 요약**

### 데이터 파이프라인
- **언어:** Python 3.x
- **라이브러리:** (필요시 추가)
- **데이터 소스:** FIS (International Ski Federation)
- **포맷:** JSON

### 프론트엔드
- **Framework:** React 18.3.1
- **언어:** TypeScript 5.5.3
- **빌드:** Vite 5.4.2
- **스타일:** Tailwind CSS 3.4.1
- **애니메이션:** Framer Motion 11.16.0
- **차트:** Chart.js 4.4.1

### 공통
- **버전 관리:** Git
- **패키지 관리:** npm (프론트), pip (데이터)
- **코드 품질:** ESLint (프론트), (Python linter 추가 가능)

---

## 📈 **확장 가능성**

### 단기 (1-3개월)
- [ ] 데이터 자동화 스크립트
- [ ] GitHub Actions CI/CD
- [ ] 데이터 검증 자동화

### 중기 (3-6개월)
- [ ] API 서버 구축 (선택)
- [ ] 실시간 데이터 업데이트
- [ ] 푸시 알림 기능

### 장기 (6-12개월)
- [ ] 머신러닝 예측 기능
- [ ] 다국어 지원
- [ ] 관리자 대시보드

---

## 🔍 **트러블슈팅**

### 문제: 데이터 업데이트 후 프론트엔드 오류
**원인:** 데이터 스키마 불일치
**해결:**
1. DATA_SCHEMA.md 확인
2. 필수 필드 누락 여부 확인
3. verify_counts.py 실행
4. 타입 일치 확인

### 문제: 선수 수가 예상과 다름
**원인:** 종목 필터링 오류
**해결:**
1. transform_data_fixed.py의 화이트리스트 확인
2. team_category 매핑 확인
3. 원본 데이터 확인

---

## 📚 **관련 문서**

- [프로젝트 개요](./00_PROJECT_OVERVIEW.md) - 전체 프로젝트 이해
- [데이터 엔지니어 가이드](./roles/DATA_ENGINEER.md) - 데이터 작업 상세
- [프론트엔드 가이드](./roles/FRONTEND_DEVELOPER.md) - UI 개발 상세
- [데이터 스키마](./specs/DATA_SCHEMA.md) - JSON 구조 상세
- [디자인 시스템](./specs/DESIGN_SYSTEM.md) - UI 규칙

---

**마지막 업데이트:** 2026-01-31  
**문서 버전:** 1.0  
**중요도:** ⭐⭐⭐⭐⭐ (최고)

---

## 🎯 **Quick Reference**

**데이터 업데이트:**
```bash
cd data-pipeline && python3 scripts/transform_data_fixed.py
```

**프론트엔드 개발:**
```bash
npm run dev
```

**전체 빌드:**
```bash
npm run build
```

**데이터 검증:**
```bash
cd data-pipeline && python3 scripts/verify_counts.py
```
