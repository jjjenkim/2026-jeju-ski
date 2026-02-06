import type { Athlete, PerformanceData } from '../types';

const eventNames = [
  'World Cup Sölden', 'World Cup Levi', 'World Cup Aspen',
  'World Championships', 'Olympic Games', 'FIS Race',
  'European Cup', 'Continental Cup', 'National Championships'
];

const categories: Array<'WC' | 'WCH' | 'OG' | 'FIS' | 'EC'> = ['WC', 'WCH', 'OG', 'FIS', 'EC'];

/**
 * Generate sample performance data for athletes
 * NOTE: Replace this with actual FIS API data or web scraping
 * URLs are available in CSV: FIS프로필URL field
 */
export function generateSamplePerformance(athlete: Athlete): Athlete {
  // Generate based on FIS code to ensure consistency
  const seed = parseInt(athlete.FIS코드) || 100000;

  // Generate average points (lower is better, typically 0-200 for competitive athletes)
  const 평균포인트 = Math.max(10, Math.min(150, (seed % 100) + Math.random() * 50));

  // Generate ranking (1-100)
  const 최근랭킹 = Math.max(1, Math.floor(평균포인트 / 2));

  // Random competition category
  const 대회카테고리 = categories[seed % categories.length];

  // Generate 10 recent performances
  const 최근10경기: PerformanceData[] = [];
  for (let i = 9; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - (i * 7)); // Weekly competitions

    최근10경기.push({
      date: date.toISOString().split('T')[0],
      event: eventNames[(seed + i) % eventNames.length],
      점수: Math.max(5, 평균포인트 + (Math.random() - 0.5) * 40),
      랭킹: Math.max(1, 최근랭킹 + Math.floor((Math.random() - 0.5) * 20))
    });
  }

  return {
    ...athlete,
    평균포인트,
    최근랭킹,
    대회카테고리,
    최근10경기
  };
}

/**
 * TODO: Replace with actual FIS data fetching
 * Example implementation:
 *
 * async function fetchFISData(fisCode: string, sectorCode: string) {
 *   const url = `https://www.fis-ski.com/DB/general/athlete-biography.html?sectorcode=${sectorCode}&competitorid=${fisCode}&type=result`;
 *   // Scrape or use FIS API if available
 *   // Parse competition results, points, rankings
 *   return parsedData;
 * }
 */
