# 📂 V6 Data Fix Packet (2026-02-05)

**[Source of Truth / 최신 검증 데이터]**
이 폴더(`DATA_V6_FIX_0205`)는 데이터 불일치 문제를 해결한 **최신 정본 데이터와 스크립트**만을 모아둔 곳입니다.

### 📦 포함된 파일 (Included Files)
1.  **`athletes_real_fixed.json`**: 최종 검증된 선수 데이터 (43명).
2.  **`DATA_FIX_SUMMARY.md`**: 수정 내역 및 검증 리포트.
3.  **`transform_data_fixed.py`**: 데이터 정제 로직이 포함된 변환 스크립트.
4.  **`analyze_disciplines.py`**: 데이터 검증용 분석 도구.

---

# Team Korea Data Pipeline

## 📁 파일 구조

### 🔴 **핵심 파일 (절대 삭제 금지)**

1. **`team_korea_data.json`** (402KB)
   - FIS 크롤링 원본 데이터
   - 43명 선수, 1,842개 경기 기록
   - 생성: `Data_2.py` 스크립트
   - 업데이트: 2026-01-29

2. **`athletes_real.json`** (282KB)
   - 대시보드용 최종 데이터
   - 한글 이름 + 3-Tier 필터링 적용
   - 생성: `transform_data.py` 스크립트
   - 복사 위치: `../src/data/athletes.json`

3. **`transform_data.py`** (14KB)
   - 데이터 변환 스크립트
   - FIS 종목 화이트리스트 적용
   - 날짜 정규화, 순위 정제

4. **`Data_2.py`** (5KB)
   - FIS 크롤링 스크립트
   - `athlete_urls.txt` 기반 데이터 수집
   - 5단계 필터링 로직 구현

### 📘 **참고 문서**

- **`Dashboard_PRD.md`** - 대시보드 요구사항
- **`data_PRD_2`** - 데이터 파이프라인 상세 가이드
- **`athlete_urls.txt`** - 43명 FIS URL 목록

### 📦 **보조 파일**

- **`Data_2`** - Data_2.py의 원본 (확장자 없음)

---

## 🔄 데이터 업데이트 프로세스 (Real-Time Update Guide)

> **⚠️ Critical Warning**: `dist/` 폴더는 배포된 결과물이므로 절대 직접 수정하지 마십시오. 아래 과정을 통해 `src/data/athletes.json`을 갱신하고 재배포(rebuild)해야 합니다.

### 1단계: FIS 크롤링 (Data Collection)
```bash
cd V6/DATA_V6
python3 Data_2.py
```
→ `team_korea_data.json` 생성 (43명, 원본 데이터 갱신)

### 2단계: 데이터 변환 및 정제 (Data Transformation)
```bash
python3 transform_data_fixed.py
```
→ `athletes_real_fixed.json` 생성 (필터링 + 한글 이름 + 통계 계산 완료)
*Note: `transform_data.py`가 아닌 `transform_data_fixed.py`를 사용해야 정확합니다.*

### 3단계: 프로덕션 데이터 적용 (Apply to Source)
```bash
# 생성된 정제 데이터를 프론트엔드 소스로 복사
cp athletes_real_fixed.json ../src/data/athletes.json
```

### 4단계: 배포 (Deployment)
```bash
cd ..
npm run build
# 이후 Vercel 등에서 자동 배포 감지 또는 수동 배포
```

---

## 📊 현재 데이터 상태 (Verified: 2026-01-29 Fix)

- **총 선수**: 43명 (검증 완료)
- **종목 분포 (DATA_FIX_SUMMARY 기준)**:
  - **alpine_skiing**: 10명
  - **cross_country**: 9명
  - **freeski**: 5명
  - **moguls**: 3명
  - **snowboard_alpine**: 6명
  - **snowboard_cross**: 1명
  - **snowboard_park**: 7명
  - **ski_jumping**: 2명

---

## ⚠️ 알려진 이슈

1. **데이터 불일치 (Fixed)**
   - 초기 예상(53명)과 실제 크롤링 데이터(43명) 차이 확인.
   - `DATA_FIX_SUMMARY.md`에 기술된 대로 정형화 완료.

---

## 📝 버전 히스토리

- **v1.0** (2026-01-29): 초기 데이터 파이프라인 구축
  - 43명 전체 선수 FIS 크롤링 완료
  - 3-Tier 필터링 시스템 구현
  - 한글 이름 매핑 완료
