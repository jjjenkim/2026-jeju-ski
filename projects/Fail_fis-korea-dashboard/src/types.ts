export interface Athlete {
  종목: string;
  세부종목: string;
  연령대: string;
  선수명: string;
  생년: string;
  소속: string;
  FIS코드: string;
  Sector코드: string;
  시즌: string;
  FIS프로필URL: string;
  성별?: string;

  // Generated sample data fields
  평균포인트?: number;
  최근랭킹?: number;
  대회카테고리?: 'WC' | 'WCH' | 'OG' | 'FIS' | 'EC';
  최근10경기?: PerformanceData[];
}

export interface PerformanceData {
  date: string;
  event: string;
  점수: number;
  랭킹: number | string;
  location?: string;
  category?: string;
}

export interface FilterState {
  종목: string[];
  세부종목: string[];
  연령대: string[];
  시즌: string[];
  검색어: string;
}

export interface ChartData {
  categories: string[];
  series: any[];
}

// Force reload for Vite HMR
