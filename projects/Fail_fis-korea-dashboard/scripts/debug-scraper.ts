
import fetch from 'node-fetch';
import * as cheerio from 'cheerio';

async function debugAthlete(fisCode: string) {
      const url = `https://www.fis-ski.com/DB/general/athlete-biography.html?sectorcode=SB&competitorid=${fisCode}&type=result&categorycode=WC`;
      console.log(`Debugging URL: ${url}`);

      const response = await fetch(url, {
            headers: {
                  'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
            }
      });

      const html = await response.text();
      const $ = cheerio.load(html);

      $('#results-body a.table-row').each((i, row) => {
            if (i >= 5) return false;
            console.log(`\nRow ${i + 1}:`);
            const $row = $(row);
            const container = $row.find('.container');
            const cells = container.children('div');

            cells.each((j, cell) => {
                  const $cell = $(cell);
                  const text = $cell.text().trim().replace(/\s+/g, ' ');
                  const classes = $cell.attr('class');
                  console.log(`  Cell ${j}: [${classes}] -> "${text}"`);

                  // Inspect children of cell
                  $cell.children('div').each((k, child) => {
                        const $child = $(child);
                        console.log(`    Child ${k}: [${$child.attr('class')}] -> "${$child.text().trim()}"`);
                  });
            });
      });
}

debugAthlete('199693'); // Lee Sangho's competitorid from Perplexity search (Wait, FIS code is 9320091, but competitorid is different)
// Perplexity said competitorid=199693 for Lee Sangho in one link, let me check.
