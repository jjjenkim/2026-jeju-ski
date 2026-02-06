# Team Korea V6 Dashboard - 프로젝트 전체 개요

**프로젝트명:** TEAM KOREA WINTER OLYMPICS  
**버전:** V6  
**대상 대회:** 밀라노 코르티나 2026 동계올림픽  
**최종 업데이트:** 2026-01-31

---

## 🎯 프로젝트 목표

**무엇을 만드는가?**
- 대한민국 동계 스포츠 국가대표 선수단 성과 대시보드
- 실시간 선수 데이터, 경기 결과, 통계 분석 제공
- FIS(국제스키연맹) 공식 데이터 기반

**누구를 위한 것인가?**
- 국가대표 선수단 관계자
- 팬 및 미디어
- 데이터 분석가

---

## 👥 역할 구조

### 1️⃣ **데이터 엔지니어**
- **담당:** 데이터 원본(`DATA_V6`) 관리 및 검증
- **작업 폴더:** `V6/DATA_V6/`
- **최종 산출물:** `src/data/athletes.json`
- **가이드:** `V6_doc/05_DATA_ENGINEER_GUIDE.md`

### 2️⃣ **프론트엔드 개발자**
- **담당:** React UI 개발 + 디자인 구현
- **작업 폴더:** `src/`
- **기술 스택:** React 18 + TypeScript + Tailwind + Framer Motion
- **가이드:** `V6_doc/06_FRONTEND_DEVELOPER_GUIDE.md`

### 3️⃣ **프로젝트 매니저** (당신)
- **담당:** 전체 조율, 우선순위 결정, 품질 확인
- **역할:** 각 에이전트에게 작업 지시 및 검토

---

## 📂 프로젝트 구조

```
V6/
├── 📁 V6_doc/                        # 모든 문서 (Renumbered 00-08)
│   ├── 00_PROJECT_OVERVIEW.md        # 이 파일
│   ├── 01_ARCHITECTURE.md
│   ├── 02_DATA_SCHEMA.md
│   ├── 03_DESIGN_SYSTEM.md 
│   ├── 04_COMPONENT_GUIDE.md
│   ├── 05_DATA_ENGINEER_GUIDE.md
│   ├── 06_FRONTEND_DEVELOPER_GUIDE.md
│   └── ...
│
├── 📁 DATA_V6/                       # ⭐ Source of Truth (V7.0)
│   └── athletes_real_fixed.json      # 실제 원본 데이터
│
├── 📁 data-pipeline/                 # (Deprecated) Legacy Scripts
│
├── 📁 src/                           # 프론트엔드 작업 공간
│   ├── App.tsx
│   ├── components/
│   ├── pages/
│   └── data/
│       └── athletes.json             # ⭐ 앱 사용 데이터 (Flattened)
│
└── 📁 archive/                       # 과거 파일 보관
```

---

## 🎨 V6 디자인 시스템 (절대 변경 금지!)

### 컬러 팔레트
```css
배경색: #050505 (거의 검은색) - DashboardPage, AthletesPage
배경색: #0a0a0b (약간 밝은 검은색) - ResultsPage
Glass 배경: rgba(13, 39, 68, 0.4) (Tangaroa 40% - 네이비 톤)
텍스트: white
Primary: #FF929A (Firebrick - 분홍빨강)
Secondary: #53728A (Wedgewood - 청회색)
Glass 테두리: rgba(185, 207, 221, 0.1)
선택 강조: #FF929A
그림자: shadow-[0_0_10px_rgba(255,146,154,0.5)]
```

### 디자인 특징
- ✅ **거의 검은 배경** (`#050505`) - 깔끔하고 모던
- ✅ **Glass Morphism**: `backdrop-blur-md` + 네이비 톤 반투명
- ✅ **Fixed Header**: 상단 고정 네비게이션
- ✅ **Bottom Nav**: 하단 고정 메뉴
- ✅ **Framer Motion**: 부드러운 애니메이션
- ✅ **반응형**: Mobile First 디자인
- ✅ **Grain 효과**: Cinematic 질감

### 타이포그래피
```
본문 폰트: Pretendard Variable
헤더 폰트: Outfit (굵고 이탤릭)
강조: font-black italic uppercase
```

---

## 🚀 빠른 시작 가이드

### 개발 서버 실행
```bash
cd V6
npm install
npm run dev
# → http://localhost:5173
```

