# 40_DEV_TEAM.md
**Development Team**  
**프론트엔드 개발 및 배포**

---

## 🎯 팀 미션

디자인과 데이터를 실제 동작하는 웹 애플리케이션으로 구현합니다.

---

## 🛠️ 기술 스택

### Core
- **React 18** + **TypeScript 5**
- **Vite** (빌드 도구)
- **React Router** (라우팅)

### Styling
- **Tailwind CSS** (유틸리티)
- **Framer Motion** (애니메이션)

### Charts
- **Chart.js** + **react-chartjs-2**
- 또는 **Recharts** (선택적)

### Data Management
- **React Context API** (상태 관리)
- **JSON 파일** (정적 데이터)

### Deployment
- **Netlify** (호스팅)
- **GitHub** (버전 관리)

---

## 📁 프로젝트 구조

```
team-korea-winter-2025-26_20260123/
├── public/
│   ├── data/
│   │   └── athletes.json       # 선수 데이터
│   ├── images/
│   │   ├── logo.svg
│   │   └── athletes/           # 선수 사진 (선택적)
│   └── index.html
│
├── src/
│   ├── components/             # 재사용 컴포넌트
│   │   ├── layout/
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   └── Layout.tsx
│   │   ├── common/
│   │   │   ├── Card.tsx
│   │   │   ├── Button.tsx
│   │   │   ├── Badge.tsx
│   │   │   └── Loading.tsx
│   │   └── charts/
│   │       ├── DonutChart.tsx
│   │       ├── BarChart.tsx
│   │       ├── Histogram.tsx
│   │       ├── Timeline.tsx
│   │       ├── Top5Ranking.tsx
│   │       └── RecentMedals.tsx
│   │
│   ├── pages/
│   │   ├── Dashboard.tsx       # 페이지 1: 메인 대시보드
│   │   ├── Results.tsx         # 페이지 2: 최신 결과
│   │   └── Links.tsx           # 페이지 3: 링크 허브
│   │
│   ├── contexts/
│   │   └── DataContext.tsx     # 데이터 전역 상태
│   │
│   ├── hooks/
│   │   ├── useAthletes.ts      # 선수 데이터 훅
│   │   └── useFilters.ts       # 필터링 훅
│   │
│   ├── utils/
│   │   ├── dataProcessing.ts   # 데이터 처리 유틸
│   │   └── constants.ts        # 상수 정의
│   │
│   ├── types/
│   │   └── index.ts            # TypeScript 타입 정의
│   │
│   ├── styles/
│   │   ├── globals.css         # 글로벌 스타일
│   │   └── tailwind.css        # Tailwind 설정
│   │
│   ├── App.tsx                 # 메인 App
│   ├── main.tsx                # 엔트리 포인트
│   └── vite-env.d.ts
│
├── .gitignore
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.js
├── postcss.config.js
└── README.md
```

---

## 🚀 개발 시작

### 1. 프로젝트 초기화

```bash
# Vite + React + TypeScript 프로젝트 생성
npm create vite@latest team-korea-dashboard -- --template react-ts
cd team-korea-dashboard

# 의존성 설치
npm install

# 추가 패키지 설치
npm install react-router-dom
npm install tailwindcss postcss autoprefixer
npm install framer-motion
npm install chart.js react-chartjs-2
npm install @heroicons/react

# Tailwind 초기화
npx tailwindcss init -p
```

### 2. Tailwind 설정

```javascript
// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'korea-red': {
          DEFAULT: '#C60C30',
          dark: '#A00A28',
          light: '#E61B3F',
        },
        'korea-blue': {
          DEFAULT: '#003478',
          dark: '#002456',
          light: '#004A9F',
        },
        'gold': {
          DEFAULT: '#FFD700',
          dark: '#E6C200',
        },
        'silver': {
          DEFAULT: '#C0C0C0',
          dark: '#A8A8A8',
        },
        'bronze': {
          DEFAULT: '#CD7F32',
          dark: '#B5702C',
        },
      },
      fontFamily: {
        sans: ['Pretendard Variable', 'Pretendard', 'sans-serif'],
        display: ['Pretendard Variable', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
```

