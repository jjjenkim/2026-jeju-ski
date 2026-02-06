import axios from 'axios';
import * as cheerio from 'cheerio';
import fs from 'fs/promises';

const testUrl = 'https://www.fis-ski.com/DB/general/athlete-biography.html?sectorcode=SB&competitorid=264594&type=result';

async function testScrape() {
  try {
    console.log('Fetching:', testUrl);

    const response = await axios.get(testUrl, {
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
        'Sec-Fetch-Site': 'none',
        'Cache-Control': 'max-age=0'
      },
      timeout: 15000
    });

    console.log('Status:', response.status);
    console.log('Content length:', response.data.length);

    // Save HTML to file for inspection
    await fs.writeFile('test-page.html', response.data);
    console.log('Saved HTML to test-page.html');

    const $ = cheerio.load(response.data);

    // Try to find tables
    const tables = $('table');
    console.log('\nTotal tables found:', tables.length);

    tables.each((i, table) => {
      const classes = $(table).attr('class') || 'no-class';
      const id = $(table).attr('id') || 'no-id';
      const rowCount = $(table).find('tr').length;
      console.log(`Table ${i}: class="${classes}", id="${id}", rows=${rowCount}`);
    });

    // Try to find table.table-striped specifically
    const stripedTable = $('table.table-striped');
    console.log('\nTable.table-striped found:', stripedTable.length);

    if (stripedTable.length > 0) {
      console.log('First 5 rows of table.table-striped:');
      stripedTable.find('tr').slice(0, 5).each((i, row) => {
        const cells = $(row).find('td, th');
        const cellTexts = [];
        cells.each((j, cell) => {
          cellTexts.push($(cell).text().trim());
        });
        console.log(`Row ${i}:`, cellTexts);
      });
    }

    // Try different table selectors
    console.log('\n--- Trying different selectors ---');
    const resultTable = $('.results-table, .table-results, #results-table, .athlete-results');
    console.log('Results table selector found:', resultTable.length);

    // Look for divs that might contain results
    const resultsDivs = $('div[class*="result"], div[id*="result"]');
    console.log('Result divs found:', resultsDivs.length);

  } catch (error) {
    console.error('Error:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
    }
  }
}

testScrape();
