import express from 'express';
import cors from 'cors';
import axios from 'axios';
import * as cheerio from 'cheerio';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

// FIS 페이지에서 선수 결과 스크래핑
async function scrapeAthleteResults(fisUrl, athleteName) {
  try {
    console.log(`Scraping ${athleteName} from ${fisUrl}`);

    const response = await axios.get(fisUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Accept-Encoding': 'gzip, deflate, br',
        'DNT': '1',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1',
        'Sec-Fetch-Dest': 'document',
        'Sec-Fetch-Mode': 'navigate',
        'Sec-Fetch-Site': 'cross-site',
        'Cache-Control': 'max-age=0',
        'Referer': 'https://www.fis-ski.com/'
      },
      timeout: 15000,
      maxRedirects: 5
    });

    const $ = cheerio.load(response.data);
    const results = [];

    // Try multiple table selectors
    let tableRows = $('table.table-striped tbody tr');
    if (tableRows.length === 0) {
      tableRows = $('table.g-row tbody tr, table[class*="results"] tbody tr, div.results table tbody tr');
    }
    if (tableRows.length === 0) {
      tableRows = $('table tbody tr');
    }

    console.log(`  Found ${tableRows.length} rows for ${athleteName}`);

    tableRows.each((index, element) => {
      const cells = $(element).find('td');
      if (cells.length < 5) return;

      const season = $(cells[0]).text().trim();
      const date = $(cells[1]).text().trim();
      const place = $(cells[2]).text().trim();
      const codex = $(cells[3]).text().trim();
      const competition = $(cells[4]).text().trim();
      const discipline = cells.length > 5 ? $(cells[5]).text().trim() : '';
      const rank = cells.length > 6 ? $(cells[6]).text().trim() : '';
      const points = cells.length > 7 ? $(cells[7]).text().trim() : '';

      // 2024/25 시즌만 필터링
      if (season.includes('2024') || season.includes('2025')) {
        results.push({
          season,
          date,
          location: place,
          competition: competition || codex,
          category: mapCategory(codex),
          rank: parseRank(rank),
          points: parseFloat(points) || 0
        });
      }
    });

    return results;
  } catch (error) {
    if (error.response && error.response.status === 403) {
      console.error(`❌ 403 Forbidden for ${athleteName} - FIS website blocking automated access`);
      console.error(`   URL: ${fisUrl}`);
      console.error(`   This athlete's data needs to be added manually or through browser`);
    } else {
      console.error(`Error scraping ${athleteName}:`, error.message);
    }
    return [];
  }
}

// 카테고리 매핑
function mapCategory(category) {
  const categoryMap = {
    'OWG': 'OG',
    'Olympic Winter Games': 'OG',
    'WSC': 'WCH',
    'World Championships': 'WCH',
    'WC': 'WC',
    'World Cup': 'WC',
    'EC': 'EC',
    'Europa Cup': 'EC',
    'FIS': 'FIS',
    'FIS Cup': 'FIS',
    'NC': 'FIS',
    'COC': 'EC'
  };

  for (const [key, value] of Object.entries(categoryMap)) {
    if (category.includes(key)) {
      return value;
    }
  }

  return 'FIS';
}

// 순위 파싱
function parseRank(rank) {
  const match = rank.match(/\d+/);
  return match ? parseInt(match[0]) : 999;
}

// 연령대 계산
function getAgeGroup(birthYear) {
  const age = new Date().getFullYear() - parseInt(birthYear);
  if (age < 20) return '10대';
  if (age < 30) return '20대';
  if (age < 40) return '30대';
  return '40대';
}

