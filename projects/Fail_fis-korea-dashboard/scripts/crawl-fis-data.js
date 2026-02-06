/**
 * FIS 데이터 크롤러
 * 선수들의 FIS 프로필에서 실제 성적 데이터를 가져옵니다
 */

import fs from 'fs';
import Papa from 'papaparse';

// CORS 문제를 피하기 위한 프록시 서비스 사용
const CORS_PROXY = 'https://api.allorigins.win/raw?url=';

/**
 * FIS 프로필 페이지에서 데이터 추출
 */
async function fetchAthleteData(fisCode, sectorCode, athleteName) {
  const url = `https://www.fis-ski.com/DB/general/athlete-biography.html?sectorcode=${sectorCode}&competitorid=${fisCode}&type=result`;

  console.log(`크롤링 중: ${athleteName} (${fisCode})...`);

  try {
    // 실제 웹 크롤링 (브라우저 환경에서는 CORS 제한으로 서버 사이드 필요)
    const response = await fetch(CORS_PROXY + encodeURIComponent(url));
    const html = await response.text();

    // HTML 파싱하여 데이터 추출
    const competitions = parseCompetitionResults(html);
    const gender = parseGender(html, athleteName);

    return {
      competitions,
      gender
    };
  } catch (error) {
    console.error(`❌ ${athleteName} 크롤링 실패:`, error.message);
    return {
      competitions: [],
      gender: inferGenderFromName(athleteName) // 이름으로 성별 추정
    };
  }
}

/**
 * HTML에서 경기 결과 파싱
 */
function parseCompetitionResults(html) {
  const competitions = [];

  // FIS 웹사이트의 결과 테이블 파싱
  // 실제 HTML 구조에 맞게 정규식 또는 파서 사용
  const resultRegex = /<tr[^>]*>.*?<td[^>]*>(\d{4}-\d{2}-\d{2})<\/td>.*?<td[^>]*>(.*?)<\/td>.*?<td[^>]*>(\d+)<\/td>.*?<td[^>]*>([\d.]+)<\/td>.*?<\/tr>/gs;

  let match;
  while ((match = resultRegex.exec(html)) !== null) {
    competitions.push({
      date: match[1],
      eventName: match[2].trim(),
      rank: parseInt(match[3]),
      points: parseFloat(match[4]),
      grade: inferCompetitionGrade(match[2])
    });
  }

  return competitions;
}

/**
 * HTML에서 성별 정보 추출
 */
function parseGender(html, name) {
  // HTML에서 "Gender" 또는 성별 표시 찾기
  if (html.includes('Gender') || html.includes('gender')) {
    if (html.includes('Male') || html.includes('male')) return '남';
    if (html.includes('Female') || html.includes('female')) return '여';
  }

  // HTML에서 찾지 못하면 이름으로 추정
  return inferGenderFromName(name);
}

/**
 * 한국 이름에서 성별 추정
 */
function inferGenderFromName(name) {
  // 여성 이름에 자주 사용되는 글자
  const femaleChars = ['희', '미', '영', '은', '윤', '지', '수', '현', '예', '서'];
  const hasFemaleChar = femaleChars.some(char => name.includes(char));

  // 남성 이름에 자주 사용되는 글자
  const maleChars = ['현', '준', '민', '우', '진', '호', '석', '철', '용'];
  const hasMaleChar = maleChars.some(char => name.includes(char));

  if (hasFemaleChar && !hasMaleChar) return '여';
  if (hasMaleChar && !hasFemaleChar) return '남';

  // 확실하지 않으면 null
  return null;
}

/**
 * 대회명에서 등급 추정
 */
function inferCompetitionGrade(eventName) {
  const name = eventName.toLowerCase();

  if (name.includes('olympic') || name.includes('올림픽')) return 'OG';
  if (name.includes('world championships') || name.includes('세계선수권')) return 'WCH';
  if (name.includes('world cup') || name.includes('월드컵')) return 'WC';
  if (name.includes('european cup') || name.includes('유럽컵')) return 'EC';

  return 'FIS';
}

/**
 * 기존 CSV 읽기
 */
async function readExistingCSV(filePath) {
  const csvText = fs.readFileSync(filePath, 'utf-8');

  return new Promise((resolve) => {
    Papa.parse(csvText, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        // BOM 제거
        const cleanData = results.data.map(row => {
          const cleanRow = {};
          Object.keys(row).forEach(key => {
            const cleanKey = key.replace(/^\uFEFF/, '').trim();
            cleanRow[cleanKey] = row[key];
          });
          return cleanRow;
        });
        resolve(cleanData);
      }
    });
  });
}

/**
 * 확장된 CSV 생성 (성별 + 경기 데이터 포함)
 */
async function generateEnhancedCSV(inputPath, outputPath) {
  console.log('🚀 FIS 데이터 크롤링 시작...\n');

  const athletes = await readExistingCSV(inputPath);
  const enhancedData = [];

  for (const athlete of athletes) {
    console.log(`처리 중: ${athlete.선수명}...`);

    // FIS 데이터 크롤링
    const fisData = await fetchAthleteData(
      athlete.FIS코드,
      athlete.Sector코드,
      athlete.선수명
    );

    // 경기별로 행 생성
    if (fisData.competitions.length > 0) {
      for (const comp of fisData.competitions) {
        enhancedData.push({
          종목: athlete.종목,
          세부종목: athlete.세부종목,
          성별: fisData.gender || inferGenderFromName(athlete.선수명),
          선수명: athlete.선수명,
          생년: athlete.생년,
          연령대: athlete.연령대,
          소속: athlete.소속,
          FIS코드: athlete.FIS코드,
          Sector코드: athlete.Sector코드,
          시즌: athlete.시즌,
          대회명: comp.eventName,
          대회등급: comp.grade,
          날짜: comp.date,
          랭킹: comp.rank,
          포인트: comp.points,
          FIS프로필URL: athlete.FIS프로필URL
        });
      }
    } else {
      // 경기 데이터가 없어도 선수 정보는 보존
      enhancedData.push({
        종목: athlete.종목,
        세부종목: athlete.세부종목,
        성별: fisData.gender || inferGenderFromName(athlete.선수명),
        선수명: athlete.선수명,
        생년: athlete.생년,
        연령대: athlete.연령대,
        소속: athlete.소속,
        FIS코드: athlete.FIS코드,
        Sector코드: athlete.Sector코드,
        시즌: athlete.시즌,
        대회명: '',
        대회등급: '',
        날짜: '',
        랭킹: '',
        포인트: '',
        FIS프로필URL: athlete.FIS프로필URL
      });
    }

    // API 과부하 방지 (1초 대기)
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  // CSV로 저장
  const csv = Papa.unparse(enhancedData);
  fs.writeFileSync(outputPath, csv, 'utf-8');

  console.log(`\n✅ 완료! ${enhancedData.length}개 레코드를 ${outputPath}에 저장했습니다.`);
}

// 실행
const inputCSV = '../public/sample-athletes.csv';
const outputCSV = '../public/athletes-with-results.csv';

generateEnhancedCSV(inputCSV, outputCSV).catch(console.error);
