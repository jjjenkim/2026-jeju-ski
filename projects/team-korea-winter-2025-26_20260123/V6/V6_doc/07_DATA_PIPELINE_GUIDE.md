# Data Pipeline Guide (Active)

**폴더:** `V6/DATA_V6/` (Source of Truth)  
**목적:** FIS 데이터 수집 및 업데이트  
**담당:** P-Manager (Agent) & 데이터 엔지니어  
**최종 업데이트:** 2026-02-06 (Automated Pipeline Restored)

---

## 🎯 **데이터 관리 방식 (The "Real-Time" Pipeline)**

**1. Source of Truth (원본 데이터):**
- 파일: `V6/DATA_V6/team_korea_data.json` (크롤링 원본)
- 파일: `V6/DATA_V6/athletes_real_fixed.json` (정제된 원본)

**2. App Data (애플리케이션 데이터):**
- 파일: `src/data/athletes.json`
- **역할:** 웹사이트가 실제로 로딩하는 파일.
- **업데이트:** 파이프라인이 원본을 정제하여 이곳으로 '복사'합니다.

---

## 🔄 **데이터 업데이트 워크플로우 (Automated)**

회장님이 말씀하신 **"데이터 업데이트 -> 파일 반영 -> 배포"** 프로세스는 다음과 같이 자동화되어 있습니다.

### 1단계: FIS 크롤링 (Data Collection)
> `agent_p_manager.py`가 실행

- **Script:** `python3 V6/DATA_V6/Data_2.py`
- **Output:** `team_korea_data.json` (최신 경기 결과 수집)

### 2단계: 데이터 변환 (Transformation)
- **Script:** `python3 V6/DATA_V6/transform_data_fixed.py`
- **Logic:** 순위 정제, 날짜 포맷팅, 종목 필터링
- **Output:** `athletes_real_fixed.json`

### 3단계: 소스 반영 (Apply to Source)
- **Action:** `cp athletes_real_fixed.json ../src/data/athletes.json`
- **Result:** 프론트엔드 소스 파일이 최신 데이터로 교체됨.

### 4단계: 배포 (Deployment)
- **Action:** `git push`
- **Result:**
    1. Github에 `src/data/athletes.json` 변경사항 업로드
    2. **Vercel**이 변경 감지 -> **자동으로 `npm run build` 실행**
    3. `dist/` 폴더 생성 및 배포 완료 (사이트 갱신)

> **Core Concept**: 우리는 `dist`(결과물)를 올리는 게 아니라 **`src`(원재료)**를 올립니다. 요리는 Vercel 서버가 직접 합니다.

---

## 📂 **관련 스크립트 위치**

```
V6/
├── DATA_V6/
│   ├── Data_2.py                 # 크롤러
│   ├── transform_data_fixed.py   # 변환기
│   ├── athletes_real_fixed.json  # 정제 결과
│   └── README.md                 # 상세 가이드
└── src/
    └── data/
        └── athletes.json         # 배포용 소스
```

---

## 🗑️ **Legacy Scripts (Deprecated)**

아래 스크립트들은 더 이상 사용하지 않습니다. (참고용으로만 보존)

- `scripts/fis_scraper.py`
- `scripts/V6_enhance_data.py` (Old Logic V4.0)
- `scripts/verify_counts.py`

**이유:**
- 스크립트가 참조하는 `files_step1/` 소스 파일 누락
- 스크립트 로직(V4.0)이 현재 실제 데이터(V7.0)보다 구버전임
- 실제 데이터(`athletes_real_fixed.json`)가 이미 완벽하게 구축되어 있음

---
