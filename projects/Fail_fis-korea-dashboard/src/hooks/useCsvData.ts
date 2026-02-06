import { useState, useEffect } from 'react';
import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import type { Athlete, PerformanceData } from '../types';

interface AthleteResult {
  athlete: string;
  fis_code: string;
  date: string;
  location: string;
  nation: string;
  category: string;
  discipline: string;
  rank: string;
  fis_points: string;
  cup_points: string;
}

export function useCsvData(defaultCsvPath?: string) {
  const [athletes, setAthletes] = useState<Athlete[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadCsvData = async (file: File | string) => {
    setLoading(true);
    setError(null);

    try {
      // Load athlete master data from Excel
      const athleteMasterData = await loadAthleteMaster();

      // Load competition results from CSV
      let csvText: string;
      if (typeof file === 'string') {
        const response = await fetch(file);
        csvText = await response.text();
      } else {
        csvText = await file.text();
      }

      Papa.parse(csvText, {
        complete: (results) => parseCsvWithMaster(results.data as any, athleteMasterData),
        header: true,
        skipEmptyLines: true,
        error: (err: any) => setError(err.message)
      });
    } catch (err: any) {
      console.error('Data loading error:', err);
      setError(`⚠️ 데이터 로드 오류: ${err.message}`);
      setLoading(false);
    }
  };

  const loadAthleteMaster = async (): Promise<Map<string, any>> => {
    try {
      const response = await fetch('/data/athletes-master.xlsx');
      const arrayBuffer = await response.arrayBuffer();
      const workbook = XLSX.read(arrayBuffer, { type: 'array' });
      const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
      const data = XLSX.utils.sheet_to_json(firstSheet);

      const masterMap = new Map<string, any>();
      data.forEach((row: any) => {
        const name = row['선수명'] || row['athlete'];
        if (name) {
          masterMap.set(name, row);
        }
      });

      console.log(`✅ Loaded ${masterMap.size} athletes from master data`);
      return masterMap;
    } catch (err) {
      console.warn('Could not load athlete master data, using defaults:', err);
      return new Map();
    }
  };

  const parseCsvWithMaster = (data: any, masterData: Map<string, any>) => {
    try {
      if (!Array.isArray(data)) {
        throw new Error('Invalid CSV data format');
      }

      // Remove BOM and clean data
      const cleanData: AthleteResult[] = data.map((row: any) => {
        const cleanRow: any = {};
        Object.keys(row).forEach(key => {
          const cleanKey = key.replace(/^\uFEFF/, '').trim();
          cleanRow[cleanKey] = row[key];
        });
        return cleanRow;
      }).filter((row: any) => row.athlete); // Filter out empty rows

      // Group results by athlete
      const athleteMap = new Map<string, any>();

      cleanData.forEach((row: AthleteResult) => {
        const athleteName = row.athlete;
        const fisCode = row.fis_code;

        if (!athleteMap.has(athleteName)) {
          // Get master data for this athlete
          const master = masterData.get(athleteName) || {};

          // Determine sport category from discipline
          let 종목 = master['종목'] || 'Cross-Country';
          const discipline = row.discipline || '';

          if (discipline.includes('Slalom') || discipline.includes('Giant') || discipline.includes('Downhill') || discipline.includes('Super-G')) {
            종목 = 'Alpine Skiing';
          } else if (discipline.includes('Halfpipe') || discipline.includes('Slopestyle') || discipline.includes('Big Air')) {
            종목 = 'Freestyle';
          } else if (discipline.includes('Cross') && discipline.includes('Snowboard')) {
            종목 = 'Snowboard';
          } else if (discipline.includes('km') || discipline.includes('Sprint')) {
            종목 = 'Cross-Country';
          } else if (discipline.includes('Hill') || discipline.includes('Jump')) {
            종목 = 'Ski Jumping';
          } else if (discipline.includes('Combined')) {
            종목 = 'Nordic Combined';
          }

          // Calculate age group from birth year
          const birthYear = master['생년'] || '';
          let 연령대 = '20대';
          if (birthYear) {
            const year = parseInt(birthYear);
            const age = 2026 - year;
            if (age < 20) 연령대 = '10대';
            else if (age < 30) 연령대 = '20대';
            else if (age < 40) 연령대 = '30대';
            else 연령대 = '40대+';
          }

          athleteMap.set(athleteName, {
            선수명: athleteName,
            FIS코드: fisCode || master['FIS코드'] || '',
            종목,
            세부종목: master['세부종목'] || discipline || '',
            연령대,
            생년: birthYear,
            소속: master['소속'] || row.nation || 'KOR',
            Sector코드: master['Sector코드'] || '',
            시즌: '2025-2026',
            FIS프로필URL: master['FIS프로필URL'] || '',
            성별: master['성별'] || '',
            최근10경기: []
          });
        }

        // Add performance data
        const athlete = athleteMap.get(athleteName);
        if (athlete.최근10경기.length < 150) {
          const rank = row.rank;
          const rankNum = rank === 'DNF' || rank === 'DNQ' || rank === 'DNS' || rank === 'DSQ'
            ? rank
            : parseInt(rank) || rank;

          athlete.최근10경기.push({
            date: row.date || '',
            event: row.category || 'Competition',
            location: row.location || '',
            category: row.category || '',
            랭킹: rankNum,
            점수: parseFloat(row.fis_points || '0') || 0
          });
        }
      });

      // Convert to array and calculate stats
      const athletesArray: Athlete[] = Array.from(athleteMap.values()).map(athlete => {
        // Sort by date (newest first)
        athlete.최근10경기.sort((a: PerformanceData, b: PerformanceData) => {
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        });

        // Calculate average ranking (only numeric ranks)
        const validRankings = athlete.최근10경기
          .map((p: PerformanceData) => {
            const rank = typeof p.랭킹 === 'number' ? p.랭킹 : parseInt(String(p.랭킹));
            return isNaN(rank) ? null : rank;
          })
          .filter((r: number | null) => r !== null && r > 0);

        const 최근랭킹 = validRankings.length > 0
          ? Math.round(validRankings.reduce((a: number, b: number) => a + b, 0) / validRankings.length)
          : 999;

        // Calculate average points
        const validPoints = athlete.최근10경기
          .map((p: PerformanceData) => p.점수)
          .filter((p: number) => p > 0);

        const 평균포인트 = validPoints.length > 0
          ? Math.round(validPoints.reduce((a: number, b: number) => a + b, 0) / validPoints.length * 100) / 100
          : 0;

        // Determine competition category from most recent events
        let 대회카테고리: 'WC' | 'WCH' | 'OG' | 'FIS' | 'EC' = 'FIS';
        const recentCategories = athlete.최근10경기.slice(0, 10).map((p: PerformanceData) => p.category?.toLowerCase() || '');
        if (recentCategories.some((c: string) => c.includes('world cup') || c.includes('wc'))) {
          대회카테고리 = 'WC';
        } else if (recentCategories.some((c: string) => c.includes('world championships'))) {
          대회카테고리 = 'WCH';
        } else if (recentCategories.some((c: string) => c.includes('olympic'))) {
          대회카테고리 = 'OG';
        } else if (recentCategories.some((c: string) => c.includes('european cup') || c.includes('asian cup'))) {
          대회카테고리 = 'EC';
        }

        return {
          ...athlete,
          최근랭킹,
          평균포인트,
          대회카테고리
        };
      });

      console.log(`✅ Loaded ${athletesArray.length} athletes with ${cleanData.length} total results`);
      setAthletes(athletesArray);
      setLoading(false);
    } catch (err: any) {
      console.error('CSV parsing error:', err);
      setError(`⚠️ 데이터 로드 오류: ${err.message}`);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (defaultCsvPath) {
      loadCsvData(defaultCsvPath);
    } else {
      setLoading(false);
    }
  }, [defaultCsvPath]);

  return { athletes, loading, error, loadCsvData };
}
