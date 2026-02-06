import fetch from 'node-fetch';
import * as cheerio from 'cheerio';
import * as fs from 'fs/promises';
import * as path from 'path';

interface AthleteData {
      name: string;
      nameEn: string;
      fisCode: string;
      sectorCode: string;
      discipline: string;
      subDiscipline: string;
      birthYear: string;
      team: string;
}

interface FisResult {
      date: string;
      location: string;
      event: string;
      discipline: string;
      rank: number | string;
      fisPoints?: number;
      wcPoints?: number;
}

interface AthleteResults {
      name: string;
      nameEn: string;
      fisCode: string;
      latestResults: FisResult[];
      currentRanking?: number;
      totalPoints?: number;
      lastUpdated: string;
}

interface FisResultsData {
      results: { [fisCode: string]: AthleteResults };
      lastUpdated: string;
}

/**
 * Build FIS profile URL
 */
function buildFisUrl(sectorCode: string, fisCode: string): string {
      // Use fiscode parameter instead of competitorid for more reliable mapping if internal ID is unknown
      return `https://www.fis-ski.com/DB/general/athlete-biography.html?sectorcode=${sectorCode}&fiscode=${fisCode}&type=result`;
}

/**
 * Fetch and parse FIS profile page
 */
async function scrapeFisProfile(athlete: AthleteData): Promise<AthleteResults | null> {
      const url = buildFisUrl(athlete.sectorCode, athlete.fisCode);

      console.log(`Fetching: ${athlete.name} (${athlete.fisCode})...`);

      try {
            const response = await fetch(url, {
                  headers: {
                        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
                  }
            });

            if (!response.ok) {
                  console.error(`  ✗ HTTP ${response.status} for ${athlete.name}`);
                  return null;
            }

            const html = await response.text();
            const $ = cheerio.load(html);

            // Parse results - FIS uses div-based table structure
            const results: FisResult[] = [];

            // Find all table rows (they're divs with class "table-row")
            $('#results-body a.table-row').each((i, row) => {
                  if (i >= 15) return false; // Increased limit slightly to ensure we catch recent active ones

                  const $row = $(row);

                  // The actual cells are inside a div with class "container"
                  const container = $row.find('.container');
                  const cells = container.children('div');

                  if (cells.length >= 4) {
                        const dateText = cells.eq(0).text().trim();

                        // Use responsive classes to find the right columns reliably
                        // We filter by .hidden-sm-down to find Location, Category, and Discipline
                        const desktopCells = cells.filter('.hidden-sm-down');

                        const locationText = desktopCells.eq(0).text().trim();
                        const eventText = desktopCells.eq(1).text().trim() || 'Unknown';
                        const disciplineText = desktopCells.eq(2).text().trim() || athlete.subDiscipline;

                        // Rank and points are in a div with class g-xs-6.
                        // We take the last one to be safe, as Rank/Points are typically at the end.
                        const rankPointsCell = cells.filter('.g-xs-6').last();
                        const rankText = rankPointsCell.find('> div').first().text().trim();

                        const fisPointsText = rankPointsCell.find('> div').eq(1).text().trim();
                        const wcPointsText = rankPointsCell.find('> div').eq(2).text().trim();

                        if (dateText && locationText && rankText) {
                              // Robust rank parsing: handles "18", "18 (1)", "DNF", etc.
                              const numericMatch = rankText.match(/^\d+/);
                              const parsedRank = numericMatch ? parseInt(numericMatch[0]) : rankText;

                              results.push({
                                    date: dateText,
                                    location: locationText,
                                    event: eventText,
                                    discipline: disciplineText,
                                    rank: parsedRank,
                                    fisPoints: fisPointsText && !isNaN(parseFloat(fisPointsText)) ? parseFloat(fisPointsText) : undefined,
                                    wcPoints: wcPointsText && !isNaN(parseFloat(wcPointsText)) ? parseFloat(wcPointsText) : undefined
                              });
                        }
                  }
            });

            console.log(`  ✓ Found ${results.length} results for ${athlete.name}`);

            return {
                  name: athlete.name,
                  nameEn: athlete.nameEn,
                  fisCode: athlete.fisCode,
                  latestResults: results,
                  lastUpdated: new Date().toISOString()
            };

      } catch (error) {
            console.error(`  ✗ Error fetching ${athlete.name}:`, error instanceof Error ? error.message : error);
            return null;
      }
}

/**
 * Scrape single athlete (for testing)
 */
async function scrapeSingleAthlete(fisCode: string) {
      console.log('\n🔍 FIS Single Athlete Scraper\n');
      console.log('='.repeat(50));

      // Load athletes database
      const athletesPath = path.join(process.cwd(), 'public', 'athletes-data.json');
      const athletesData = JSON.parse(await fs.readFile(athletesPath, 'utf-8'));

      const athlete = athletesData.athletes.find((a: AthleteData) => a.fisCode === fisCode);

      if (!athlete) {
            console.error(`\n✗ Athlete with FIS code ${fisCode} not found`);
            return;
      }

      const result = await scrapeFisProfile(athlete);

      if (result) {
            console.log('\n📊 Results:');
            console.log(JSON.stringify(result, null, 2));
      }

      console.log('\n' + '='.repeat(50));
}

