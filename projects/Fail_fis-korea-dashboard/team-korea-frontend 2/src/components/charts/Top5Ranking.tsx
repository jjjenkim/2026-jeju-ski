// src/components/charts/Top5Ranking.tsx
import { Athlete } from '../../types';
import { motion } from 'framer-motion';

interface Top5RankingProps {
  athletes: Athlete[];
}

export const Top5Ranking = ({ athletes }: Top5RankingProps) => {
  const topAthletes = athletes
    .filter((a) => a.current_rank && a.current_rank > 0)
    .sort((a, b) => (a.current_rank || 999) - (b.current_rank || 999))
    .slice(0, 5);

  const getMedalEmoji = (rank: number) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return '';
  };

  const getMedalClass = (rank: number) => {
    if (rank === 1) return 'badge-gold';
    if (rank === 2) return 'badge-silver';
    if (rank === 3) return 'badge-bronze';
    return '';
  };

  if (topAthletes.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        랭킹 데이터가 없습니다
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {topAthletes.map((athlete, index) => (
        <motion.div
          key={athlete.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
          className="flex items-center justify-between p-3 rounded-lg bg-white/50 hover:bg-white/70 transition cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <span className="text-2xl font-bold text-korea-red min-w-[60px]">
              #{athlete.current_rank}
            </span>
            <div>
              <p className="font-semibold">{athlete.name_ko}</p>
              <p className="text-sm text-gray-600">{athlete.sport_display}</p>
            </div>
          </div>
          {athlete.current_rank && athlete.current_rank <= 3 && (
            <span className={`badge ${getMedalClass(athlete.current_rank)}`}>
              {getMedalEmoji(athlete.current_rank)}
            </span>
          )}
        </motion.div>
      ))}
    </div>
  );
};
