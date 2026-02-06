# V6 디자인 시스템 - 절대 변경 금지!

**경고: 이 문서의 모든 규칙은 절대 변경 금지입니다!**  
**디자인 변경이 필요하면 프로젝트 매니저와 먼저 상의하세요.**

---

## 🎨 V6 디자인 컨셉

**테마:** Dark Glass Morphism with Navy Accents  
**분위기:** 고급스럽고 현대적인 스포츠 대시보드  
**키워드:** 거의 검은 배경, 반투명 유리, 분홍빨강 액센트

**주요 특징:**
- 🖤 거의 검은 배경 (#050505, #0a0a0b)
- 💎 Glass Morphism (네이비 톤 유리 효과)
- 🔴 Firebrick 액센트 (#FF929A)
- ✨ Grain 오버레이 효과
- 🎬 Cinematic한 느낌

**컬러 철학:**
- 페이지: 검은색 배경 (깔끔하고 모던)
- Glass 카드: 네이비 톤 반투명 (Tangaroa 기반)
- 강조: 분홍빨강 (Firebrick)

---

## 🌈 컬러 시스템

### 배경색 (Background)
```css
/* 페이지 메인 배경 (실제 사용) */
bg-[#050505]          /* 거의 검은색 - DashboardPage, AthletesPage */
bg-[#0a0a0b]          /* 약간 밝은 검은색 - ResultsPage */

/* Body 배경 (gradient, 페이지 컴포넌트에 의해 덮임) */
radial-gradient(circle at 50% -20%, #53728A22 0%, #0D2744 100%)

/* 카드/섹션 배경 (Glass Morphism) */
--glass-bg: rgba(13, 39, 68, 0.4)  /* Tangaroa 40% 투명도 */
bg-black/20           /* 20% 불투명도의 검은색 */
bg-black/40           /* 40% 불투명도의 검은색 */
bg-white/5            /* 5% 불투명도의 흰색 (매우 연함) */
bg-white/10           /* 10% 불투명도의 흰색 */
```

**중요:** 
- 실제 화면에서는 `bg-[#050505]` (거의 검은색)가 표시됨
- CSS의 Tangaroa (#0D2744)는 Glass 효과에만 사용됨

### 텍스트 색상
```css
/* 주요 텍스트 */
text-white            /* 순수 흰색 */

/* 보조 텍스트 */
text-gray-400         /* 중간 회색 */
text-gray-500         /* 연한 회색 */
text-gray-700         /* 어두운 회색 */
text-gray-800         /* 매우 어두운 회색 */

/* 강조 색상 */
text-[var(--primary)]  /* Primary 컬러 (빨간색 계열) */
```

### 강조 색상 (Accent Colors)
```css
/* Primary - Firebrick (분홍빨강) */
--primary: #FF929A           /* CSS 변수 */
bg-[var(--primary)]
text-[var(--primary)]
border-primary/30            /* 30% 불투명도 */
bg-primary/20                /* 20% 불투명도 */
bg-korea-red                 /* 같은 색상 */

/* Secondary - Wedgewood (청회색) */
--secondary: #53728A         /* CSS 변수 */
bg-[var(--secondary)]
text-[var(--secondary)]

/* 선택 강조 */
selection:bg-[#FF929A]       /* Primary와 동일 */
selection:text-white
```

### 텍스트 보조 색상
```css
--text-muted: #7691AD        /* ship-cove (밝은 청회색) */
--text-dim: #B9CFDD          /* spindle (아주 밝은 파란색) */
```

### 테두리 (Borders)
```css
border-white/5        /* 매우 연한 테두리 (기본) */
border-white/10       /* 조금 더 진한 테두리 */
border-white/20       /* 중간 테두리 */
border-primary/30     /* Primary 색상 테두리 */
```

### 그림자 (Shadows)
```css
/* Primary 그림자 효과 */
shadow-[0_0_10px_rgba(255,146,154,0.5)]  /* #FF929A 기반 빛 그림자 */

/* Glass 그림자 */
--glass-shadow: 0 0 0 1px rgba(255, 255, 255, 0.05), 
                0 24px 48px -12px rgba(0, 0, 0, 0.5);
```

---

## 🔲 레이아웃 시스템

### 컨테이너
```css
/* 메인 컨테이너 */
max-w-7xl             /* 최대 너비 */
mx-auto               /* 가운데 정렬 */

/* 페이지 기본 구조 */
min-h-screen          /* 최소 전체 화면 높이 */
pb-32                 /* 하단 네비게이션 공간 확보 */
```

### 헤더 (Header)
```css
fixed top-0 left-0 right-0  /* 상단 고정 */
z-50                         /* 최상위 레이어 */
p-4                          /* 패딩 */
bg-black/20                  /* 반투명 검은 배경 */
backdrop-blur-md             /* 블러 효과 */
border-b border-white/5      /* 하단 테두리 */
```

**구조:**
```
TEAM KOREA (왼쪽)
  - font-display font-black italic
  - text-xl tracking-tighter uppercase
  - "KOREA" 부분만 text-[var(--primary)]

상태 표시 점 2개 (오른쪽)
  - size-2 (8px x 8px)
  - rounded-full
  - 첫 번째: bg-[var(--primary)] + shadow-[0_0_10px_rgba(255,70,70,0.5)]
  - 두 번째: bg-[var(--secondary)]
```

### 푸터 (Footer)
```css
py-12                        /* 상하 패딩 */
bg-black/40                  /* 반투명 배경 */
backdrop-blur-lg             /* 강한 블러 */
border-t border-white/5      /* 상단 테두리 */
mt-20                        /* 상단 마진 */
```

**내용:**
```
© 2026 TEAM KOREA WINTER OLYMPICS
PERFORMANCE DATA SERVICE | MILANO DATA HUB
```

**스타일:**
- `text-gray-700` (어두운 회색)
- `font-bold uppercase`
- `tracking-[0.2em]` (넓은 자간)
- `text-[8px]` / `text-[7px]` (매우 작은 글씨)

### 카드 (Glass Cards)
```css
glass-card                   /* 커스텀 클래스 */
background: rgba(13, 39, 68, 0.4)  /* Tangaroa 40% */
backdrop-filter: blur(20px)  /* 강한 블러 */
border: 1px solid rgba(185, 207, 221, 0.1)  /* Spindle 10% 테두리 */
p-5                          /* 패딩 */
rounded-3xl                  /* 큰 둥근 모서리 */

/* 호버 효과 */
hover:bg-white/[0.08]        /* 호버 시 배경 밝아짐 */
transition-all duration-500  /* 부드러운 전환 */

/* 그룹 호버 배경 */
bg-gradient-to-br from-primary/5 to-transparent
opacity-0 group-hover:opacity-100
```

**Glass 그림자:**
```css
box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.05), 
            0 24px 48px -12px rgba(0, 0, 0, 0.5);
```

---

## 📝 타이포그래피

### 폰트 패밀리
```css
font-sans                 /* 본문: Pretendard Variable */
font-display              /* 헤더/강조: Outfit */
font-mono                 /* 코드: JetBrains Mono */

/* CSS 변수 */
--font-sans: 'Pretendard Variable', -apple-system, sans-serif
--font-display: 'Outfit', sans-serif
```

### 텍스트 스타일

#### 페이지 타이틀
```css
text-4xl md:text-5xl      /* 반응형 크기 */
font-display font-bold    /* 굵은 Display 폰트 */
tracking-tight            /* 좁은 자간 */
```

#### 섹션 헤더
```css
text-2xl                  /* 크기 */
font-display font-bold    /* 굵은 폰트 */
text-[var(--primary)]     /* Primary 색상 */
```

#### 선수 이름 (강조)
```css
text-lg                   /* 크기 */
font-black italic         /* 매우 굵고 이탤릭 */
text-white                /* 흰색 */
uppercase                 /* 대문자 */
tracking-tight            /* 좁은 자간 */
leading-tight             /* 좁은 행간 */
```

#### 영문 이름 (보조)
```css
text-[9px]                /* 매우 작은 크기 */
text-gray-500             /* 회색 */
font-bold uppercase       /* 굵고 대문자 */
tracking-wider            /* 넓은 자간 */
```

#### 배지 (Badge)
```css
px-3 py-1                 /* 패딩 */
rounded-full              /* 완전 둥근 모서리 */
bg-primary/20             /* Primary 20% 배경 */
text-primary              /* Primary 텍스트 */
text-[10px]               /* 작은 크기 */
font-black uppercase italic /* 매우 굵고 대문자 이탤릭 */
tracking-tight            /* 좁은 자간 */
border border-primary/30  /* Primary 테두리 */
```

#### 라벨 (Label)
```css
text-[8px]                /* 매우 작은 크기 */
text-gray-500             /* 회색 */
uppercase                 /* 대문자 */
tracking-wider            /* 넓은 자간 */
```

---

## 🎭 애니메이션

### Framer Motion 기본 설정
```jsx
// 페이드인 + 위에서 내려오기
initial={{ opacity: 0, y: -20 }}
animate={{ opacity: 1, y: 0 }}

// 페이드인 + 스케일
initial={{ opacity: 0, scale: 0.9 }}
animate={{ opacity: 1, scale: 1 }}
exit={{ opacity: 0, scale: 0.9 }}

// 딜레이 (리스트 항목)
transition={{ duration: 0.3, delay: idx * 0.02 }}

// 레이아웃 애니메이션
layout
```

### 호버 효과
```css
/* 스케일 확대 */
group-hover:scale-110 transition-transform

/* 색상 변경 */
group-hover:text-primary transition-colors

/* 배경 밝아지기 */
hover:bg-white/10 transition-all

/* 불투명도 */
opacity-0 group-hover:opacity-100 transition-opacity
```

---

## 🔘 버튼 스타일

### 필터 버튼 (선택됨)
```css
px-4 py-2
rounded-lg
font-sans text-sm
whitespace-nowrap
bg-[var(--primary)]      /* Primary 배경 */
text-white
transition-all
```

### 필터 버튼 (선택 안 됨)
```css
px-4 py-2
rounded-lg
font-sans text-sm
whitespace-nowrap
bg-white/5               /* 연한 배경 */
text-gray-400            /* 회색 텍스트 */
hover:bg-white/10        /* 호버 시 밝아짐 */
transition-all
```

---

## 📐 간격 시스템

### 패딩 (Padding)
```css
/* 페이지 상단 */
pt-24                    /* 헤더 공간 확보 */

/* 섹션 간격 */
mt-12                    /* 중간 간격 */
mt-20                    /* 큰 간격 */

/* 컨텐츠 패딩 */
px-4 lg:px-6             /* 반응형 좌우 패딩 */
px-6 lg:px-8             /* 더 넓은 좌우 패딩 */
```

### 그리드 간격
```css
gap-2                    /* 버튼 간격 */
gap-3                    /* 작은 요소 간격 */
gap-4                    /* 카드 간격 */
space-y-12               /* 섹션 세로 간격 */
```

---

## 📱 반응형 디자인

### 그리드 시스템 (선수 카드)
```css
/* 모바일: 2열 */
grid-cols-2

/* 태블릿: 3열 */
md:grid-cols-3

/* 데스크톱: 4열 */
lg:grid-cols-4

/* 큰 화면: 5열 */
xl:grid-cols-5
```

### 텍스트 크기
```css
text-4xl md:text-5xl     /* 타이틀 */
text-xl                  /* 헤더 */
text-2xl                 /* 섹션 헤더 */
```

### 패딩
```css
px-4 lg:px-6             /* 작은 여백 */
px-6 lg:px-8             /* 큰 여백 */
p-5                      /* 카드 내부 */
```

---

## 🎯 특수 효과

### Glass Morphism (유리 효과)
```css
backdrop-blur-md         /* 중간 블러 */
backdrop-blur-lg         /* 강한 블러 */
bg-black/20              /* 반투명 배경 */
border border-white/5    /* 연한 테두리 */
```

### 그라데이션 배경
```css
/* 호버 시 배경 그라데이션 */
bg-gradient-to-br from-primary/5 to-transparent
opacity-0 group-hover:opacity-100
```

### 구분선
```css
/* 세로 구분선 */
w-px h-6 bg-white/10

/* 가로 구분선 */
border-t border-white/5

/* Primary 구분선 */
w-1 h-3 bg-[var(--primary)] opacity-30
```

---

## ⚠️ 절대 금지 사항

### ❌ 변경 금지
1. **배경색**: `bg-[#050505]` / `bg-[#0a0a0b]` → 다른 색으로 변경 금지
2. **Primary 컬러**: `#FF929A` (Firebrick) → 다른 컬러로 변경 금지
3. **Secondary 컬러**: `#53728A` (Wedgewood) → 다른 컬러로 변경 금지
4. **폰트**: `Pretendard Variable`, `Outfit` → 다른 폰트로 변경 금지
5. **Glass 효과**: `backdrop-blur(20px)` → 제거 금지
6. **레이아웃**: 헤더/푸터 구조 → 변경 금지

### ❌ 추가 금지
1. 새로운 컬러 추가 (기존 팔레트만 사용)
2. 다른 UI 라이브러리 추가 (Material-UI, Ant Design 등)
3. 다른 애니메이션 라이브러리 추가 (Framer Motion만 사용)

### ✅ 허용
1. 기존 스타일 조합으로 새 컴포넌트 만들기
2. 기존 컬러 팔레트 내에서 불투명도 조정
3. 기존 간격 시스템 내에서 레이아웃 조정

---

## 🔍 스타일 참고 파일

### 실제 구현 예시
- `src/pages/V6_DashboardPage.tsx` - 헤더/푸터 구조
- `src/pages/V6_AthletesPage.tsx` - 카드 디자인
- `src/components/dashboard/V6_HeroSection.tsx` - Hero 섹션
- `src/components/layout/V6_BottomNav.tsx` - 네비게이션

---

## 📝 체크리스트 (새 컴포넌트 제작 시)

새로운 UI 요소를 만들 때 이 체크리스트를 확인하세요:

- [ ] 배경색이 `bg-[#050505]` 또는 `glass-card` 인가?
- [ ] 테두리가 `border-white/5` 또는 `--glass-border` 인가?
- [ ] Primary 색상이 `#FF929A` (Firebrick) 인가?
- [ ] 폰트가 `Pretendard Variable` (본문) 또는 `Outfit` (강조) 인가?
- [ ] 강조 텍스트가 `font-black italic uppercase` 인가?
- [ ] 카드가 `rounded-3xl` + `glass-card` 스타일인가?
- [ ] Glass 효과가 `backdrop-blur-md` 로 적용되었는가?
- [ ] 호버 효과가 `transition-all duration-500` 로 부드러운가?
- [ ] 애니메이션이 Framer Motion으로 구현되었는가?
- [ ] 반응형이 `md:`, `lg:`, `xl:` 로 설정되었는가?

---

**마지막 업데이트:** 2026-01-31  
**문서 버전:** 1.0  
**중요도:** ⭐⭐⭐⭐⭐ (최고)

**경고: 이 디자인 시스템을 변경하면 전체 프로젝트 일관성이 깨집니다!**
