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
    forties?: number;
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

export interface ChartData {
  labels: string[];
  datasets: {
    label?: string;
    data: number[];
    backgroundColor?: string | string[];
    borderColor?: string | string[];
    borderWidth?: number;
    [key: string]: any;
  }[];
}
