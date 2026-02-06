import fetch from 'node-fetch';
import * as cheerio from 'cheerio';
import * as XLSX from 'xlsx';
import { promises as fs } from 'fs';
import path from 'path';

interface AthleteMaster {
      name: string;
      nameEn: string;
      competitorId: string;
      sectorCode: string;
      discipline: string;
      subDiscipline: string;
      birthYear: string;
      gender: 'M' | 'F';
      team: string;
      profileUrl: string;
}

interface CompetitionResult {
      date: string;
      location: string;
      nation: string;
      category: string;
      discipline: string;
      rank: string | number;
      fisPoints?: number;
      cupPoints?: number;
}

/**
 * Load athletes from JSON file
 */
async function loadAthletesMaster(): Promise<AthleteMaster[]> {
      const jsonPath = path.join(process.cwd(), 'scripts', 'athletes-master.json');
      const jsonData = await fs.readFile(jsonPath, 'utf-8');
      return JSON.parse(jsonData);
}

/**
 * Parse rank from text (handles numbers, DNS, DNF, etc.)
 */
function parseRank(rankText: string): string | number {
      const trimmed = rankText.trim();
      const numMatch = trimmed.match(/^\d+/);
      return numMatch ? parseInt(numMatch[0]) : trimmed;
}

/**
 * Parse points from text
 */
function parsePoints(pointsText: string): number | undefined {
      const trimmed = pointsText.trim();
      if (!trimmed || trimmed === '-') return undefined;
      const num = parseFloat(trimmed);
      return isNaN(num) ? undefined : num;
}

/**
 * Scrape FIS profile with improved parsing
 */
async function scrapeFisProfile(athlete: AthleteMaster): Promise<CompetitionResult[]> {
      console.log(`\n${'='.repeat(70)}`);
      console.log(`🔍 수집 중: ${athlete.name} (${athlete.nameEn})`);
      console.log(`   ID: ${athlete.competitorId}`);
      console.log(`   URL: ${athlete.profileUrl}`);
      console.log('='.repeat(70));

      try {
            const response = await fetch(athlete.profileUrl, {
                  headers: {
                        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
                  }
            });

            if (!response.ok) {
                  console.error(`❌ HTTP ${response.status}`);
                  return [];
            }

            const html = await response.text();
            const $ = cheerio.load(html);

            const results: CompetitionResult[] = [];

            // Find all result rows
            $('#results-body a.table-row').each((index, element) => {
                  if (index >= 50) return false; // Limit to 50 results

                  try {
                        const $row = $(element);
                        const $container = $row.find('.container').first();

                        // Get all direct child divs
                        const $cells = $container.children('div');

                        if ($cells.length < 4) return; // Skip invalid rows

                        // Extract data from cells
                        let cellIndex = 0;

                        // Cell 0: Date
                        const date = $cells.eq(cellIndex++).text().trim();

                        // Find location (hidden-sm-down class)
                        let location = '';
                        let category = '';
                        let discipline = '';

                        $cells.each((i, cell) => {
                              const $cell = $(cell);
                              if ($cell.hasClass('hidden-sm-down')) {
                                    const text = $cell.text().trim();
                                    if (!location) {
                                          location = text;
                                    } else if (!category) {
                                          category = text;
                                    } else if (!discipline) {
                                          discipline = text;
                                    }
                              }
                        });

                        // Find nation (look for country__name-short)
                        let nation = '';
                        $cells.each((i, cell) => {
                              const $cell = $(cell);
                              const $countryShort = $cell.find('.country__name-short');
                              if ($countryShort.length > 0) {
                                    nation = $countryShort.text().trim();
                              }
                        });

                        // Find rank and points (in the last g-xs-6 cell)
                        let rank: string | number = '';
                        let fisPoints: number | undefined;
                        let cupPoints: number | undefined;

                        const $rankCell = $cells.filter('.g-xs-6').last();
                        if ($rankCell.length > 0) {
                              const $rankDivs = $rankCell.children('div');

                              if ($rankDivs.length > 0) {
                                    rank = parseRank($rankDivs.eq(0).text());
                              }
                              if ($rankDivs.length > 1) {
                                    fisPoints = parsePoints($rankDivs.eq(1).text());
                              }
                              if ($rankDivs.length > 2) {
                                    cupPoints = parsePoints($rankDivs.eq(2).text());
                              }
                        }

                        // Only add if we have essential data
                        if (date && location && rank) {
                              const result: CompetitionResult = {
                                    date,
                                    location,
                                    nation: nation || '',
                                    category: category || 'Unknown',
                                    discipline: discipline || athlete.subDiscipline,
                                    rank,
                                    fisPoints,
                                    cupPoints
                              };

                              results.push(result);

                              // Log first 5 results for verification
                              if (index < 5) {
                                    console.log(`\n   경기 #${index + 1}:`);
                                    console.log(`   📅 ${result.date} | 📍 ${result.location} | 🌍 ${result.nation}`);
                                    console.log(`   🏆 순위: ${result.rank} | 🎯 ${result.category} | 🎿 ${result.discipline}`);
                                    if (result.fisPoints) console.log(`   📊 FIS Points: ${result.fisPoints}`);
                                    if (result.cupPoints) console.log(`   🏅 Cup Points: ${result.cupPoints}`);
                              }
                        }
                  } catch (err) {
                        console.error(`   ⚠️  Row ${index} parsing error:`, err instanceof Error ? err.message : err);
                  }
            });

            console.log(`\n✅ 총 ${results.length}개 경기 결과 수집 완료`);
            return results;

      } catch (error) {
            console.error(`❌ 오류 발생:`, error instanceof Error ? error.message : error);
            return [];
      }
}

