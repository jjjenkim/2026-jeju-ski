export interface Athlete {
      id?: string;
      name_ko: string;
      name_en?: string;
      birth_date?: string;
      birth_year?: number;
      age?: number;
      gender?: 'M' | 'F';
      sport: string;
      sport_display?: string;
      discipline?: string;
      detail_discipline?: string;
      detail_discipline_code?: string;
      team: string;
      status?: string;
      fis_code: string;
      fis_points?: number;
      fis_url?: string;
      photo_url?: string;
      current_rank?: number | null;
      best_rank?: number | null;
      season_starts?: number;
      medals?: {
            gold: number;
            silver: number;
            bronze: number;
      };
      recent_results?: {
            date: string;
            category: string;
            place?: string;
            discipline?: string;
            discipline_code?: string;
            rank: number;
            fis_points: number; // Updated from points
            result_code?: string | null;
      }[];
}

export interface AthletesData {
      athletes: Athlete[];
}