### 3. TypeScript 타입 정의

```typescript
// src/types/index.ts

export interface Athlete {
  id: string;
  name_ko: string;
  name_en: string;
  birth_date: string;
  age: number;
  gender: 'M' | 'F';
  sport: string;
  sport_display: string;
  team: string;
  fis_code: string;
  fis_url: string;
  current_rank: number | null;
  best_rank: number | null;
  season_starts: number;
  medals: {
    gold: number;
    silver: number;
    bronze: number;
  };
  recent_results: RecentResult[];
}

export interface RecentResult {
  date: string;
  event: string;
  rank: number;
  points: number;
}

export interface DataMetadata {
  last_updated: string;
  total_athletes: number;
  sports: number;
  teams: number;
}

export interface Statistics {
  total_athletes: number;
  by_sport: Record<string, number>;
  by_team: Record<string, number>;
  by_gender: Record<string, number>;
  age_distribution: {
    teens: number;
    twenties: number;
    thirties: number;
  };
  total_medals: {
    gold: number;
    silver: number;
    bronze: number;
  };
}

export interface AthletesData {
  metadata: DataMetadata;
  statistics: Statistics;
  athletes: Athlete[];
}
```

---

## 📄 주요 컴포넌트 구현

### 1. Data Context

```typescript
// src/contexts/DataContext.tsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import { AthletesData } from '../types';

interface DataContextType {
  data: AthletesData | null;
  loading: boolean;
  error: string | null;
}

const DataContext = createContext<DataContextType>({
  data: null,
  loading: true,
  error: null,
});

export const useData = () => useContext(DataContext);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [data, setData] = useState<AthletesData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetch('/data/athletes.json');
        if (!response.ok) throw new Error('데이터를 불러올 수 없습니다');
        const jsonData = await response.json();
        setData(jsonData);
      } catch (err) {
        setError(err instanceof Error ? err.message : '알 수 없는 오류');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  return (
    <DataContext.Provider value={{ data, loading, error }}>
      {children}
    </DataContext.Provider>
  );
};
```

### 2. Layout Components

```typescript
// src/components/layout/Header.tsx
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export const Header = () => {
  return (
    <motion.header 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="bg-white/70 backdrop-blur-lg border-b border-gray-200"
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-korea-red to-korea-blue rounded-lg" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Team Korea</h1>
              <p className="text-sm text-gray-600">Winter Dashboard 2025-26</p>
            </div>
          </Link>
          
          <nav className="flex gap-6">
            <Link 
              to="/" 
              className="text-gray-700 hover:text-korea-red font-semibold transition"
            >
              대시보드
            </Link>
            <Link 
              to="/results" 
              className="text-gray-700 hover:text-korea-red font-semibold transition"
            >
              최신 결과
            </Link>
            <Link 
              to="/links" 
              className="text-gray-700 hover:text-korea-red font-semibold transition"
            >
              링크
            </Link>
          </nav>
        </div>
      </div>
    </motion.header>
  );
};
```

```typescript
// src/components/common/Card.tsx
import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

export const Card = ({ children, className = '', delay = 0 }: CardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className={`
        bg-white/70 backdrop-blur-lg 
        rounded-2xl border border-white/20 
        shadow-xl p-6 
        hover:shadow-2xl hover:-translate-y-1 
        transition-all duration-300
        ${className}
      `}
    >
      {children}
    </motion.div>
  );
};
```

### 3. Dashboard Page

