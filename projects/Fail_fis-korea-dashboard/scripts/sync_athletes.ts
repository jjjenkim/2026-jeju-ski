import * as fs from 'fs';
import * as path from 'path';

// Interfaces matching athletes-master.json
interface AthleteMaster {
      name: string;
      nameEn: string;
      competitorId: string;
      sectorCode: string;
      discipline: string;
      subDiscipline: string;
      birthYear: string;
      gender: 'M' | 'F' | 'Unknown';
      team: string;
      profileUrl: string;
}

const headerMap: Record<string, { code: string; dis: string; sub: string }> = {
      "프리스타일 스키 하프파이프·슬로프스타일 국가대표": { code: "FS", dis: "Freestyle Skiing", sub: "HP/SS" },
      "프리스타일 모글 국가대표": { code: "FS", dis: "Freestyle Skiing", sub: "Mogul" },
      "스노보드 알파인 국가대표": { code: "SB", dis: "Snowboard", sub: "Alpine" },
      "스노보드 크로스 국가대표": { code: "SB", dis: "Snowboard", sub: "Cross" },
      "스노보드 하프파이프·슬로프스타일·빅에어 국가대표": { code: "SB", dis: "Snowboard", sub: "HP/SS/BA" },
      "스키점프 국가대표": { code: "JP", dis: "Ski Jumping", sub: "Normal/Large Hill" },
      "크로스컨트리 국가대표": { code: "CC", dis: "Cross-Country", sub: "Distance/Sprint" },
      "알파인 국가대표": { code: "AL", dis: "Alpine Skiing", sub: "Technical/Speed" }
};

const userFile = path.join(process.cwd(), 'scripts', 'user_athletes.md');
const masterFile = path.join(process.cwd(), 'scripts', 'athletes-master.json');

function main() {
      console.log("Syncing athletes...");

      // Read MD
      const mdContent = fs.readFileSync(userFile, 'utf-8');
      const lines = mdContent.split('\n');

      // Read Master JSON
      let masterData: AthleteMaster[] = [];
      if (fs.existsSync(masterFile)) {
            masterData = JSON.parse(fs.readFileSync(masterFile, 'utf-8'));
      }

      let currentSection = "";
      let updatedCount = 0;
      let createdCount = 0;

      for (const line of lines) {
            const trimmed = line.trim();
            if (trimmed.startsWith('##')) {
                  // Parse Header
                  // Remove ##, **, space
                  const headerText = trimmed.replace(/^##\s*/, '').replace(/\*\*/g, '').trim();
                  if (headerMap[headerText]) {
                        currentSection = headerText;
                        console.log(`Processing Section: ${headerText}`);
                  } else {
                        console.warn(`Unmapped Section: ${headerText}`);
                  }
                  continue;
            }

            if (trimmed.startsWith('-')) {
                  // Parse Athlete
                  // Format: - Name(YY) — URL
                  // Regex
                  const match = trimmed.match(/- (.+?)\((\d{2})\) — (https?:\/\/[^\s]+)/);
                  if (match) {
                        const name = match[1].trim();
                        const yy = match[2]; // 05 -> 2005, 95 -> 1995. Logic: > 26 ? 19xx : 20xx? Or specific pivot.
                        // Current year 2026. 
                        // 05 -> 2005. 99 -> 1999. 81 -> 1981.
                        // Pivot 30? If > 30, 19xx. Else 20xx.
                        const yearNum = parseInt(yy);
                        const fullYear = yearNum > 40 ? `19${yy}` : `20${yy}`;

                        const url = match[3];
                        // Extract CompetitorID from URL
                        const idMatch = url.match(/competitorid=(\d+)/);
                        if (!idMatch) {
                              console.error(`Invalid URL (no ID): ${url}`);
                              continue;
                        }
                        const competitorId = idMatch[1];

                        // Defaults
                        const sectionData = headerMap[currentSection] || { code: "FIS", dis: "Unknown", sub: "Unknown" };

                        // Check existence
                        const existingIdx = masterData.findIndex(a => a.competitorId === competitorId);

                        if (existingIdx >= 0) {
                              // Update
                              const existing = masterData[existingIdx];
                              // Preserve NameEn, Gender if exist.
                              // Update ProfileURL (user provided might be newer?), Discipline (user provided authoritative?)

                              masterData[existingIdx] = {
                                    ...existing,
                                    name: name, // User provided Korean name
                                    birthYear: fullYear,
                                    profileUrl: url,
                                    subDiscipline: sectionData.sub,
                                    discipline: sectionData.dis,
                                    sectorCode: sectionData.code,
                                    team: existing.team || "대한스키협회" // Default
                              };
                              // console.log(`Updated: ${name}`);
                              updatedCount++;
                        } else {
                              // Create
                              const newAthlete: AthleteMaster = {
                                    name: name,
                                    nameEn: "", // Scraper needs to fill
                                    competitorId: competitorId,
                                    sectorCode: sectionData.code,
                                    discipline: sectionData.dis,
                                    subDiscipline: sectionData.sub,
                                    birthYear: fullYear,
                                    gender: 'Unknown', // Scraper needs to fill
                                    team: "대한스키협회",
                                    profileUrl: url
                              };
                              masterData.push(newAthlete);
                              console.log(`Created New: ${name} (${competitorId})`);
                              createdCount++;
                        }
                  }
            }
      }

      fs.writeFileSync(masterFile, JSON.stringify(masterData, null, 6)); // Indentation 6 per existing? Or 2.
      console.log(`Sync Complete. Updated: ${updatedCount}, Created: ${createdCount}, Total: ${masterData.length}`);
}

main();