// 모든 선수 데이터 스크래핑
app.get('/api/scrape-all', async (req, res) => {
  try {
    const athletesData = await fs.readFile(
      path.join(__dirname, '../public/athletes-list.json'),
      'utf-8'
    );
    const { athletes } = JSON.parse(athletesData);

    const allResults = [];
    const batchSize = 5; // 동시에 5명씩만 스크래핑

    for (let i = 0; i < athletes.length; i += batchSize) {
      const batch = athletes.slice(i, i + batchSize);

      const batchPromises = batch.map(async (athlete) => {
        const results = await scrapeAthleteResults(athlete.fisUrl, athlete.name);

        return results.map(result => ({
          종목: athlete.discipline,
          성별: athlete.gender,
          선수명: athlete.name,
          생년: athlete.birthYear,
          연령대: getAgeGroup(athlete.birthYear),
          소속: athlete.affiliation,
          시즌: result.season,
          대회명: result.competition,
          대회카테고리: result.category,
          날짜: result.date,
          랭킹: result.rank,
          포인트: result.points,
          FIS프로필URL: athlete.fisUrl
        }));
      });

      const batchResults = await Promise.all(batchPromises);
      allResults.push(...batchResults.flat());

      // Rate limiting: 배치 사이에 1초 대기
      if (i + batchSize < athletes.length) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    // CSV 생성
    const csvHeader = '종목,성별,선수명,생년,연령대,소속,시즌,대회명,대회카테고리,날짜,랭킹,포인트,FIS프로필URL\n';
    const csvRows = allResults.map(row =>
      `${row.종목},${row.성별},${row.선수명},${row.생년},${row.연령대},${row.소속},${row.시즌},"${row.대회명}",${row.대회카테고리},${row.날짜},${row.랭킹},${row.포인트},${row.FIS프로필URL}`
    ).join('\n');

    const csvContent = csvHeader + csvRows;

    // CSV 파일 저장
    await fs.writeFile(
      path.join(__dirname, '../public/athletes-with-competitions.csv'),
      csvContent,
      'utf-8'
    );

    res.json({
      success: true,
      message: `Successfully scraped ${allResults.length} results from ${athletes.length} athletes`,
      totalResults: allResults.length,
      athletes: athletes.length
    });

  } catch (error) {
    console.error('Scraping error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// 단일 선수 데이터 스크래핑
app.get('/api/scrape-athlete/:name', async (req, res) => {
  try {
    const athleteName = req.params.name;

    const athletesData = await fs.readFile(
      path.join(__dirname, '../public/athletes-list.json'),
      'utf-8'
    );
    const { athletes } = JSON.parse(athletesData);

    const athlete = athletes.find(a => a.name === athleteName);

    if (!athlete) {
      return res.status(404).json({
        success: false,
        error: 'Athlete not found'
      });
    }

    const results = await scrapeAthleteResults(athlete.fisUrl, athlete.name);

    const formattedResults = results.map(result => ({
      종목: athlete.discipline,
      성별: athlete.gender,
      선수명: athlete.name,
      생년: athlete.birthYear,
      연령대: getAgeGroup(athlete.birthYear),
      소속: athlete.affiliation,
      시즌: result.season,
      대회명: result.competition,
      대회카테고리: result.category,
      날짜: result.date,
      랭킹: result.rank,
      포인트: result.points,
      FIS프로필URL: athlete.fisUrl
    }));

    res.json({
      success: true,
      athlete: athlete.name,
      results: formattedResults
    });

  } catch (error) {
    console.error('Scraping error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// 선수 목록 조회
app.get('/api/athletes', async (req, res) => {
  try {
    const athletesData = await fs.readFile(
      path.join(__dirname, '../public/athletes-list.json'),
      'utf-8'
    );
    const { athletes } = JSON.parse(athletesData);

    res.json({
      success: true,
      athletes
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// 수동 데이터 업데이트 API
app.post('/api/manual-update', async (req, res) => {
  try {
    const { athlete, results } = req.body;

    if (!athlete || !results || results.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Invalid data'
      });
    }

    // CSV 파일 읽기 (기존 데이터)
    let existingCsv = '';
    try {
      existingCsv = await fs.readFile(
        path.join(__dirname, '../public/athletes-with-competitions.csv'),
        'utf-8'
      );
    } catch (error) {
      // 파일이 없으면 헤더만 생성
      existingCsv = '종목,성별,선수명,생년,연령대,소속,시즌,대회명,대회카테고리,날짜,랭킹,포인트,FIS프로필URL\n';
    }

    // 해당 선수의 기존 데이터 제거
    const lines = existingCsv.split('\n');
    const header = lines[0];
    const filteredLines = lines.slice(1).filter(line => {
      return !line.includes(athlete.name);
    });

    // 새 데이터 추가
    const newRows = results.map(result => {
      const ageGroup = getAgeGroup(athlete.birthYear);
      return `${athlete.discipline},${athlete.gender},${athlete.name},${athlete.birthYear},${ageGroup},${athlete.affiliation},${result.season},"${result.competition}",${result.category},${result.date},${result.rank},${result.points},${athlete.fisUrl}`;
    });

    const updatedCsv = header + '\n' + [...filteredLines, ...newRows].filter(line => line.trim()).join('\n');

    // CSV 파일 저장
    await fs.writeFile(
      path.join(__dirname, '../public/athletes-with-competitions.csv'),
      updatedCsv,
      'utf-8'
    );

    res.json({
      success: true,
      message: `Successfully updated ${results.length} results for ${athlete.name}`,
      athlete: athlete.name,
      resultsCount: results.length
    });

  } catch (error) {
    console.error('Manual update error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// 수동 입력 폼 제공
app.get('/manual-update', async (req, res) => {
  try {
    const htmlContent = await fs.readFile(
      path.join(__dirname, 'manual-update.html'),
      'utf-8'
    );
    res.setHeader('Content-Type', 'text/html');
    res.send(htmlContent);
  } catch (error) {
    res.status(500).send('Error loading manual update form');
  }
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`🚀 FIS Scraper Server running on http://localhost:${PORT}`);
  console.log(`\n📊 API Endpoints:`);
  console.log(`   - Scrape all athletes: http://localhost:${PORT}/api/scrape-all`);
  console.log(`   - Scrape single athlete: http://localhost:${PORT}/api/scrape-athlete/:name`);
  console.log(`   - Get athletes list: http://localhost:${PORT}/api/athletes`);
  console.log(`   - Manual update: http://localhost:${PORT}/api/manual-update (POST)`);
  console.log(`\n✏️  Manual Data Entry Form:`);
  console.log(`   - Open in browser: http://localhost:${PORT}/manual-update`);
  console.log(`\n⚠️  Note: FIS website may block automated scraping (403 errors)`);
  console.log(`   Use the manual update form as an alternative.`);
});
