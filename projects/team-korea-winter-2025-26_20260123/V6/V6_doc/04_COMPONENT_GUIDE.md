# 컴포넌트 가이드

**목적:** V6 프로젝트의 모든 React 컴포넌트 사용법 및 구조 설명  
**대상:** 프론트엔드 개발자  
**최종 업데이트:** 2026-01-31

---

## 📂 **컴포넌트 구조**

```
src/components/
├── common/                    # 공통 컴포넌트
│   └── AthleteProfileModal.tsx
├── dashboard/                 # 대시보드 전용
│   ├── V6_HeroSection.tsx
│   ├── V6_PerformanceAnalysis.tsx
│   └── V6_DistributionCharts.tsx
└── layout/                    # 레이아웃
    ├── Header.tsx
    └── V6_BottomNav.tsx

src/pages/                     # 페이지 컴포넌트
├── V6_DashboardPage.tsx
├── V6_AthletesPage.tsx
└── V6_ResultsPage.tsx
```

---

## 📄 **페이지 컴포넌트**

### 1. V6_DashboardPage

**경로:** `src/pages/V6_DashboardPage.tsx`  
**라우트:** `/`  
**목적:** 메인 대시보드 페이지

#### 구성 요소
```tsx
<V6_DashboardPage>
  ├── Header (fixed)
  ├── <Hero />
  ├── <PerformanceAnalysis />
  ├── <DistributionCharts />
  └── Footer
</V6_DashboardPage>
```

#### 사용 데이터
```tsx
const { stats, athletes } = useAthletes();
```

#### 주요 기능
- 팀 전체 통계 표시
- 성과 분석 차트
- 선수 분포 시각화

---

### 2. V6_AthletesPage

**경로:** `src/pages/V6_AthletesPage.tsx`  
**라우트:** `/athletes`  
**목적:** 선수단 목록 및 프로필

#### 구성 요소
```tsx
<V6_AthletesPage>
  ├── Header (fixed)
  ├── 페이지 타이틀
  ├── 종목 필터 버튼
  ├── 선수 카드 그리드
  ├── <AthleteProfileModal />
  └── Footer
</V6_AthletesPage>
```

#### State 관리
```tsx
const [selectedAthlete, setSelectedAthlete] = useState<Athlete | null>(null);
const [selectedSport, setSelectedSport] = useState<string>('all');
```

#### 주요 기능
- 종목별 필터링
- 선수 카드 표시
- 프로필 모달 팝업
- Framer Motion 애니메이션

#### 종목 순서
```typescript
const SPORT_ORDER = [
  'alpine_skiing',
  'cross_country', 
  'freeski',
  'moguls',
  'ski_jumping',
  'snowboard_alpine',
  'snowboard_cross',
  'snowboard_park'
];
```

#### 종목 한글 매핑
```typescript
const SPORT_DISPLAY_KR: Record<string, string> = {
  'alpine_skiing': '알파인 스키',
  'cross_country': '크로스컨트리',
  'freeski': '프리스키',
  'moguls': '모굴',
  'ski_jumping': '스키점프',
  'snowboard_alpine': '스노보드 알파인',
  'snowboard_cross': '스노보드 크로스',
  'snowboard_park': '스노보드 파크'
};
```

---

### 3. V6_ResultsPage

**경로:** `src/pages/V6_ResultsPage.tsx`  
**라우트:** `/results`  
**목적:** 경기 결과 타임라인

#### 구성 요소
```tsx
<V6_ResultsPage>
  ├── Header (fixed)
  ├── 카테고리 필터
  ├── 경기 결과 타임라인
  ├── 페이지네이션
  └── Footer
</V6_ResultsPage>
```

#### State 관리
```tsx
const [selectedCategory, setSelectedCategory] = useState('All');
const [selectedResult, setSelectedResult] = useState<any>(null);
const [currentPage, setCurrentPage] = useState(1);
```

#### 주요 기능
- 경기 결과 필터링
- 시간순 정렬
- 페이지네이션 (12개씩)
- 결과 상세 모달

---

## 🧩 **재사용 컴포넌트**

### 1. AthleteProfileModal

**경로:** `src/components/common/AthleteProfileModal.tsx`  
**목적:** 선수 상세 정보 모달

#### Props
```typescript
interface AthleteProfileModalProps {
  isOpen: boolean;
  athlete: Athlete | null;
  onClose: () => void;
}
```

#### 사용 예시
```tsx
import { AthleteProfileModal } from '../components/common/AthleteProfileModal';

const [selectedAthlete, setSelectedAthlete] = useState<Athlete | null>(null);

<AthleteProfileModal
  isOpen={!!selectedAthlete}
  athlete={selectedAthlete}
  onClose={() => setSelectedAthlete(null)}
/>
```

#### 표시 정보
- 선수 기본 정보
- FIS 순위
- 최근 경기 결과
- 시즌 통계

---

### 2. V6_HeroSection

