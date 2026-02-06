import { useState, useEffect } from 'react';

export interface Athlete {
      id: string;
      name_ko: string;
      name_en: string;
      birth_date: string | null;
      birth_year: string;
      age: number | null;
      gender: string;
      nation: string;
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
      recent_results: any[];
}

export interface AthletesData {
      metadata: {
            last_updated: string;
            total_athletes: number;
            sports: number;
            teams: number;
      };
      statistics: {
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
      };
      athletes: Athlete[];
}

export function useJsonData() {
      const [athletes, setAthletes] = useState<Athlete[]>([]);
      const [metadata, setMetadata] = useState<AthletesData['metadata'] | null>(null);
      const [statistics, setStatistics] = useState<AthletesData['statistics'] | null>(null);
      const [loading, setLoading] = useState(true);
      const [error, setError] = useState<string | null>(null);

      useEffect(() => {
            const loadData = async () => {
                  try {
                        setLoading(true);
                        const response = await fetch('/data/athletes.json');

                        if (!response.ok) {
                              throw new Error(`데이터를 불러올 수 없습니다 (${response.status})`);
                        }

                        const data: AthletesData = await response.json();

                        setAthletes(data.athletes || []);
                        setMetadata(data.metadata);
                        setStatistics(data.statistics);
                        setError(null);
                  } catch (err) {
                        console.error('데이터 로드 오류:', err);
                        setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다');
                        setAthletes([]);
                  } finally {
                        setLoading(false);
                  }
            };

            loadData();
      }, []);

      return {
            athletes,
            metadata,
            statistics,
            loading,
            error
      };
}
