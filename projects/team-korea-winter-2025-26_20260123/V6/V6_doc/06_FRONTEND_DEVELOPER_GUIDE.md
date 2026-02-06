# 프론트엔드 개발자 작업 가이드

**역할:** React + TypeScript로 아름답고 빠른 대시보드 UI 구현  
**작업 영역:** `src/` 폴더만  
**기술 스택:** React 18 + TypeScript + Tailwind CSS + Framer Motion

---

## ✅ 당신의 임무

**핵심 목표:**
1. V6 디자인 시스템을 준수하며 UI 개발
2. 선수 데이터를 시각적으로 표현
3. 반응형 디자인 (모바일/태블릿/데스크톱)
4. 부드러운 애니메이션 구현

---

## 📂 작업 폴더 구조

```
src/
├── App.tsx                    # 메인 앱 (라우팅)
├── main.tsx                   # 진입점
│
├── components/                # React 컴포넌트
│   ├── common/               # 공통 컴포넌트
│   │   └── AthleteProfileModal.tsx
│   ├── dashboard/            # 대시보드 전용
│   │   ├── V6_HeroSection.tsx
│   │   ├── V6_PerformanceAnalysis.tsx
│   │   └── V6_DistributionCharts.tsx
│   └── layout/               # 레이아웃
│       ├── Header.tsx
│       └── V6_BottomNav.tsx
│
├── pages/                     # 페이지 컴포넌트
│   ├── V6_DashboardPage.tsx  # 메인 대시보드
│   ├── V6_ResultsPage.tsx    # 경기 결과
│   └── V6_AthletesPage.tsx   # 선수단
│
├── hooks/                     # 커스텀 훅
│   └── useAthletes.ts        # 선수 데이터 훅
│
├── services/                  # 비즈니스 로직
│   └── dataService.ts        # 데이터 처리
│
├── utils/                     # 유틸리티
│   └── formatters.ts         # 포맷팅 함수
│
├── types/                     # TypeScript 타입
│   └── index.ts
│
└── data/                      # 프로덕션 데이터
    └── athletes.json         # ⭐ 읽기 전용!
```

---

## 🎨 디자인 시스템 (절대 준수!)

**반드시 읽어야 할 문서:**
→ `docs/specs/DESIGN_SYSTEM.md`

### 핵심 규칙 요약

#### 컬러
```tsx
// 배경
<div className="bg-[#050505]">  {/* 메인 배경 */}
<div className="bg-black/20">   {/* 반투명 카드 */}

// 텍스트
<span className="text-white">   {/* 주요 텍스트 */}
<span className="text-[var(--primary)]">  {/* 강조 */}

// 테두리
<div className="border-white/5">  {/* 연한 테두리 */}
```

#### 타이포그래피
```tsx
// 페이지 타이틀
<h1 className="text-4xl md:text-5xl font-display font-bold tracking-tight">

// 선수 이름 (강조)
<h3 className="text-lg font-black italic text-white uppercase tracking-tight">

// 보조 텍스트
<p className="text-[9px] text-gray-500 font-bold uppercase tracking-wider">
```

#### 카드
```tsx
<div className="glass-card p-5 rounded-3xl border-white/5 
                hover:bg-white/[0.08] transition-all 
                cursor-pointer group relative overflow-hidden">
  {/* 호버 배경 */}
  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent 
                  opacity-0 group-hover:opacity-100 transition-opacity" />
  
  {/* 컨텐츠 */}
  <div className="relative z-10">
    {/* ... */}
  </div>
</div>
```

---

## 📊 데이터 사용 규칙

### ✅ 허용
```tsx
import { useAthletes } from '../hooks/useAthletes';

const MyComponent = () => {
  const { athletes, stats } = useAthletes();  // ✅ 읽기
  
  const filteredAthletes = athletes.filter(...);  // ✅ 필터링
  const sortedAthletes = [...athletes].sort(...);  // ✅ 정렬
  
  return <div>{/* ... */}</div>;
};
```

### ❌ 금지
```tsx
// ❌ 데이터 파일 직접 수정
import athletesData from '../data/athletes.json';
athletesData.athletes.push({ ... });  // 절대 금지!

// ❌ 데이터 구조 변경
const modifiedData = {
  ...athletesData,
  newField: "value"  // 금지!
};
```

