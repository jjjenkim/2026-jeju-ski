import * as XLSX from 'xlsx';
import { promises as fs } from 'fs';
import path from 'path';
import readline from 'readline';
import { openInBrowser } from './browser-opener.js';

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
 * Create readline interface for user input
 */
function createReadlineInterface() {
      return readline.createInterface({
            input: process.stdin,
            output: process.stdout
      });
}

/**
 * Prompt user for input
 */
function prompt(question: string): Promise<string> {
      const rl = createReadlineInterface();
      return new Promise((resolve) => {
            rl.question(question, (answer) => {
                  rl.close();
                  resolve(answer.trim());
            });
      });
}

/**
 * Collect competition results from user
 */
async function collectResultsFromUser(athlete: AthleteMaster): Promise<CompetitionResult[]> {
      console.log('\n' + '='.repeat(60));
      console.log(`📊 ${athlete.name} (${athlete.nameEn}) - ${athlete.competitorId}`);
      console.log('='.repeat(60));
      console.log(`\n🔗 FIS 프로필: ${athlete.profileUrl}`);

      // Open browser automatically
      await openInBrowser(athlete.profileUrl);

      console.log('\n브라우저에서 데이터를 확인하세요.');
      console.log('확인 후 아래 정보를 입력해주세요.\n');

      const results: CompetitionResult[] = [];
      let continueAdding = true;
      let resultCount = 1;

      while (continueAdding) {
            console.log(`\n--- 경기 결과 #${resultCount} ---`);

            const date = await prompt('날짜 (예: 2026-01-18, 또는 엔터로 종료): ');
            if (!date) {
                  continueAdding = false;
                  break;
            }

            const location = await prompt('장소 (예: Bansko): ');
            const nation = await prompt('국가 (예: BUL): ');
            const category = await prompt('대회 (예: World Cup): ');
            const discipline = await prompt(`종목 (기본값: ${athlete.subDiscipline}): `) || athlete.subDiscipline;
            const rankInput = await prompt('순위 (예: 18): ');
            const fisPointsInput = await prompt('FIS Points (예: 150.00, 선택사항): ');
            const cupPointsInput = await prompt('Cup Points (예: 13.00, 선택사항): ');

            // Parse rank
            const rank = rankInput.match(/^\d+/) ? parseInt(rankInput) : rankInput;

            results.push({
                  date,
                  location,
                  nation,
                  category,
                  discipline,
                  rank,
                  fisPoints: fisPointsInput ? parseFloat(fisPointsInput) : undefined,
                  cupPoints: cupPointsInput ? parseFloat(cupPointsInput) : undefined
            });

            resultCount++;

            const addMore = await prompt('\n다른 경기 결과를 추가하시겠습니까? (y/n): ');
            if (addMore.toLowerCase() !== 'y') {
                  continueAdding = false;
            }
      }

      return results;
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
      console.log(`\n✅ 저장 완료: ${filePath}`);
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
      console.log('\n🔍 FIS 데이터 수동 수집 시스템\n');
      console.log('='.repeat(60));
      console.log('각 선수의 FIS 페이지를 확인하고 데이터를 입력하세요.');
      console.log('='.repeat(60));

      // Load athletes from JSON
      const athletesMaster = await loadAthletesMaster();

      // Create master file first
      await createMasterExcel(athletesMaster);

      const args = process.argv.slice(2);
      const command = args[0];

      if (command === 'all') {
            console.log(`\n총 ${athletesMaster.length}명의 선수 데이터를 수집합니다.\n`);

            let successCount = 0;
            let skipCount = 0;

            for (let i = 0; i < athletesMaster.length; i++) {
                  const athlete = athletesMaster[i];

                  console.log(`\n[${i + 1}/${athletesMaster.length}] 진행 중...`);

                  const results = await collectResultsFromUser(athlete);

                  if (results.length > 0) {
                        await saveToExcel(athlete, results);
                        successCount++;
                  } else {
                        console.log('\n⏭️  건너뛰기');
                        skipCount++;
                  }

                  // Ask if user wants to continue
                  if (i < athletesMaster.length - 1) {
                        const continuePrompt = await prompt('\n다음 선수로 이동하시겠습니까? (y/n, 기본값: y): ');
                        if (continuePrompt.toLowerCase() === 'n') {
                              console.log('\n중단되었습니다.');
                              break;
                        }
                  }
            }

            console.log('\n' + '='.repeat(60));
            console.log('✅ 데이터 수집 완료!');
            console.log(`\n성공: ${successCount}명`);
            console.log(`건너뜀: ${skipCount}명`);
            console.log('='.repeat(60));

      } else if (command) {
            // Single athlete by competitor ID
            const athlete = athletesMaster.find((a: AthleteMaster) => a.competitorId === command);

            if (!athlete) {
                  console.error(`\n✗ Athlete with Competitor ID ${command} not found`);
                  return;
            }

            const results = await collectResultsFromUser(athlete);

            if (results.length > 0) {
                  await saveToExcel(athlete, results);
            } else {
                  console.log('\n데이터가 입력되지 않았습니다.');
            }

            console.log('\n' + '='.repeat(60));
      } else {
            console.log('\n사용법:');
            console.log('  npm run collect-data all              - 모든 선수 데이터 수집');
            console.log('  npm run collect-data <competitor_id>  - 특정 선수 데이터 수집');
            console.log('\n예시:');
            console.log('  npm run collect-data 163744           - 이상호 데이터 수집');
            console.log('\n');
      }
}

main();