/**
 * Save results to Excel file
 */
async function saveToExcel(athlete: AthleteMaster, results: CompetitionResult[]) {
      const dataDir = path.join(process.cwd(), 'public', 'data', 'athletes');
      await fs.mkdir(dataDir, { recursive: true });

      const filePath = path.join(dataDir, `${athlete.competitorId}.xlsx`);

      const wb = XLSX.utils.book_new();

      // Add athlete info sheet
      const infoData = [
            ['이름', athlete.name],
            ['영문명', athlete.nameEn],
            ['Competitor ID', athlete.competitorId],
            ['종목', athlete.discipline],
            ['세부종목', athlete.subDiscipline],
            ['생년', athlete.birthYear],
            ['성별', athlete.gender],
            ['소속', athlete.team],
            ['프로필 URL', athlete.profileUrl],
            ['최종 업데이트', new Date().toISOString()]
      ];
      const infoSheet = XLSX.utils.aoa_to_sheet(infoData);
      XLSX.utils.book_append_sheet(wb, infoSheet, '선수정보');

      // Add results sheet
      if (results.length > 0) {
            const resultsSheet = XLSX.utils.json_to_sheet(results, {
                  header: ['date', 'location', 'nation', 'category', 'discipline', 'rank', 'fisPoints', 'cupPoints']
            });

            XLSX.utils.sheet_add_aoa(resultsSheet, [
                  ['날짜', '장소', '국가', '대회', '종목', '순위', 'FIS Points', 'Cup Points']
            ], { origin: 'A1' });

            XLSX.utils.book_append_sheet(wb, resultsSheet, '경기결과');
      }

      XLSX.writeFile(wb, filePath);
      console.log(`💾 저장 완료: ${filePath}\n`);
}

/**
 * Create master Excel file
 */
async function createMasterExcel(athletesMaster: AthleteMaster[]) {
      const dataDir = path.join(process.cwd(), 'public', 'data');
      await fs.mkdir(dataDir, { recursive: true });

      const filePath = path.join(dataDir, 'athletes-master.xlsx');

      const wb = XLSX.utils.book_new();

      const athletesData = athletesMaster.map((a: AthleteMaster) => ({
            '이름': a.name,
            '영문명': a.nameEn,
            'Competitor ID': a.competitorId,
            'Sector': a.sectorCode,
            '종목': a.discipline,
            '세부종목': a.subDiscipline,
            '생년': a.birthYear,
            '성별': a.gender,
            '소속': a.team,
            '프로필 URL': a.profileUrl
      }));

      const ws = XLSX.utils.json_to_sheet(athletesData);
      XLSX.utils.book_append_sheet(wb, ws, '선수명단');

      XLSX.writeFile(wb, filePath);
      console.log(`✅ Master file created: ${filePath}\n`);
}

/**
 * Main execution
 */
async function main() {
      console.log('\n🤖 FIS 데이터 완전 자동 수집 시스템 v2.0\n');
      console.log('='.repeat(70));
      console.log('AI가 자동으로 데이터를 수집하고 Excel에 저장합니다.');
      console.log('='.repeat(70));

      const athletesMaster = await loadAthletesMaster();
      await createMasterExcel(athletesMaster);

      const args = process.argv.slice(2);
      const command = args[0];

      if (command === 'all') {
            console.log(`\n📊 총 ${athletesMaster.length}명의 선수 데이터를 자동 수집합니다.\n`);

            let successCount = 0;
            let failCount = 0;

            const batchSize = 5;
            const delayBetweenRequests = 3000; // 3 seconds

            for (let i = 0; i < athletesMaster.length; i += batchSize) {
                  const batch = athletesMaster.slice(i, i + batchSize);
                  console.log(`\n📦 Batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(athletesMaster.length / batchSize)}`);

                  for (const athlete of batch) {
                        const results = await scrapeFisProfile(athlete);

                        if (results.length > 0) {
                              await saveToExcel(athlete, results);
                              successCount++;
                        } else {
                              console.log(`⚠️  ${athlete.name}: 데이터 없음`);
                              failCount++;
                        }

                        await new Promise(resolve => setTimeout(resolve, delayBetweenRequests));
                  }
            }

            console.log('\n' + '='.repeat(70));
            console.log('🎉 자동 수집 완료!');
            console.log(`\n✅ 성공: ${successCount}/${athletesMaster.length}`);
            console.log(`❌ 실패: ${failCount}/${athletesMaster.length}`);
            console.log('='.repeat(70));

      } else if (command) {
            const athlete = athletesMaster.find((a: AthleteMaster) => a.competitorId === command);

            if (!athlete) {
                  console.error(`\n❌ Athlete with Competitor ID ${command} not found`);
                  return;
            }

            const results = await scrapeFisProfile(athlete);

            if (results.length > 0) {
                  await saveToExcel(athlete, results);
                  console.log('\n✅ 수집 완료!');
            } else {
                  console.log('\n⚠️  데이터를 찾을 수 없습니다.');
            }

            console.log('='.repeat(70));
      } else {
            console.log('\n사용법:');
            console.log('  npm run auto-collect all              - 모든 선수 자동 수집');
            console.log('  npm run auto-collect <competitor_id>  - 특정 선수 자동 수집');
            console.log('\n예시:');
            console.log('  npm run auto-collect 163744           - 이상호 자동 수집');
            console.log('\n');
      }
}

main();