### 📋 데이터 타입 (참조용)

```typescript
interface Athlete {
  id: string;
  name_ko: string;
  name_en: string;
  birth_date: string;      // YYYY-MM-DD
  birth_year: number;
  age: number;
  gender: 'M' | 'F';
  sport: string;           // 8개 카테고리 중 하나
  sport_display: string;
  detail_discipline: string;
  team: string;
  fis_code: string;
  photo_url?: string;
  fis_url?: string;
  current_rank?: number;
  best_rank?: number;
  season_starts?: number;
  medals: {
    gold: number;
    silver: number;
    bronze: number;
  };
  recent_results: Result[];
}

interface Result {
  date: string;            // YYYY-MM-DD
  event: string;
  location: string;
  discipline: string;
  rank: number | null;     // 숫자 또는 null
  status: string | null;   // "DNF", "DNS", "DSQ" 또는 null
  fis_points: number;
}
```

---

## 🎭 애니메이션 가이드

### Framer Motion 기본 패턴

#### 페이지 전환
```tsx
import { motion } from 'framer-motion';

<motion.div
  initial={{ opacity: 0, y: -20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.3 }}
>
  {/* 컨텐츠 */}
</motion.div>
```

#### 리스트 아이템
```tsx
<AnimatePresence mode="popLayout">
  {items.map((item, idx) => (
    <motion.div
      key={item.id}
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.3, delay: idx * 0.02 }}
    >
      {/* 아이템 */}
    </motion.div>
  ))}
</AnimatePresence>
```

#### 호버 효과
```tsx
<div className="group">
  {/* 스케일 확대 */}
  <div className="group-hover:scale-110 transition-transform">
    {/* ... */}
  </div>
  
  {/* 색상 변경 */}
  <h3 className="group-hover:text-primary transition-colors">
    {/* ... */}
  </h3>
</div>
```

---

## 🔧 개발 워크플로우

### Step 1: 로컬 개발 서버 실행
```bash
cd V6
npm install
npm run dev
# → http://localhost:5173
```

### Step 2: 컴포넌트 개발
```bash
# 새 컴포넌트 생성
touch src/components/dashboard/MyNewComponent.tsx
```

### Step 3: 타입 체크
```bash
npm run build  # TypeScript 컴파일 확인
```

### Step 4: 린트 확인
```bash
npm run lint
```

---

## 📁 파일 네이밍 규칙

### 컴포넌트 파일
```
V6_ComponentName.tsx      # V6 프리픽스 + PascalCase
```

### 훅 파일
```
useHookName.ts           # "use" 프리픽스 + camelCase
```

### 서비스 파일
```
serviceName.service.ts   # camelCase + ".service" 접미사
```

### 유틸리티 파일
```
utilityName.ts           # camelCase
```

---

## 🎯 페이지별 기능

### 1. Dashboard Page (`/`)

**구성:**
- Hero Section: 팀 소개
- Performance Analysis: 성과 분석
- Distribution Charts: 선수 분포

**파일:**
- `src/pages/V6_DashboardPage.tsx`
- `src/components/dashboard/V6_HeroSection.tsx`
- `src/components/dashboard/V6_PerformanceAnalysis.tsx`
- `src/components/dashboard/V6_DistributionCharts.tsx`

### 2. Results Page (`/results`)

**구성:**
- 경기 결과 타임라인
- 필터링 (종목/선수)
- 정렬 기능

**파일:**
- `src/pages/V6_ResultsPage.tsx`

### 3. Athletes Page (`/athletes`)

**구성:**
- 선수단 전체 목록
- 종목별 필터링
- 선수 카드 그리드
- 프로필 모달

**파일:**
- `src/pages/V6_AthletesPage.tsx`
- `src/components/common/AthleteProfileModal.tsx`

---

## 🚫 절대 금지 영역

### ❌ 수정 금지 폴더
```
data-pipeline/         # 데이터 엔지니어 영역
├── scripts/          # Python 스크립트
├── raw/              # 원본 데이터
└── processed/        # 처리된 데이터
```

### ❌ 수정 금지 파일
```
src/data/athletes.json   # 읽기 전용! 수정 금지!
```

### ❌ 금지 작업
- Python 스크립트 수정
- 데이터 파일 직접 생성/수정
- 데이터 파이프라인 로직 변경

