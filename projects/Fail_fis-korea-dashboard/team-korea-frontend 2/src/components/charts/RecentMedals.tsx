// src/components/charts/RecentMedals.tsx
import { Athlete } from '../../types';
import { motion } from 'framer-motion';

interface RecentMedalsProps {
  athletes: Athlete[];
}

export const RecentMedals = ({ athletes }: RecentMedalsProps) => {
  const athletesWithMedals = athletes
    .filter((a) => a.medals.gold + a.medals.silver + a.medals.bronze > 0)
    .sort((a, b) => {
      const totalA = a.medals.gold * 3 + a.medals.silver * 2 + a.medals.bronze;
      const totalB = b.medals.gold * 3 + b.medals.silver * 2 + b.medals.bronze;
      return totalB - totalA;
    })
    .slice(0, 6);

  if (athletesWithMedals.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        메달 데이터가 없습니다
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3">
      {athletesWithMedals.map((athlete, index) => (
        <motion.div
          key={athlete.id}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.1 }}
          className="p-3 rounded-lg bg-white/50 hover:bg-white/70 transition cursor-pointer"
        >
          <p className="font-semibold text-sm mb-2 truncate">{athlete.name_ko}</p>
          <div className="flex flex-wrap gap-1">
            {athlete.medals.gold > 0 && (
              <span className="badge badge-gold text-xs">
                🥇 {athlete.medals.gold}
              </span>
            )}
            {athlete.medals.silver > 0 && (
              <span className="badge badge-silver text-xs">
                🥈 {athlete.medals.silver}
              </span>
            )}
            {athlete.medals.bronze > 0 && (
              <span className="badge badge-bronze text-xs">
                🥉 {athlete.medals.bronze}
              </span>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  );
};