/**
 * Scrape all athletes
 */
async function scrapeAllAthletes() {
      console.log('\n🔍 FIS Data Scraper - All Athletes (with Antigravity)\n');
      console.log('='.repeat(50));

      // Load athletes database
      const athletesPath = path.join(process.cwd(), 'public', 'athletes-data.json');
      const athletesData = JSON.parse(await fs.readFile(athletesPath, 'utf-8'));
      const athletes: AthleteData[] = athletesData.athletes;

      console.log(`\nTotal athletes: ${athletes.length}\n`);

      // Import Antigravity utilities (dynamic import for Node.js)
      const { AntigravityOrchestrator } = await import('../src/utils/orchestrator.js');
      const { AntigravityCorrector } = await import('../src/utils/corrector.js');
      const { default: ANTIGRAVITY_CONFIG } = await import('../src/config/antigravity.config.js');

      const orchestrator = new AntigravityOrchestrator(
            ANTIGRAVITY_CONFIG.orchestrator.maxConcurrent,
            ANTIGRAVITY_CONFIG.orchestrator.cacheTTL,
            ANTIGRAVITY_CONFIG.orchestrator.cacheMaxSize
      );

      const corrector = new AntigravityCorrector({
            maxRetries: ANTIGRAVITY_CONFIG.corrector.maxRetries,
            baseDelay: ANTIGRAVITY_CONFIG.corrector.baseDelay,
            onRetry: (attempt, error) => {
                  console.log(`  ⟳ Retry ${attempt}/${ANTIGRAVITY_CONFIG.corrector.maxRetries}: ${error.message}`);
            }
      });

      const results: { [fisCode: string]: AthleteResults } = {};
      let successCount = 0;
      let failCount = 0;

      // Process athletes in batches with orchestrator
      const batchSize = ANTIGRAVITY_CONFIG.scraper.batchSize;
      const delayBetweenRequests = ANTIGRAVITY_CONFIG.scraper.delayBetweenRequests;

      for (let i = 0; i < athletes.length; i += batchSize) {
            const batch = athletes.slice(i, i + batchSize);
            console.log(`\nBatch ${Math.floor(i / batchSize) + 1}/${Math.ceil(athletes.length / batchSize)}:`);

            // Create tasks for orchestrator
            const tasks = batch.map(athlete => ({
                  fn: async () => {
                        // Wrap scrapeFisProfile with corrector for auto-retry
                        return await corrector.run(async () => {
                              const result = await scrapeFisProfile(athlete);

                              // Add delay between requests to avoid overwhelming server
                              await new Promise(resolve => setTimeout(resolve, delayBetweenRequests));

                              return { athlete, result };
                        });
                  },
                  key: `athlete-${athlete.fisCode}`
            }));

            // Execute batch in parallel with orchestrator
            const batchResults = await orchestrator.run(tasks);

            // Process results
            for (const { athlete, result } of batchResults) {
                  if (result) {
                        results[athlete.fisCode] = result;
                        successCount++;
                  } else {
                        failCount++;
                  }
            }
      }

      // Save results
      const outputPath = path.join(process.cwd(), 'public', 'fis-results.json');
      const outputData: FisResultsData = {
            results,
            lastUpdated: new Date().toISOString()
      };

      await fs.writeFile(outputPath, JSON.stringify(outputData, null, 2));

      // Show orchestrator stats
      const stats = orchestrator.getStats();

      console.log('\n' + '='.repeat(50));
      console.log('\n✅ Scraping Complete!');
      console.log(`\nSuccess: ${successCount}/${athletes.length}`);
      console.log(`Failed: ${failCount}/${athletes.length}`);
      console.log(`\n📊 Orchestrator Stats:`);
      console.log(`  Cache hits: ${stats.cacheHits}`);
      console.log(`  Cache misses: ${stats.cacheMisses}`);
      console.log(`  Cache size: ${stats.cacheSize} entries (${stats.cacheUsagePercent.toFixed(1)}% used)`);
      console.log(`\nResults saved to: ${outputPath}`);
      console.log('\n' + '='.repeat(50));
}


// Main execution
const args = process.argv.slice(2);
const command = args[0];
const fisCode = args[1];

if (command === 'single' && fisCode) {
      scrapeSingleAthlete(fisCode);
} else if (command === 'all') {
      scrapeAllAthletes();
} else {
      console.log('\nUsage:');
      console.log('  npm run scrape-athlete single <FIS_CODE>  - Scrape single athlete');
      console.log('  npm run scrape-athlete all                - Scrape all athletes');
      console.log('\nExample:');
      console.log('  npm run scrape-athlete single 264594      - Scrape 최가온');
}