**경로:** `src/components/dashboard/V6_HeroSection.tsx`  
**목적:** 대시보드 히어로 섹션

#### Export
```tsx
export const V6_Hero
```

#### Props
```typescript
// Props 없음 (자체 데이터 로딩)
```

#### 사용 예시
```tsx
import { V6_Hero as Hero } from '../components/dashboard/V6_HeroSection';

<Hero />
```

#### 주요 기능
- 팀 소개
- 주요 지표 표시
- 애니메이션 효과

---

### 3. V6_PerformanceAnalysis

**경로:** `src/components/dashboard/V6_PerformanceAnalysis.tsx`  
**목적:** 성과 분석 섹션

#### Export
```tsx
export const V6_PerformanceAnalysis
```

#### Props
```typescript
// Props 없음 (useAthletes 훅 사용)
```

#### 사용 예시
```tsx
import { V6_PerformanceAnalysis as PerformanceAnalysis } from '../components/dashboard/V6_PerformanceAnalysis';

<PerformanceAnalysis />
```

#### 주요 기능
- 팀 성과 차트
- Momentum 추이
- 실시간 통계

---

### 4. V6_DistributionCharts

**경로:** `src/components/dashboard/V6_DistributionCharts.tsx`  
**목적:** 선수 분포 차트

#### Export
```tsx
export const V6_DistributionCharts
```

#### Props
```typescript
interface DistributionChartsProps {
  stats: Statistics;
  athletes: Athlete[];
}
```

#### 사용 예시
```tsx
import { V6_DistributionCharts as DistributionCharts } from '../components/dashboard/V6_DistributionCharts';

const { stats, athletes } = useAthletes();

<DistributionCharts stats={stats} athletes={athletes} />
```

#### 표시 차트
- 종목별 인원 (Horizontal Bar)
- 연령대 분포 (Bar Chart)
- 성별 분포 (Doughnut Chart)

---

### 5. V6_BottomNav

**경로:** `src/components/layout/V6_BottomNav.tsx`  
**목적:** 하단 고정 네비게이션

#### Export
```tsx
export const V6_BottomNav
```

#### Props
```typescript
// Props 없음
```

#### 사용 예시
```tsx
import { V6_BottomNav as BottomNav } from './components/layout/V6_BottomNav';

// App.tsx에서
<Router>
  <Routes>...</Routes>
  <BottomNav />  {/* 모든 페이지에 표시 */}
</Router>
```

#### 네비게이션 링크
- Dashboard (`/`)
- Results (`/results`)
- Athletes (`/athletes`)

---

## 🎨 **공통 디자인 패턴**

### Glass Card
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

### 선수 카드
```tsx
<motion.div
  layout
  initial={{ opacity: 0, scale: 0.9 }}
  animate={{ opacity: 1, scale: 1 }}
  exit={{ opacity: 0, scale: 0.9 }}
  transition={{ duration: 0.3, delay: idx * 0.02 }}
  className="glass-card p-5 rounded-3xl border-white/5 
             hover:bg-white/[0.08] transition-all cursor-pointer group"
>
  {/* Initial Circle */}
  <div className="w-16 h-16 mx-auto rounded-full bg-white/10 border border-white/20 
                  flex items-center justify-center group-hover:scale-110 transition-transform">
    <span className="text-2xl font-black italic text-white/80">{initial}</span>
  </div>
  
  {/* Name */}
  <h3 className="text-lg font-black italic text-white uppercase tracking-tight 
                 leading-tight group-hover:text-primary transition-colors">
    {athlete.name_ko}
  </h3>
  
  {/* Sport Badge */}
  <span className="px-3 py-1 rounded-full bg-primary/20 text-primary 
                   text-[10px] font-black uppercase italic tracking-tight 
                   border border-primary/30">
    {sportKr}
  </span>
</motion.div>
```

### 페이지 타이틀
```tsx
<motion.h1
  className="text-4xl md:text-5xl font-display font-bold tracking-tight mb-2"
  initial={{ opacity: 0, y: -20 }}
  animate={{ opacity: 1, y: 0 }}
>
  페이지 제목
</motion.h1>
<p className="text-gray-400 font-sans">영문 부제</p>
```

---

## 🔧 **커스텀 훅**

### useAthletes

**경로:** `src/hooks/useAthletes.ts`  
**목적:** 선수 데이터 로딩 및 제공

#### 사용법
```tsx
import { useAthletes } from '../hooks/useAthletes';

const MyComponent = () => {
  const { athletes, stats } = useAthletes();
  
  return (
    <div>
      <p>총 선수: {stats.total_athletes}명</p>
      {athletes.map(athlete => (
        <div key={athlete.id}>{athlete.name_ko}</div>
      ))}
    </div>
  );
};
```

#### 반환 타입
```typescript
interface UseAthletesReturn {
  athletes: Athlete[];
  stats: Statistics;
}
```

---

## 📊 **차트 컴포넌트 (Chart.js)**