```typescript
// src/pages/Dashboard.tsx
import { useData } from '../contexts/DataContext';
import { Card } from '../components/common/Card';
import { DonutChart } from '../components/charts/DonutChart';
import { BarChart } from '../components/charts/BarChart';
import { Histogram } from '../components/charts/Histogram';
import { Timeline } from '../components/charts/Timeline';
import { Top5Ranking } from '../components/charts/Top5Ranking';
import { RecentMedals } from '../components/charts/RecentMedals';

export const Dashboard = () => {
  const { data, loading, error } = useData();

  if (loading) return <div className="flex justify-center items-center h-screen">로딩 중...</div>;
  if (error) return <div className="text-red-500">에러: {error}</div>;
  if (!data) return null;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <Card className="mb-8 text-center">
        <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-korea-red to-korea-blue bg-clip-text text-transparent">
          대한민국 동계 국가대표
        </h1>
        <div className="flex justify-center gap-8 text-lg">
          <div>
            <span className="font-bold text-korea-red">{data.metadata.total_athletes}명</span> 선수
          </div>
          <div>
            <span className="font-bold text-korea-blue">{data.metadata.sports}개</span> 종목
          </div>
        </div>
        <div className="mt-4 text-2xl font-bold text-gold">
          🏔️ 2026 밀라노-코르티나 동계올림픽 D-XXX
        </div>
      </Card>

      {/* Data Visualization Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card delay={0.1}>
          <h3 className="text-xl font-bold mb-4">종목 분포</h3>
          <DonutChart data={data.statistics.by_sport} />
        </Card>

        <Card delay={0.2}>
          <h3 className="text-xl font-bold mb-4">팀별 현황</h3>
          <BarChart data={data.statistics.by_team} />
        </Card>

        <Card delay={0.3}>
          <h3 className="text-xl font-bold mb-4">연령 분포</h3>
          <Histogram data={data.statistics.age_distribution} />
        </Card>

        <Card delay={0.4}>
          <h3 className="text-xl font-bold mb-4">시즌 활동</h3>
          <Timeline athletes={data.athletes} />
        </Card>

        <Card delay={0.5}>
          <Top5Ranking athletes={data.athletes} />
        </Card>

        <Card delay={0.6}>
          <RecentMedals athletes={data.athletes} />
        </Card>
      </div>
    </div>
  );
};
```

---

## 🧪 테스트

```typescript
// src/components/__tests__/Card.test.tsx
import { render, screen } from '@testing-library/react';
import { Card } from '../common/Card';

describe('Card', () => {
  it('renders children correctly', () => {
    render(<Card>Test Content</Card>);
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(<Card className="custom-class">Content</Card>);
    expect(container.firstChild).toHaveClass('custom-class');
  });
});
```

---

## 📦 빌드 및 배포

### Netlify 설정

```toml
# netlify.toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### 배포 명령어

```bash
# 빌드
npm run build

# 로컬 프리뷰
npm run preview

# Netlify CLI로 배포
netlify deploy --prod
```

---

## 🔄 CI/CD

```yaml
# .github/workflows/deploy.yml
name: Deploy to Netlify

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build
        run: npm run build
      
      - name: Deploy to Netlify
        uses: nwtgck/actions-netlify@v1.2
        with:
          publish-dir: './dist'
          production-branch: main
        env:
          NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
          NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE_ID }}
```

---

## ✅ 체크리스트

**초기 설정**
- [ ] Vite + React + TS 프로젝트 생성
- [ ] Tailwind CSS 설정
- [ ] TypeScript 타입 정의
- [ ] 프로젝트 구조 생성

**컴포넌트 개발**
- [ ] Layout (Header, Footer)
- [ ] Common (Card, Button, Badge)
- [ ] Charts (6개 차트 컴포넌트)
- [ ] Pages (Dashboard, Results, Links)

**기능 구현**
- [ ] Data Context 구현
- [ ] 선수 데이터 로드
- [ ] 차트 데이터 연동
- [ ] 필터링 기능
- [ ] 반응형 레이아웃

**테스트 & 최적화**
- [ ] 유닛 테스트
- [ ] 성능 최적화
- [ ] 접근성 검증
- [ ] 크로스 브라우저 테스트

**배포**
- [ ] Netlify 설정
- [ ] CI/CD 파이프라인
- [ ] 프로덕션 빌드
- [ ] 도메인 연결

---

**담당자**: Development Team  
**마지막 업데이트**: 2026-01-23  
**상태**: 🟡 데이터 대기 중