### 데이터 업데이트 (Manual)
1. `DATA_V6/athletes_real_fixed.json` 수정
2. 내용을 `src/data/athletes.json`으로 복사
3. 앱 확인 (`npm run dev`)

### 프로덕션 빌드
```bash
npm run build
# dist/ 폴더에 빌드 결과 생성
```

---

## 📋 주요 페이지

### 1. Dashboard (`/`)
- Hero Section: 팀 소개 및 주요 지표
- Performance Analysis: 성과 분석 차트
- Distribution Charts: 선수 분포 통계

### 2. Results (`/results`)
- 최근 경기 결과 타임라인
- 필터링 및 정렬 기능

### 3. Athletes (`/athletes`)
- 선수단 전체 목록
- 종목별 필터링
- 선수 상세 프로필 모달

---

## 🔒 중요 규칙

### Rule 1: 역할 경계 준수
```
❌ 데이터 엔지니어가 src/ 수정
❌ 프론트엔드가 DATA_V6/ 수정
✅ 각자 영역만 작업
```

### Rule 2: 디자인 변경 절대 금지
```
❌ 배경색 변경
❌ Primary 컬러 변경
❌ 레이아웃 구조 변경
✅ 새 기능 추가는 기존 디자인 시스템 따라야 함
```

### Rule 3: 데이터 계약 준수
```
✅ 데이터 구조는 02_DATA_SCHEMA.md 참조
✅ 변경 필요시 양쪽 역할 협의
✅ src/data/athletes.json은 읽기 전용 (프론트엔드)
```

### Rule 4: 작업 전 Git 커밋
```bash
git add .
git commit -m "Before: [작업 설명]"
# 작업 진행
git commit -m "After: [작업 설명]"
```

---

## 📊 현재 구현 상태

### ✅ 완료된 기능
- [x] 데이터 소스 구축 (`DATA_V6` 구축 완료)
- [x] 3개 페이지 (Dashboard, Results, Athletes)
- [x] 반응형 디자인 (모바일/데스크톱)
- [x] 애니메이션 효과 (Framer Motion)
- [x] 선수 프로필 모달
- [x] 종목별 필터링

### ⚠️ 개선 필요
- [ ] Success Momentum 실제 데이터 계산
- [ ] Resource Allocation FIS Points 기반 개선
- [ ] 메달 데이터 추가

---

## 🛠️ 기술 스택

### Frontend
- **Framework:** React 18.3.1
- **Language:** TypeScript 5.5.3
- **Build Tool:** Vite 5.4.2
- **Styling:** Tailwind CSS 3.4.1
- **Animation:** Framer Motion 11.16.0
- **Charts:** Chart.js 4.4.1 + react-chartjs-2
- **Routing:** React Router DOM 6.22.2

### Data Source
- **Format:** JSON (`DATA_V6`)
- **Source:** FIS (International Ski Federation) Manual Entry

---

## 📞 다음 단계 찾기

### 데이터 작업이 필요하면
→ `V6_doc/05_DATA_ENGINEER_GUIDE.md` 참조

### UI 수정이 필요하면
→ `V6_doc/06_FRONTEND_DEVELOPER_GUIDE.md` 참조

### 시스템 구조가 궁금하면
→ `V6_doc/01_ARCHITECTURE.md` 참조

### 디자인 규칙이 궁금하면
→ `V6_doc/03_DESIGN_SYSTEM.md` 참조

---

## ⚠️ 절대 금지 사항

1. ❌ 디자인 시스템 변경 (색상, 레이아웃, 타이포)
2. ❌ 역할 경계 넘나들기 (데이터 ↔ 프론트)
3. ❌ 임시 파일 생성 (temp_fix.tsx 같은 파일)
4. ❌ Git 커밋 없이 대규모 작업
5. ❌ 기능 + 디자인 동시 변경

---

**마지막 업데이트:** 2026-01-31  
**문서 버전:** 1.1  
**작성자:** Project Manager

---

## 🎯 Quick Links

- [시스템 구조](./01_ARCHITECTURE.md)
- [데이터 엔지니어 가이드](./05_DATA_ENGINEER_GUIDE.md)
- [프론트엔드 개발자 가이드](./06_FRONTEND_DEVELOPER_GUIDE.md)
- [데이터 스키마](./02_DATA_SCHEMA.md)
- [디자인 시스템](./03_DESIGN_SYSTEM.md)
- [변경 이력](./08_CHANGELOG.md)