### 기본 설정
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
```

### 라인 차트 예시
```tsx
<Line
  data={{
    labels: ['Jan', 'Feb', 'Mar'],
    datasets: [{
      label: 'Performance',
      data: [10, 20, 30],
      borderColor: 'var(--primary)',
      backgroundColor: 'rgba(255, 146, 154, 0.1)',
      tension: 0.4
    }]
  }}
  options={{
    responsive: true,
    plugins: {
      legend: {
        labels: {
          color: 'white',
          font: { family: 'Pretendard Variable' }
        }
      }
    },
    scales: {
      x: {
        grid: { color: 'rgba(255, 255, 255, 0.05)' },
        ticks: { color: 'rgba(255, 255, 255, 0.5)' }
      },
      y: {
        grid: { color: 'rgba(255, 255, 255, 0.05)' },
        ticks: { color: 'rgba(255, 255, 255, 0.5)' }
      }
    }
  }}
/>
```

### 바 차트 예시
```tsx
<Bar
  data={{
    labels: ['알파인', '크로스컨트리', '프리스키'],
    datasets: [{
      data: [10, 9, 5],
      backgroundColor: 'var(--primary)',
      borderColor: 'rgba(255, 146, 154, 0.5)',
      borderWidth: 1
    }]
  }}
  options={{
    indexAxis: 'y',  // 가로 막대
    responsive: true,
    plugins: {
      legend: { display: false }
    }
  }}
/>
```

---

## 🎭 **애니메이션 패턴**

### 페이지 전환
```tsx
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5 }}
>
  {/* 페이지 내용 */}
</motion.div>
```

### 리스트 아이템
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
      {/* 아이템 내용 */}
    </motion.div>
  ))}
</AnimatePresence>
```

### 모달
```tsx
<AnimatePresence>
  {isOpen && (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 z-50"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-3xl p-6"
      >
        {/* 모달 내용 */}
      </motion.div>
    </motion.div>
  )}
</AnimatePresence>
```

---

## 🔍 **타입 정의**

### 공통 타입 (src/types/index.ts)
```typescript
export interface Athlete {
  id: string;
  name_ko: string;
  name_en: string;
  birth_date: string;
  birth_year: number;
  age: number;
  gender: 'M' | 'F';
  sport: Sport;
  sport_display: string;
  detail_discipline: string;
  team: string;
  fis_code: string;
  photo_url?: string;
  fis_url?: string;
  current_rank?: number;
  best_rank?: number;
  season_starts?: number;
  medals: Medals;
  recent_results: Result[];
}

export interface Result {
  date: string;
  event: string;
  location: string;
  discipline: string;
  rank: number | null;
  status: string | null;
  fis_points: number;
}

export interface Statistics {
  by_sport: Record<string, number>;
  by_gender: Record<'M' | 'F', number>;
  age_distribution: {
    teens: number;
    twenties: number;
    thirties: number;
  };
  total_athletes: number;
}

export type Sport =
  | 'alpine_skiing'
  | 'cross_country'
  | 'freeski'
  | 'moguls'
  | 'ski_jumping'
  | 'snowboard_alpine'
  | 'snowboard_cross'
  | 'snowboard_park';
```

---

## 📝 **컴포넌트 작성 가이드라인**

### 1. 파일 네이밍
```
V6_ComponentName.tsx  (페이지/대시보드 컴포넌트)
ComponentName.tsx     (공통 컴포넌트)
```

### 2. Export 방식
```tsx
// Named Export (권장)
export const V6_DashboardPage = () => { ... }

// Default Export (피하기)
export default V6_DashboardPage;  // ❌
```

### 3. Props 타입 정의
```tsx
interface MyComponentProps {
  title: string;
  count?: number;  // 선택적
  onClose: () => void;
}

export const MyComponent = ({ title, count = 0, onClose }: MyComponentProps) => {
  // ...
};
```

### 4. 디자인 시스템 준수
```tsx
// ✅ 정확한 색상 사용
<div className="bg-[#050505]">
<span className="text-[var(--primary)]">

// ❌ 임의의 색상
<div className="bg-blue-500">  // 금지!
```

---

## 🧪 **테스트 가이드**

### 컴포넌트 테스트 체크리스트
- [ ] 데이터 없을 때 오류 없는가?
- [ ] 로딩 상태 처리되는가?
- [ ] 반응형 디자인 작동하는가?
- [ ] 애니메이션 부드러운가?
- [ ] 타입 에러 없는가?
- [ ] 콘솔 경고 없는가?

---

## 📚 **관련 문서**

- [디자인 시스템](./DESIGN_SYSTEM.md) - 스타일 규칙
- [데이터 스키마](./DATA_SCHEMA.md) - 데이터 구조
- [프론트엔드 가이드](../roles/FRONTEND_DEVELOPER.md) - 전반적인 개발 가이드

---

**마지막 업데이트:** 2026-01-31  
**문서 버전:** 1.0  
**중요도:** ⭐⭐⭐⭐
