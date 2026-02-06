import fetch from 'node-fetch';
import * as fs from 'fs/promises';

async function fetchFisPage() {
      const url = 'https://www.fis-ski.com/DB/general/athlete-biography.html?sectorcode=SB&competitorid=264594&type=result';

      const response = await fetch(url, {
            headers: {
                  'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
            }
      });

      const html = await response.text();
      await fs.writeFile('fis-page-sample.html', html);
      console.log('Saved to fis-page-sample.html');
}

fetchFisPage();
