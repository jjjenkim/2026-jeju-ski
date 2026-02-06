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
 * Scrape FIS profile for a single athlete
 */
async function scrapeFisProfile(athlete: AthleteMaster): Promise<CompetitionResult[]> {
      console.log(`Fetching: ${athlete.name} (${athlete.competitorId})...`);

      try {
            const response = await fetch(athlete.profileUrl, {
                  headers: {
                        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
                  }
            });

            if (!response.ok) {
                  console.error(`  ✗ HTTP ${response.status} for ${athlete.name}`);
                  return [];
            }

            const html = await response.text();
            const $ = cheerio.load(html);

            const results: CompetitionResult[] = [];

            // Find all table rows
            $('#results-body a.table-row').each((i, row) => {
                  if (i >= 150) return false; // Limit to 150 most recent results (Approx 3-4 seasons)

                  const $row = $(row);
                  const container = $row.find('.container');
                  const cells = container.children('div');

                  if (cells.length >= 4) {
                        const dateText = cells.eq(0).text().trim();

                        // Use responsive classes to find columns
                        const desktopCells = cells.filter('.hidden-sm-down');

                        const locationText = desktopCells.eq(0).text().trim();
                        const eventText = desktopCells.eq(1).text().trim() || 'Unknown';
                        const disciplineText = desktopCells.eq(2).text().trim() || athlete.subDiscipline;

                        // Find nation (usually has country flag)
                        const nationCell = cells.filter('.g-xs-4, .g-sm-3, .g-md-2, .g-lg-2').first();
                        const nationText = nationCell.find('.country__name-short').text().trim() || '';

                        // Rank and points are in the last cell
                        const rankPointsCell = cells.filter('.g-xs-6').last();
                        const rankText = rankPointsCell.find('> div').first().text().trim();
                        const fisPointsText = rankPointsCell.find('> div').eq(1).text().trim();
                        const cupPointsText = rankPointsCell.find('> div').eq(2).text().trim();

                        if (dateText && locationText && rankText) {
                              // Parse rank
                              const numericMatch = rankText.match(/^\d+/);
                              const parsedRank = numericMatch ? parseInt(numericMatch[0]) : rankText;

                              results.push({
                                    date: dateText,
                                    location: locationText,
                                    nation: nationText,
                                    category: eventText,
                                    discipline: disciplineText,
                                    rank: parsedRank,
                                    fisPoints: fisPointsText && !isNaN(parseFloat(fisPointsText)) ? parseFloat(fisPointsText) : undefined,
                                    cupPoints: cupPointsText && !isNaN(parseFloat(cupPointsText)) ? parseFloat(cupPointsText) : undefined
                              });
                        }
                  }
            });

            console.log(`  ✓ Found ${results.length} results for ${athlete.name}`);
            if (results.length > 0) {
                  console.log(`  👉 Latest: ${results[0].date} ${results[0].location} - Rank ${results[0].rank}`);
            }
            return results;

      } catch (error) {
            console.error(`  ✗ Error fetching ${athlete.name}:`, error instanceof Error ? error.message : error);
            return [];
      }
}

/**
 * Save results to Excel file
 */
async function saveToExcel(athlete: AthleteMaster, results: CompetitionResult[]) {
      const dataDir = path.join(process.cwd(), 'public', 'data', 'athletes');

      // Create directory if it doesn't exist
      await fs.mkdir(dataDir, { recursive: true });

      const filePath = path.join(dataDir, `${athlete.competitorId}.xlsx`);

      // Create workbook
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

            // Set column headers in Korean
            XLSX.utils.sheet_add_aoa(resultsSheet, [
                  ['날짜', '장소', '국가', '대회', '종목', '순위', 'FIS Points', 'Cup Points']
            ], { origin: 'A1' });

            XLSX.utils.book_append_sheet(wb, resultsSheet, '경기결과');
      }

      // Write file
      XLSX.writeFile(wb, filePath);
      console.log(`  📊 Saved to: ${filePath}`);
}

/**
 * Create master Excel file with all athletes
 */
async function createMasterExcel(athletesMaster: AthleteMaster[]) {
      const dataDir = path.join(process.cwd(), 'public', 'data');
      await fs.mkdir(dataDir, { recursive: true });

      const filePath = path.join(dataDir, 'athletes-master.xlsx');

      const wb = XLSX.utils.book_new();

      // Prepare data
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
      console.log(`\n✅ Master file created: ${filePath}\n`);
}

/**
 * Main execution
 */
async function main() {
      console.log('\n🔍 FIS Data to Excel Converter\n');
      console.log('='.repeat(50));

      // Load athletes from JSON
      const athletesMaster = await loadAthletesMaster();

      // Create master file first
      await createMasterExcel(athletesMaster);

      const args = process.argv.slice(2);
      const command = args[0];

      if (command === 'all') {
            console.log(`\nProcessing ${athletesMaster.length} athletes...\n`);

            let successCount = 0;
            let failCount = 0;

            // Process in batches
            const batchSize = 5;
            const delayBetweenRequests = 2000; // 2 seconds

            for (let i = 0; i < athletesMaster.length; i += batchSize) {
                  const batch = athletesMaster.slice(i, i + batchSize);
                  console.log(`\nBatch ${Math.floor(i / batchSize) + 1}/${Math.ceil(athletesMaster.length / batchSize)}:`);

                  for (const athlete of batch) {
                        const results = await scrapeFisProfile(athlete);

                        if (results.length > 0) {
                              await saveToExcel(athlete, results);
                              successCount++;
                        } else {
                              failCount++;
                        }

                        // Delay between requests
                        await new Promise(resolve => setTimeout(resolve, delayBetweenRequests));
                  }
            }

            console.log('\n' + '='.repeat(50));
            console.log('\n✅ Conversion Complete!');
            console.log(`\nSuccess: ${successCount}/${athletesMaster.length}`);
            console.log(`Failed: ${failCount}/${athletesMaster.length}`);
            console.log('\n' + '='.repeat(50));

      } else if (command) {
            // Single athlete by competitor ID
            const athlete = athletesMaster.find((a: AthleteMaster) => a.competitorId === command);

            if (!athlete) {
                  console.error(`\n✗ Athlete with Competitor ID ${command} not found`);
                  return;
            }

            const results = await scrapeFisProfile(athlete);
            await saveToExcel(athlete, results);

            console.log('\n' + '='.repeat(50));
      } else {
            console.log('\nUsage:');
            console.log('  npm run excel-scrape all              - Process all athletes');
            console.log('  npm run excel-scrape <competitor_id>  - Process single athlete');
            console.log('\nExample:');
            console.log('  npm run excel-scrape 163744           - Process 이상호');
      }
}

main();
