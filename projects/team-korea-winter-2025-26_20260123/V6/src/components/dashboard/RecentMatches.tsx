import { useState } from 'react';
import { motion } from 'framer-motion';
import { Award } from 'lucide-react';
import type { Athlete } from '../../types';
import { AthleteProfileModal } from '../common/AthleteProfileModal';

interface Props {
      athletes: Athlete[];
}

export const RecentMatches = ({ athletes }: Props) => {
      const [selectedAthlete, setSelectedAthlete] = useState<Athlete | null>(null);

      // Get recent top performers based on current rank
      const topPerformers = athletes
            .filter(a => a.current_rank && a.current_rank <= 20)
            .sort((a, b) => (a.current_rank || 999) - (b.current_rank || 999))
            .slice(0, 6);

      return (
            <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {topPerformers.map((athlete, idx) => {
                              const latestResult = athlete.recent_results?.[athlete.recent_results.length - 1];

                              return (
                                    <motion.div
                                          key={athlete.id}
                                          initial={{ opacity: 0, y: 20 }}
                                          whileInView={{ opacity: 1, y: 0 }}
                                          transition={{ delay: idx * 0.1 }}
                                          onClick={() => setSelectedAthlete(athlete)}
                                          className="glass-card p-5 cursor-pointer hover:bg-white/5 transition-all group"
                                    >
                                          <div className="flex items-start justify-between mb-4">
                                                <div className="flex-1 min-w-0 pr-2">
                                                      <h4 className="font-bold text-white group-hover:text-[var(--primary)] transition-colors text-lg font-display truncate">
                                                            {athlete.name_ko}
                                                      </h4>
                                                      <p className="text-xs text-white/50 mt-0.5 font-sans truncate">{athlete.name_en}</p>
                                                      <div className="flex items-center gap-2 text-xs text-gray-400 mt-2">
                                                            <span className="bg-white/10 px-2 py-0.5 rounded text-[10px] font-bold uppercase whitespace-nowrap">
                                                                  {athlete.sport_display}
                                                            </span>
                                                      </div>
                                                </div>
                                                <div className={`flex shrink-0 size-12 items-center justify-center rounded-xl ${athlete.current_rank === 1 ? 'bg-yellow-500/20 text-yellow-500' :
                                                      athlete.current_rank === 2 ? 'bg-slate-400/20 text-slate-400' :
                                                            athlete.current_rank === 3 ? 'bg-amber-700/20 text-amber-700' :
                                                                  'bg-white/5 text-[var(--primary)]'
                                                      }`}>
                                                      <Award size={24} />
                                                </div>
                                          </div>

                                          {latestResult && (
                                                <div className="pt-3 border-t border-white/5">
                                                      <div className="flex items-center justify-between">
                                                            <div>
                                                                  <p className="text-[10px] text-white/40 uppercase tracking-widest mb-1">Latest Result</p>
                                                                  <p className="text-sm font-bold text-white">#{latestResult.rank}</p>
                                                            </div>
                                                            <div className="text-right">
                                                                  <p className="text-[10px] text-white/40 uppercase tracking-widest mb-1">Global Rank</p>
                                                                  <p className="text-sm font-bold text-secondary">#{athlete.current_rank}</p>
                                                            </div>
                                                      </div>
                                                </div>
                                          )}
                                    </motion.div>
                              );
                        })}
                  </div>

                  <AthleteProfileModal
                        athlete={selectedAthlete}
                        isOpen={!!selectedAthlete}
                        onClose={() => setSelectedAthlete(null)}
                  />
            </>
      );
};