### ✅ 허용 작업
- `src/` 내 모든 React/TypeScript 작업
- `src/data/athletes.json` 읽기만
- CSS/Tailwind 스타일링 (디자인 시스템 준수)
- 애니메이션 추가/수정

---

## 📊 차트 구현 가이드

### Chart.js 사용
```tsx
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

// 등록
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

// 사용
<Line
  data={{
    labels: ['Jan', 'Feb', 'Mar'],
    datasets: [{
      label: 'Performance',
      data: [10, 20, 30],
      borderColor: 'var(--primary)',
      backgroundColor: 'rgba(255, 70, 70, 0.1)'
    }]
  }}
  options={{
    responsive: true,
    plugins: {
      legend: {
        labels: {
          color: 'white'  // 흰색 레이블
        }
      }
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(255, 255, 255, 0.05)'  // 연한 그리드
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.5)'  // 회색 틱
        }
      },
      y: {
        grid: {
          color: 'rgba(255, 255, 255, 0.05)'
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.5)'
        }
      }
    }
  }}
/>
```

---

## 🔍 디버깅 팁

### React DevTools 사용
```bash
# Chrome Extension 설치
# → React 컴포넌트 트리 확인
# → Props/State 실시간 확인
```

### 콘솔 로그 활용
```tsx
const MyComponent = () => {
  const { athletes } = useAthletes();
  
  console.log('Athletes count:', athletes.length);
  console.log('First athlete:', athletes[0]);
  
  return <div>{/* ... */}</div>;
};
```

### TypeScript 타입 에러
```bash
# 타입 확인
npm run build

# 에러가 있으면:
# 1. 타입 정의 확인 (src/types/)
# 2. import 경로 확인
# 3. 필드명 오타 확인
```

---

## 🤝 협업 규칙

### 데이터 구조 변경 요청
1. **먼저 데이터 엔지니어와 협의**
2. 새로운 필드 필요성 설명
3. `DATA_SCHEMA.md` 업데이트 요청
4. 변경사항 적용 후 작업

### 데이터 이상 발견 시
1. 구체적인 문제 설명 (어떤 선수, 어떤 필드)
2. 예상 값 vs 실제 값
3. 데이터 엔지니어에게 보고
4. 수정 완료 후 확인

---

## 📚 참고 문서

- [디자인 시스템](../specs/DESIGN_SYSTEM.md) - **필수 숙지!**
- [데이터 스키마](../specs/DATA_SCHEMA.md) - 데이터 구조
- [프로젝트 개요](../00_PROJECT_OVERVIEW.md) - 전체 이해
- [아키텍처](../ARCHITECTURE.md) - 시스템 구조

---

## 📝 체크리스트 (Pull Request 전)

새 기능 개발 완료 후 확인:

- [ ] 디자인 시스템 준수 (`DESIGN_SYSTEM.md`)
- [ ] 반응형 디자인 구현 (모바일/데스크톱)
- [ ] TypeScript 에러 없음 (`npm run build`)
- [ ] ESLint 경고 없음 (`npm run lint`)
- [ ] 애니메이션 부드러움 (Framer Motion)
- [ ] 데이터 타입 올바름
- [ ] 콘솔 에러 없음
- [ ] 테스트 완료 (`npm run dev`)

---

## 🎯 성공 기준

**당신의 작업이 성공했는지 확인:**

✅ `npm run dev` 정상 실행  
✅ 모든 페이지 정상 렌더링  
✅ 모바일/데스크톱 반응형 완벽  
✅ 애니메이션 부드러움  
✅ V6 디자인 시스템 100% 준수  
✅ TypeScript 에러 0개  
✅ 콘솔 에러/경고 0개  

---

**마지막 업데이트:** 2026-01-31  
**문서 버전:** 1.0  
**담당 역할:** 프론트엔드 개발자

---

## 🚀 Quick Start

```bash
# 1. 개발 서버 실행
npm run dev

# 2. 새 컴포넌트 생성 (예시)
# src/components/dashboard/V6_NewFeature.tsx

# 3. 타입 체크
npm run build

# 4. 린트 확인
npm run lint

# 5. 브라우저 확인
# http://localhost:5173
```

**개발 즐겁게 하세요!** ✨
