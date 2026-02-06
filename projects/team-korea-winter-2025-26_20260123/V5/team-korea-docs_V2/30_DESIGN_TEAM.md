# 30_DESIGN_TEAM.md
**Design Team Agents**  
**UI/UX 디자인 및 데이터 시각화**

---

## 🎯 팀 미션

**"국가대표 프리미엄"** 컨셉으로 사용자 경험과 데이터 시각화를 최적화합니다.

---

## 👥 팀 구성

### Agent A: UI/UX Designer
**역할**: 레이아웃, 컴포넌트, 반응형 디자인

### Agent B: Chart Designer
**역할**: 데이터 시각화, 인포그래픽, 차트 설계

---

## 🎨 Agent A: UI/UX Designer

### 디자인 시스템

#### 색상 팔레트

```css
/* colors.css */
:root {
  /* Primary - 태극기 컬러 */
  --korea-red: #C60C30;
  --korea-red-dark: #A00A28;
  --korea-red-light: #E61B3F;
  
  --korea-blue: #003478;
  --korea-blue-dark: #002456;
  --korea-blue-light: #004A9F;
  
  /* Neutral */
  --white: #FFFFFF;
  --black: #000000;
  
  --gray-50: #F9FAFB;
  --gray-100: #F3F4F6;
  --gray-200: #E5E7EB;
  --gray-300: #D1D5DB;
  --gray-400: #9CA3AF;
  --gray-500: #6B7280;
  --gray-600: #4B5563;
  --gray-700: #374151;
  --gray-800: #1F2937;
  --gray-900: #111827;
  
  /* Accent - 메달 */
  --gold: #FFD700;
  --gold-dark: #E6C200;
  --silver: #C0C0C0;
  --silver-dark: #A8A8A8;
  --bronze: #CD7F32;
  --bronze-dark: #B5702C;
  
  /* Semantic */
  --success: #10B981;
  --warning: #F59E0B;
  --error: #EF4444;
  --info: #3B82F6;
  
  /* Glassmorphism */
  --glass-bg: rgba(255, 255, 255, 0.7);
  --glass-border: rgba(255, 255, 255, 0.18);
  --glass-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
}

/* Dark mode */
@media (prefers-color-scheme: dark) {
  :root {
    --glass-bg: rgba(17, 24, 39, 0.7);
    --glass-border: rgba(255, 255, 255, 0.08);
  }
}
```

#### 타이포그래피

```css
/* typography.css */
@import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/variable/pretendardvariable.css');

:root {
  /* Font Families */
  --font-display: 'Pretendard Variable', -apple-system, BlinkMacSystemFont, sans-serif;
  --font-body: 'Pretendard', -apple-system, BlinkMacSystemFont, sans-serif;
  --font-mono: 'SF Mono', Monaco, 'Cascadia Code', monospace;
  
  /* Font Sizes */
  --text-xs: 0.75rem;      /* 12px */
  --text-sm: 0.875rem;     /* 14px */
  --text-base: 1rem;       /* 16px */
  --text-lg: 1.125rem;     /* 18px */
  --text-xl: 1.25rem;      /* 20px */
  --text-2xl: 1.5rem;      /* 24px */
  --text-3xl: 1.875rem;    /* 30px */
  --text-4xl: 2.25rem;     /* 36px */
  --text-5xl: 3rem;        /* 48px */
  
  /* Font Weights */
  --font-light: 300;
  --font-normal: 400;
  --font-medium: 500;
  --font-semibold: 600;
  --font-bold: 700;
  --font-extrabold: 800;
  
  /* Line Heights */
  --leading-tight: 1.25;
  --leading-normal: 1.5;
  --leading-relaxed: 1.75;
}

/* Utility Classes */
.heading-1 {
  font-family: var(--font-display);
  font-size: var(--text-5xl);
  font-weight: var(--font-extrabold);
  line-height: var(--leading-tight);
}

.heading-2 {
  font-family: var(--font-display);
  font-size: var(--text-4xl);
  font-weight: var(--font-bold);
  line-height: var(--leading-tight);
}

.heading-3 {
  font-family: var(--font-display);
  font-size: var(--text-3xl);
  font-weight: var(--font-semibold);
  line-height: var(--leading-normal);
}

.body-large {
  font-family: var(--font-body);
  font-size: var(--text-lg);
  font-weight: var(--font-normal);
  line-height: var(--leading-relaxed);
}

.body {
  font-family: var(--font-body);
  font-size: var(--text-base);
  font-weight: var(--font-normal);
  line-height: var(--leading-normal);
}

.caption {
  font-family: var(--font-body);
  font-size: var(--text-sm);
  font-weight: var(--font-normal);
  line-height: var(--leading-normal);
  color: var(--gray-600);
}
```

