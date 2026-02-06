import type { AthleteData } from './excelLoader';
import type { Athlete, PerformanceData } from '../types';

/**
 * Convert Excel athlete data to dashboard Athlete format
 */
export function convertExcelToAthlete(excelData: AthleteData): Athlete {
      const { info, results } = excelData;

      // Convert competition results to performance data
      const 최근10경기: PerformanceData[] = results.slice(0, 10).map(result => {
            const numericRank = parseInt(String(result.rank));
            return {
                  date: result.date,
                  event: `${result.location} - ${result.category}`,
                  location: result.location,
                  category: result.category,
                  점수: result.cupPoints || result.fisPoints || 0,
                  랭킹: !isNaN(numericRank) ? numericRank : result.rank
            };
      });

      // Calculate average points from recent competitions
      const validPoints = 최근10경기.filter(p => p.점수 > 0).map(p => p.점수);
      const 평균포인트 = validPoints.length > 0
            ? validPoints.reduce((a, b) => a + b, 0) / validPoints.length
            : undefined;

      // Get best recent ranking
      // Get best recent ranking
      const validRankings = 최근10경기
            .map(p => p.랭킹)
            .filter((r): r is number => typeof r === 'number');

      const 최근랭킹 = validRankings.length > 0
            ? Math.min(...validRankings)
            : undefined;

      // Determine competition category from results
      let 대회카테고리: 'WC' | 'WCH' | 'OG' | 'FIS' | 'EC' | undefined;
      if (results.length > 0) {
            const firstCategory = results[0].category.toUpperCase();
            if (firstCategory.includes('WORLD CUP')) 대회카테고리 = 'WC';
            else if (firstCategory.includes('WORLD CHAMPIONSHIP')) 대회카테고리 = 'WCH';
            else if (firstCategory.includes('OLYMPIC')) 대회카테고리 = 'OG';
            else if (firstCategory.includes('EUROPA')) 대회카테고리 = 'EC';
            else 대회카테고리 = 'FIS';
      }

      return {
            종목: info.discipline,
            세부종목: info.subDiscipline,
            연령대: calculateAgeGroup(info.birthYear),
            선수명: info.name,
            생년: info.birthYear,
            소속: info.team,
            FIS코드: info.competitorId,
            Sector코드: '',
            시즌: getCurrentSeason(),
            FIS프로필URL: info.profileUrl,
            성별: info.gender,
            평균포인트,
            최근랭킹,
            대회카테고리,
            최근10경기
      };
}

/**
 * Convert all Excel data to Athlete array
 */
export function convertAllExcelToAthletes(excelDataArray: AthleteData[]): Athlete[] {
      return excelDataArray.map(convertExcelToAthlete);
}

/**
 * Calculate age group from birth year
 */
function calculateAgeGroup(birthYear: string): string {
      const year = parseInt(birthYear);
      const currentYear = new Date().getFullYear();
      const age = currentYear - year;

      if (age < 20) return '10대';
      if (age < 30) return '20대';
      if (age < 40) return '30대';
      return '40대';
}

/**
 * Get current season string
 */
function getCurrentSeason(): string {
      const now = new Date();
      const year = now.getFullYear();
      const month = now.getMonth() + 1;

      // Season runs from July to June
      if (month >= 7) {
            return `${year}-${year + 1}`;
      } else {
            return `${year - 1}-${year}`;
      }
}
