import * as XLSX from 'xlsx';

export interface AthleteInfo {
      name: string;
      nameEn: string;
      competitorId: string;
      discipline: string;
      subDiscipline: string;
      birthYear: string;
      gender: string;
      team: string;
      profileUrl: string;
      lastUpdated: string;
}

export interface CompetitionResult {
      date: string;
      location: string;
      nation: string;
      category: string;
      discipline: string;
      rank: string | number;
      fisPoints?: number;
      cupPoints?: number;
}

export interface AthleteData {
      info: AthleteInfo;
      results: CompetitionResult[];
}

/**
 * Load athlete data from Excel file
 */
export async function loadAthleteExcel(competitorId: string): Promise<AthleteData | null> {
      try {
            const response = await fetch(`/data/athletes/${competitorId}.xlsx`);
            if (!response.ok) return null;

            const arrayBuffer = await response.arrayBuffer();
            const workbook = XLSX.read(arrayBuffer, { type: 'array' });

            // Read athlete info
            const infoSheet = workbook.Sheets['선수정보'];
            if (!infoSheet) return null;

            const infoData = XLSX.utils.sheet_to_json(infoSheet, { header: 1 }) as string[][];

            // Helper function to find value by key (with trim)
            const getValue = (key: string): string => {
                  const row = infoData.find(r => r[0] && r[0].toString().trim() === key);
                  return row ? (row[1] || '') : '';
            };

            const debugKeys = infoData.map(r => r[0]).join(', ');

            const info: AthleteInfo = {
                  name: getValue('이름') || `DEBUG_KEYS: [${debugKeys}]`,
                  nameEn: getValue('영문명') || infoData[1]?.[1] || '',
                  competitorId: getValue('Competitor ID') || infoData[2]?.[1] || '',
                  discipline: getValue('종목') || infoData[3]?.[1] || '',
                  subDiscipline: getValue('세부종목') || infoData[4]?.[1] || '',
                  birthYear: getValue('생년') || infoData[5]?.[1] || '',
                  gender: getValue('성별') || infoData[6]?.[1] || '',
                  team: getValue('소속') || infoData[7]?.[1] || '',
                  profileUrl: getValue('FIS Profile') || getValue('프로필 URL') || infoData[8]?.[1] || '',
                  lastUpdated: getValue('Last Updated') || infoData[9]?.[1] || ''
            };

            // Read results
            const resultsSheet = workbook.Sheets['경기결과'];
            let results: CompetitionResult[] = [];

            if (resultsSheet) {
                  const resultsData = XLSX.utils.sheet_to_json(resultsSheet) as any[];

                  // Helper for results row to handle header variations
                  const getResultValue = (row: any, key: string): any => {
                        // Direct match
                        if (row[key] !== undefined) return row[key];
                        // Trimmed match
                        const foundKey = Object.keys(row).find(k => k.trim() === key);
                        return foundKey ? row[foundKey] : undefined;
                  };

                  results = resultsData.map(row => ({
                        date: getResultValue(row, '날짜') || '',
                        location: getResultValue(row, '장소') || '',
                        nation: getResultValue(row, '국가') || '',
                        category: getResultValue(row, '대회') || '',
                        discipline: getResultValue(row, '종목') || '',
                        rank: getResultValue(row, '순위') || '',
                        fisPoints: getResultValue(row, 'FIS Points') ? parseFloat(getResultValue(row, 'FIS Points')) : undefined,
                        cupPoints: getResultValue(row, 'Cup Points') ? parseFloat(getResultValue(row, 'Cup Points')) : undefined
                  })).filter(r => r.date); // Filter out empty rows

                  // Sort results by date descending (latest first)
                  results.sort((a, b) => {
                        const parseDate = (dateStr: string) => {
                              const parts = dateStr.split('-');
                              if (parts.length === 3) {
                                    return new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0])).getTime();
                              }
                              return 0;
                        };
                        return parseDate(b.date) - parseDate(a.date);
                  });
            }

            return { info, results };
      } catch (error) {
            console.error(`Error loading athlete ${competitorId}:`, error);
            return null;
      }
}

/**
 * Load all athletes master data
 */
export async function loadAthletesMaster(): Promise<AthleteInfo[]> {
      try {
            const response = await fetch('/data/athletes-master.xlsx');
            if (!response.ok) return [];

            const arrayBuffer = await response.arrayBuffer();
            const workbook = XLSX.read(arrayBuffer, { type: 'array' });

            const sheet = workbook.Sheets['선수명단'];
            if (!sheet) return [];

            const data = XLSX.utils.sheet_to_json(sheet) as any[];

            return data.map(row => ({
                  name: row['이름'] || '',
                  nameEn: row['영문명'] || '',
                  competitorId: row['Competitor ID'] || '',
                  discipline: row['종목'] || '',
                  subDiscipline: row['세부종목'] || '',
                  birthYear: row['생년'] || '',
                  gender: row['성별'] || '',
                  team: row['소속'] || '',
                  profileUrl: row['프로필 URL'] || '',
                  lastUpdated: ''
            }));
      } catch (error) {
            console.error('Error loading athletes master:', error);
            return [];
      }
}

/**
 * Load all athletes with their latest results
 */
export async function loadAllAthletesData(): Promise<AthleteData[]> {
      const master = await loadAthletesMaster();
      const athletesData: AthleteData[] = [];

      for (const info of master) {
            const data = await loadAthleteExcel(info.competitorId);
            if (data) {
                  athletesData.push(data);
            } else {
                  // If no Excel file exists, add athlete with empty results
                  athletesData.push({ info, results: [] });
            }
      }

      return athletesData;
}
