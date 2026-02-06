import { Users, Trophy, TrendingUp } from 'lucide-react';
import type { Athlete } from '../types';
import { CircularProgress } from './CircularProgress';

interface StatsCardsProps {
  athletes: Athlete[];
}

export function StatsCards({ athletes }: StatsCardsProps) {
  const totalAthletes = athletes.length;

  // Calculate Stats - use Set to avoid counting duplicate competitions
  const worldCupCompetitions = new Set<string>();
  let totalCompetitions = 0;
  let podiumFinishes = 0; // Top 3

  athletes.forEach(athlete => {
    const results = athlete.최근10경기 || [];

    results.forEach(perf => {
      totalCompetitions++;

      // Count podium finishes (1st, 2nd, 3rd place)
      const rank = typeof perf.랭킹 === 'number' ? perf.랭킹 : parseInt(String(perf.랭킹));
      if (!isNaN(rank) && rank >= 1 && rank <= 3) {
        podiumFinishes++;
      }

      // @ts-ignore - Handle legacy field just in case
      const cat = perf.category || perf['대회'] || '';
      const category = cat.toLowerCase();

      // Track unique World Cup competitions with date+location to avoid duplicates
      if (category.includes('world cup') || category.includes('wc')) {
        const competitionKey = `${perf.date}-${perf.location}`;
        worldCupCompetitions.add(competitionKey);
      }
    });
  });

  const totalWorldCups = worldCupCompetitions.size;

  // Calculate percentages for circular progress
  const athletePercentage = Math.min(100, (totalAthletes / 50) * 100); // Assume max 50 athletes
  const wcPercentage = Math.min(100, (totalWorldCups / 200) * 100); // Assume max 200 WC events

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <CircularProgress
        value={athletePercentage}
        color="cyan"
        label="국가대표 선수"
        sublabel={`${totalAthletes}명 (2025-2026)`}
        icon={<Users className="text-accent-cyan" size={24} />}
      />

      <CircularProgress
        value={Math.min(100, (totalCompetitions / 2500) * 100)}
        color="purple"
        label="총 경기 결과"
        sublabel={`${totalCompetitions}개 (전체)`}
        icon={<TrendingUp className="text-accent-purple" size={24} />}
      />

      <CircularProgress
        value={Math.min(100, (podiumFinishes / 500) * 100)}
        color="gold"
        label="포디움 (1-3위)"
        sublabel={`${podiumFinishes}회 (메달권)`}
        icon={<Trophy className="text-accent-gold" size={24} />}
      />

      <CircularProgress
        value={wcPercentage}
        color="cyan"
        label="월드컵 대회"
        sublabel={`${totalWorldCups}개 (누적)`}
        icon={<TrendingUp className="text-neon-mint" size={24} />}
      />
    </div>
  );
}