#### 컴포넌트 라이브러리

**1. Card (Glass morphism)**
```css
.glass-card {
  background: var(--glass-bg);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border-radius: 16px;
  border: 1px solid var(--glass-border);
  box-shadow: var(--glass-shadow);
  padding: 24px;
  transition: all 0.3s ease;
}

.glass-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 40px 0 rgba(31, 38, 135, 0.45);
}
```

**2. Button**
```css
.btn-primary {
  background: linear-gradient(135deg, var(--korea-red), var(--korea-red-dark));
  color: var(--white);
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: var(--font-semibold);
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-primary:hover {
  transform: scale(1.05);
  box-shadow: 0 8px 16px rgba(198, 12, 48, 0.3);
}

.btn-secondary {
  background: var(--white);
  color: var(--korea-blue);
  border: 2px solid var(--korea-blue);
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: var(--font-semibold);
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-secondary:hover {
  background: var(--korea-blue);
  color: var(--white);
}
```

**3. Badge (메달)**
```css
.badge-gold {
  background: linear-gradient(135deg, var(--gold), var(--gold-dark));
  color: var(--gray-900);
  padding: 4px 12px;
  border-radius: 12px;
  font-size: var(--text-sm);
  font-weight: var(--font-bold);
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.badge-silver {
  background: linear-gradient(135deg, var(--silver), var(--silver-dark));
  color: var(--gray-900);
  padding: 4px 12px;
  border-radius: 12px;
  font-size: var(--text-sm);
  font-weight: var(--font-bold);
}

.badge-bronze {
  background: linear-gradient(135deg, var(--bronze), var(--bronze-dark));
  color: var(--white);
  padding: 4px 12px;
  border-radius: 12px;
  font-size: var(--text-sm);
  font-weight: var(--font-bold);
}
```

#### 페이지 레이아웃

**와이어프레임 - 페이지 1: 대시보드**

```
┌────────────────────────────────────────────────┐
│  Header                                         │
│  [Logo] Team Korea Winter Dashboard   [Nav]    │
├────────────────────────────────────────────────┤
│                                                 │
│  Hero Section                                   │
│  ┌──────────────────────────────────────────┐  │
│  │  대한민국 동계 국가대표                   │  │
│  │  43명 선수 | 7개 종목                     │  │
│  │  [올림픽 카운트다운: D-XXX]               │  │
│  └──────────────────────────────────────────┘  │
│                                                 │
│  Data Visualization Grid (2x3)                  │
│  ┌─────────────┐  ┌─────────────┐             │
│  │ 종목 분포    │  │ 팀별 현황    │             │
│  │ (도넛 차트) │  │ (바 차트)   │             │
│  └─────────────┘  └─────────────┘             │
│                                                 │
│  ┌─────────────┐  ┌─────────────┐             │
│  │ 연령 분포    │  │ 시즌 활동    │             │
│  │ (히스토그램) │  │ (타임라인)  │             │
│  └─────────────┘  └─────────────┘             │
│                                                 │
│  ┌─────────────┐  ┌─────────────┐             │
│  │ TOP 5 랭킹   │  │ 최근 메달    │             │
│  │ (리스트)    │  │ (뱃지)      │             │
│  └─────────────┘  └─────────────┘             │
│                                                 │
│  ┌──────────────────────────────────────────┐  │
│  │  이번 달의 선수 스포트라이트              │  │
│  │  [Photo] [Name] [Recent Achievement]     │  │
│  └──────────────────────────────────────────┘  │
│                                                 │
├────────────────────────────────────────────────┤
│  Footer                                         │
└────────────────────────────────────────────────┘
```

#### 반응형 브레이크포인트

