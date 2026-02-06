# 40_DEV_TEAM.md
**Team Korea Winter Dashboard 2025-26 (V3)**
**Engineering & Implementation Guidelines**

---

## 1. Technical Stack (Locked)

We are building a **Single Page Application (SPA)** with a focus on performance and visual fidelity.

-   **Runtime**: Node.js 18+ (LTS)
-   **Framework**: React 18.2+
-   **Language**: TypeScript 5.0+ (Strict Mode enabled)
-   **Build Tool**: Vite 4+
-   **State Management**: Zustand (Lightweight, distinct from Context API)
-   **Styling**: Tailwind CSS 3.0+
-   **Animation**: Framer Motion 10+
-   **Routing**: React Router DOM 6+

---

## 2. Directory Structure (src)

```text
src/
├── components/
│   ├── ui/                 # Primitive atoms (Button, Card, Badge)
│   ├── layout/             # Shell, Grid, Header
│   ├── features/           # Complex blocks (ResultsTable, AthleteCard)
│   └── visual/             # Purely decorative (Backgrounds, 3D Canvas)
├── hooks/                  # Custom logic (useWindowSize, useScroll)
├── lib/                    # Utilities (Date formatting, String helpers)
├── stores/                 # Global state (Zustand)
├── types/                  # TypeScript interfaces (Shared)
└── App.tsx                 # Root
```

---

## 3. Core Development Principles

### A. Component Composition
Do not build monolithic components. Break them down.
-   **Bad**: `<Dashboard />` (500 lines)
-   **Good**: `<DashboardLayout><StatsGrid /><RankingList /><RecentMatches /></DashboardLayout>`

### B. The "Premium" CSS Pattern
Tailwind classes should be abstracted for complex repeated elements to keep JSX clean, OR use `class-variance-authority (cva)` for managing variants.

```typescript
// Example of a reusable "Premium Card" base
const cardBase = "relative overflow-hidden bg-void-navy border border-white/5 backdrop-blur-sm rounded-xl transition-all duration-300";
```

### C. Type Safety
We do not use `any`. Ever.
Define interfaces in `src/types/domain.ts` matching the Data Schema.

```typescript
export interface Athlete {
  id: string;
  name: { ko: string; en: string };
  discipline: DisciplineCode;
  stats: AthleteStats;
}
```

---

## 4. Implementation Logic

### State Management
Use **Zustand** for:
-   Global UI state (Sidebar open, Theme toggle - though we are Dark Mode only).
-   Cached Data (Loaded athletes array).

Use **React Query (TanStack Query)** (Optional but recommended) for:
-   Fetching `athletes.json` and managing loading/error states.

### Performance
-   **Lazy Loading**: Defer loading of heavy charts until they are in viewport.
-   **Memoization**: Use `useMemo` for expensive data filtering (e.g., sorting 1000 results).

---

## 5. Step-by-Step Build Plan

1.  **Initialize**: `npm create vite@latest . -- --template react-ts`
2.  **Configure**: Setup Tailwind with V3 Design Tokens (Colors/Fonts).
3.  **Core UI**: Build the `Card`, `Typography`, and `Container` primitives.
4.  **Layout**: Create the Main Layout shell.
5.  **Data Integration**: Write the `DataLoader` service to fetch/parse the JSON.
6.  **Feature**: Implement the Dashboard Grid.
7.  **Feature**: Implement the Athlete Detail View.

---

**Lead Engineer**: Tech Team
**Branch Strategy**: `main` (Production), `dev` (Staging), `feature/*` (WIP)
