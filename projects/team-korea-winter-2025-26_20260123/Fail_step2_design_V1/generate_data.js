import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read the base data (Real 43 Athletes)
// Using absolute path to avoid relative path confusion in agent environment
const baseDataPath = '/Users/jenkim/Downloads/2026_Antigravity/projects/team-korea-winter-2025-26_20260123/files_step1/athletes_base.json';
// Load Configuration
const configPath = path.join(__dirname, 'config.json');
const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
const baseData = JSON.parse(fs.readFileSync(baseDataPath, 'utf8'));

// Helper to generate random int
const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

// Helper to resolve sport and discipline from sector and discipline code
const resolveSportData = (sectorCode, disciplineCode) => {
      const mapping = config.sports_mapping[sectorCode];
      if (!mapping) return { sport: 'Unknown', discipline: 'Unknown' };

      return {
            sport: mapping.name,
            discipline: mapping.disciplines[disciplineCode] || 'General'
      };
};

// Helper to generate performance history (Trend)
const generateHistory = (baseScore) => {
      const months = ['OCT', 'NOV', 'DEC', 'JAN', 'FEB', 'MAR'];
      return months.map(month => {
            const variance = randomInt(-10, 10);
            let score = baseScore + variance;
            if (score > 100) score = 100;
            if (score < 40) score = 40;
            return {
                  name: month,
                  alpine: Math.max(20, score - randomInt(0, 20)), // Mock comparison
                  snowboard: score
            };
      });
};

console.log(`Processing ${baseData.athletes.length} athletes...`);

// Enrich athletes
const enrichedAthletes = baseData.athletes.map((athlete, index) => {
      const birthYear = parseInt(athlete.birth_year);
      const fullBirthYear = birthYear;

      // Resolve sport and random discipline from overlapping options
      const sector = athlete.sector;
      const mapping = config.sports_mapping[sector];
      const disciplineCodes = mapping ? Object.keys(mapping.disciplines) : [];
      let disciplineCode = 'GEN';

      // Smart picking for overlapping HP/SS/BA
      if (athlete.sport.includes('park')) {
            disciplineCode = ['HP', 'SS', 'BA'][randomInt(0, 2)];
      } else if (disciplineCodes.length > 0) {
            disciplineCode = disciplineCodes[randomInt(0, disciplineCodes.length - 1)];
      }

      const { sport, discipline } = resolveSportData(sector, disciplineCode);

      return {
            ...athlete,
            id: `KOR${String(index + 1).padStart(3, '0')}`,
            name_en: athlete.name_ko === '이상호' ? 'SANGHO LEE' :
                  athlete.name_ko === '최가온' ? 'GAON CHOI' :
                        athlete.name_ko === '이채운' ? 'CHAEUN LEE' : 'Team Korea Athlete',
            age: 2026 - fullBirthYear,
            gender: index % 3 === 0 ? 'F' : 'M', // Mock ratio
            sport_key: sport,
            discipline_code: disciplineCode,
            detail_discipline: discipline,
            medals: {
                  gold: 0,
                  silver: 0,
                  bronze: 0
            }
      };
});

// Mock Ranking Logic: Shuffle and assign ranks
for (let i = enrichedAthletes.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [enrichedAthletes[i], enrichedAthletes[j]] = [enrichedAthletes[j], enrichedAthletes[i]];
}

// Assign Stats based on randomized rank
enrichedAthletes.forEach((athlete, index) => {
      const rank = index + 1;
      athlete.current_rank = rank;

      // Better stats for higher ranks
      const baseScore = 100 - (rank * 1.5);
      athlete.total_points = (baseScore * 50 + randomInt(0, 500)).toFixed(0);
      athlete.history = generateHistory(baseScore);

      // Top 3 get medals
      if (rank === 1) athlete.medals.gold = randomInt(1, 3);
      if (rank <= 3) athlete.medals.silver = randomInt(0, 2);
      if (rank <= 10) athlete.medals.bronze = randomInt(0, 3);

      // Ensure "Sangho Lee" is Rank 1 for the demo consistency (User Expectation)
      if (athlete.name_ko === '이상호') {
            athlete.current_rank = 1;
            athlete.total_points = 5240;
            athlete.medals = { gold: 3, silver: 1, bronze: 0 };
      }
});

// Sort by Rank
enrichedAthletes.sort((a, b) => a.current_rank - b.current_rank);

// Fix Ranks after sort (Sangho might have displaced others)
enrichedAthletes.forEach((a, i) => a.current_rank = i + 1);

// --- STATISTICS AGGREGATION ---
const stats = {
      total_athletes: enrichedAthletes.length,
      by_sport: {},
      by_team: {},
      by_gender: { M: 0, F: 0 },
      age_distribution: { teens: 0, twenties: 0, thirties: 0 },
      total_medals: { gold: 0, silver: 0, bronze: 0 }
};

enrichedAthletes.forEach(a => {
      // By Sport
      stats.by_sport[a.sport_display] = (stats.by_sport[a.sport_display] || 0) + 1;

      // By Team
      const team = config.team_mapping[a.sport] || 'Other';
      stats.by_team[team] = (stats.by_team[team] || 0) + 1;

      // By Gender
      stats.by_gender[a.gender] = (stats.by_gender[a.gender] || 0) + 1;

      // Age
      if (a.age < 20) stats.age_distribution.teens++;
      else if (a.age < 30) stats.age_distribution.twenties++;
      else stats.age_distribution.thirties++;

      // Medals
      stats.total_medals.gold += a.medals.gold;
      stats.total_medals.silver += a.medals.silver;
      stats.total_medals.bronze += a.medals.bronze;
});

const output = {
      metadata: {
            last_updated: new Date().toISOString(),
            total_athletes: enrichedAthletes.length,
            note: "Real Roster + Mock Stats"
      },
      statistics: stats,
      athletes: enrichedAthletes
};

const outputPath = path.join(__dirname, 'public/data/athletes_enriched.json');
// Ensure directory exists
const dir = path.dirname(outputPath);
if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
}

fs.writeFileSync(outputPath, JSON.stringify(output, null, 2));
console.log(`Successfully generated ${outputPath}`);
console.log('Stats:', JSON.stringify(stats, null, 2));