```css
/* breakpoints.css */
:root {
  --screen-sm: 640px;   /* Mobile */
  --screen-md: 768px;   /* Tablet */
  --screen-lg: 1024px;  /* Desktop */
  --screen-xl: 1280px;  /* Large Desktop */
}

/* Mobile First */
.grid-2x3 {
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
}

@media (min-width: 768px) {
  .grid-2x3 {
    grid-template-columns: repeat(2, 1fr);
    gap: 24px;
  }
}

@media (min-width: 1024px) {
  .grid-2x3 {
    grid-template-columns: repeat(3, 1fr);
    gap: 32px;
  }
}
```

---

## 📊 Agent B: Chart Designer

### 차트 디자인 시스템

#### 1. 도넛 차트 - 종목 분포

```javascript
// 종목별 색상
const sportColors = {
  alpine_skiing: '#003478',      // 코리아 블루
  ski_cross: '#0057A8',
  freestyle_moguls: '#C60C30',   // 코리아 레드
  freestyle_park: '#E61B3F',
  snowboard_park: '#FFD700',     // 골드
  snowboard_cross: '#E6C200',
  snowboard_alpine: '#6B7280'    // 그레이
};

const donutChartConfig = {
  type: 'doughnut',
  data: {
    labels: ['Alpine Skiing', 'Ski Cross', 'Freestyle - Moguls', ...],
    datasets: [{
      data: [10, 5, 8, ...],
      backgroundColor: Object.values(sportColors),
      borderWidth: 2,
      borderColor: '#FFFFFF',
      hoverOffset: 10
    }]
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          font: {
            family: 'Pretendard',
            size: 14
          },
          padding: 20,
          usePointStyle: true
        }
      },
      tooltip: {
        backgroundColor: 'rgba(17, 24, 39, 0.9)',
        titleFont: { size: 16, weight: 'bold' },
        bodyFont: { size: 14 },
        padding: 12,
        cornerRadius: 8
      }
    },
    cutout: '65%' // 도넛 두께
  }
};
```

#### 2. 바 차트 - 팀별 현황

```javascript
const barChartConfig = {
  type: 'bar',
  data: {
    labels: ['프리스타일', '스노보드', '알파인', '스키 크로스'],
    datasets: [{
      label: '선수 수',
      data: [15, 20, 5, 3],
      backgroundColor: [
        'rgba(198, 12, 48, 0.8)',  // 레드
        'rgba(0, 52, 120, 0.8)',   // 블루
        'rgba(255, 215, 0, 0.8)',  // 골드
        'rgba(107, 114, 128, 0.8)' // 그레이
      ],
      borderColor: [
        'rgba(198, 12, 48, 1)',
        'rgba(0, 52, 120, 1)',
        'rgba(255, 215, 0, 1)',
        'rgba(107, 114, 128, 1)'
      ],
      borderWidth: 2,
      borderRadius: 8
    }]
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: 'rgba(17, 24, 39, 0.9)',
        padding: 12,
        cornerRadius: 8
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          font: { family: 'Pretendard', size: 12 }
        },
        grid: {
          color: 'rgba(229, 231, 235, 0.5)'
        }
      },
      x: {
        ticks: {
          font: { family: 'Pretendard', size: 14, weight: 'bold' }
        },
        grid: { display: false }
      }
    }
  }
};
```

#### 3. 히스토그램 - 연령 분포

```javascript
const ageHistogramConfig = {
  type: 'bar',
  data: {
    labels: ['10대', '20대', '30대', '40대'],
    datasets: [{
      label: '선수 수',
      data: [5, 28, 9, 1],
      backgroundColor: 'rgba(59, 130, 246, 0.8)',
      borderColor: 'rgba(59, 130, 246, 1)',
      borderWidth: 2,
      borderRadius: 8
    }]
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false }
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: '인원',
          font: { family: 'Pretendard', size: 14, weight: 'bold' }
        }
      },
      x: {
        title: {
          display: true,
          text: '연령대',
          font: { family: 'Pretendard', size: 14, weight: 'bold' }
        }
      }
    }
  }
};
```

#### 4. 타임라인 - 시즌 활동

