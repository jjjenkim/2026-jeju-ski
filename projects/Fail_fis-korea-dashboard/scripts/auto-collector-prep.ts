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
      console.log(`✅ 저장 완료: ${filePath}`);
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
      console.log(`✅ Master file created: ${filePath}\n`);
}

/**
 * This script will be called by the browser automation system
 * The actual browser interaction will be handled by browser_subagent
 */
async function main() {
      console.log('\n🤖 FIS 데이터 자동 수집 시스템 (브라우저 자동화)\n');
      console.log('='.repeat(60));
      console.log('AI가 브라우저를 통해 자동으로 데이터를 수집합니다.');
      console.log('='.repeat(60));

      // Load athletes from JSON
      const athletesMaster = await loadAthletesMaster();

      // Create master file first
      await createMasterExcel(athletesMaster);

      const args = process.argv.slice(2);
      const command = args[0];

      if (command === 'all') {
            console.log(`\n총 ${athletesMaster.length}명의 선수 데이터를 자동 수집합니다.\n`);
            console.log('⚠️  이 작업은 브라우저 자동화를 사용하여 진행됩니다.');
            console.log('   각 선수당 약 10-15초가 소요됩니다.\n');

            // Export athlete list for browser automation
            const athleteListPath = path.join(process.cwd(), 'public', 'data', 'athletes-to-collect.json');
            await fs.writeFile(athleteListPath, JSON.stringify(athletesMaster, null, 2));

            console.log(`✅ 선수 목록 저장: ${athleteListPath}`);
            console.log('\n다음 명령어로 브라우저 자동화를 실행하세요:');
            console.log('  npm run auto-collect\n');

      } else if (command) {
            // Single athlete by competitor ID
            const athlete = athletesMaster.find((a: AthleteMaster) => a.competitorId === command);

            if (!athlete) {
                  console.error(`\n✗ Athlete with Competitor ID ${command} not found`);
                  return;
            }

            // Export single athlete for browser automation
            const athletePath = path.join(process.cwd(), 'public', 'data', 'current-athlete.json');
            await fs.writeFile(athletePath, JSON.stringify(athlete, null, 2));

            console.log(`\n선수: ${athlete.name} (${athlete.competitorId})`);
            console.log(`URL: ${athlete.profileUrl}`);
            console.log(`\n✅ 선수 정보 저장: ${athletePath}`);
            console.log('\n다음 명령어로 브라우저 자동화를 실행하세요:');
            console.log('  npm run auto-collect-one\n');

      } else {
            console.log('\n사용법:');
            console.log('  npm run prepare-auto all              - 모든 선수 준비');
            console.log('  npm run prepare-auto <competitor_id>  - 특정 선수 준비');
            console.log('\n예시:');
            console.log('  npm run prepare-auto 163744           - 이상호 준비');
            console.log('\n');
      }
}

main();