```javascript
const timelineConfig = {
  type: 'line',
  data: {
    labels: ['9월', '10월', '11월', '12월', '1월', '2월', '3월'],
    datasets: [{
      label: '출전 경기 수',
      data: [5, 12, 18, 25, 22, 20, 15],
      fill: true,
      backgroundColor: 'rgba(198, 12, 48, 0.1)',
      borderColor: 'rgba(198, 12, 48, 1)',
      borderWidth: 3,
      tension: 0.4, // 부드러운 곡선
      pointRadius: 6,
      pointBackgroundColor: 'rgba(198, 12, 48, 1)',
      pointBorderColor: '#FFFFFF',
      pointBorderWidth: 2,
      pointHoverRadius: 8
    }]
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        mode: 'index',
        intersect: false
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: '경기 수',
          font: { family: 'Pretendard', size: 14 }
        }
      }
    }
  }
};
```

#### 5. TOP 5 랭킹 - 카드 리스트

```jsx
// React Component
const Top5Ranking = ({ athletes }) => {
  const topAthletes = athletes
    .filter(a => a.current_rank)
    .sort((a, b) => a.current_rank - b.current_rank)
    .slice(0, 5);

  return (
    <div className="glass-card">
      <h3 className="heading-3 mb-4">🏆 국제 랭킹 TOP 5</h3>
      <div className="space-y-3">
        {topAthletes.map((athlete, index) => (
          <div 
            key={athlete.id}
            className="flex items-center justify-between p-3 rounded-lg bg-white/50 hover:bg-white/70 transition"
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl font-bold text-korea-red">
                #{athlete.current_rank}
              </span>
              <div>
                <p className="font-semibold">{athlete.name_ko}</p>
                <p className="text-sm text-gray-600">{athlete.sport_display}</p>
              </div>
            </div>
            {athlete.current_rank <= 3 && (
              <span className={`badge-${
                athlete.current_rank === 1 ? 'gold' :
                athlete.current_rank === 2 ? 'silver' : 'bronze'
              }`}>
                {athlete.current_rank === 1 ? '🥇' :
                 athlete.current_rank === 2 ? '🥈' : '🥉'}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
```

#### 6. 최근 메달 - 뱃지 그리드

```jsx
const RecentMedals = ({ athletes }) => {
  const recentMedals = athletes
    .filter(a => a.medals.gold + a.medals.silver + a.medals.bronze > 0)
    .slice(0, 6);

  return (
    <div className="glass-card">
      <h3 className="heading-3 mb-4">🏅 최근 메달</h3>
      <div className="grid grid-cols-2 gap-3">
        {recentMedals.map(athlete => (
          <div key={athlete.id} className="p-3 rounded-lg bg-white/50">
            <p className="font-semibold text-sm mb-2">{athlete.name_ko}</p>
            <div className="flex gap-2">
              {athlete.medals.gold > 0 && (
                <span className="badge-gold text-xs">🥇 {athlete.medals.gold}</span>
              )}
              {athlete.medals.silver > 0 && (
                <span className="badge-silver text-xs">🥈 {athlete.medals.silver}</span>
              )}
              {athlete.medals.bronze > 0 && (
                <span className="badge-bronze text-xs">🥉 {athlete.medals.bronze}</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
```

---

## 🎬 애니메이션

### Framer Motion 스타일

```jsx
import { motion } from 'framer-motion';

// 페이드인 + 슬라이드업
const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
};

// 스태거 애니메이션
const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

// 사용 예시
<motion.div
  variants={container}
  initial="hidden"
  animate="show"
  className="grid-2x3"
>
  {charts.map(chart => (
    <motion.div key={chart.id} variants={item}>
      {chart.component}
    </motion.div>
  ))}
</motion.div>
```

---

## ✅ 체크리스트

**UI/UX Designer**
- [ ] 색상 팔레트 확정
- [ ] 타이포그래피 시스템
- [ ] 컴포넌트 라이브러리 (Card, Button, Badge)
- [ ] 페이지 레이아웃 (3페이지)
- [ ] 반응형 그리드 시스템
- [ ] 애니메이션 정의

**Chart Designer**
- [ ] 도넛 차트 (종목 분포)
- [ ] 바 차트 (팀별 현황)
- [ ] 히스토그램 (연령 분포)
- [ ] 타임라인 (시즌 활동)
- [ ] 카드 리스트 (TOP 5 랭킹)
- [ ] 뱃지 그리드 (최근 메달)

---

**담당자**: Design Team Agents  
**마지막 업데이트**: 2026-01-23  
**상태**: 🟢 진행 중
