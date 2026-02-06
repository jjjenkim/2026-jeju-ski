import { motion } from 'framer-motion';
import { useAthletes } from '../../hooks/useAthletes';

export const V6_PerformanceAnalysis = () => {
      const { athletes } = useAthletes();

      const SPORT_DISPLAY_EN: Record<string, string> = {
            "freeski": "Freeski",
            "moguls": "Moguls",
            "snowboard_alpine": "Snowboard Alpine",
            "snowboard_cross": "Snowboard Cross",
            "snowboard_park": "Snowboard Park",
            "ski_jumping": "Ski Jumping",
            "cross_country": "Cross Country",
            "alpine_skiing": "Alpine Skiing",
      };

      // Calculate average FIS points per sport for Resource Allocation
      const sportPerformance = athletes.reduce((acc: any, curr) => {
            const sportKey = curr.sport || 'other';
            if (!acc[sportKey]) {
                  acc[sportKey] = { totalPoints: 0, count: 0, sportKey };
            }
            // Use top-level FIS points (now populated by scraper)
            // Fallback to recent_results only if top-level is missing (backward compat)
            let points = curr.fis_points || 0;

            // If points are 0 check recent results
            if (points === 0) {
                  points = (curr.recent_results || []).reduce((sum: number, r: any) => sum + (r.fis_points || 0), 0);
                  const count = (curr.recent_results || []).filter((r: any) => r.fis_points > 0).length;
                  if (count > 0) points = points / count;
            }

            if (points > 0) {
                  acc[sportKey].totalPoints += points;
                  acc[sportKey].count++;
            }
            return acc;
      }, {});

      // Calculate average and map ALL sports to ensure consistency
      const performanceEntries = Object.keys(SPORT_DISPLAY_EN).map(key => {
            const data = sportPerformance[key] || { totalPoints: 0, count: 0 };
            return {
                  sport: SPORT_DISPLAY_EN[key],
                  sportKey: key,
                  avgPoints: data.count > 0 ? data.totalPoints / data.count : 0,
                  athleteCount: data.count
            };
      });

      const maxPoints = Math.max(...performanceEntries.map(x => x.avgPoints), 1);
      const total = athletes.length || 1;

      // Gender Distribution for Squad Demographics
      const maleCount = athletes.filter(a => a.gender === 'M').length;
      const femaleCount = athletes.filter(a => a.gender === 'F').length;
      const malePercent = Math.round((maleCount / (maleCount + femaleCount || 1)) * 100);

      return (
            <section className="px-6 space-y-10 w-full mx-auto py-10" >
                  <div className="flex items-center justify-between mb-8 px-1">
                        <div className="flex flex-col">
                              <h3 className="font-display font-black text-3xl tracking-tight uppercase italic">Performance Analysis</h3>
                        </div>
                        <span className="bg-[var(--primary)] text-white text-[10px] font-black px-3 py-1 rounded-full shadow-[0_0_15px_rgba(255,146,154,0.4)] animate-pulse">LIVE DATA</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* Gender Ratio (Multi-segmented Donut) - UPDATED per PRD */}
                        <motion.div
                              initial={{ opacity: 0, scale: 0.95 }}
                              whileInView={{ opacity: 1, scale: 1 }}
                              className="glass-card p-6 min-h-[280px] flex flex-col justify-between group hover:border-[var(--primary)]/30 transition-all duration-500"
                        >
                              <p className="text-[10px] uppercase font-bold tracking-widest text-gray-400 font-sans">Squad Demographics</p>
                              <div className="relative flex items-center justify-center py-4 h-32">
                                    <svg className="w-24 h-24 -rotate-90" viewBox="0 0 36 36">
                                          <circle cx="18" cy="18" r="15.9" fill="none" stroke="white" strokeWidth="3" strokeOpacity="0.05" />
                                          {/* Male Segment */}
                                          <motion.circle
                                                initial={{ strokeDasharray: "0, 100" }}
                                                whileInView={{ strokeDasharray: `${malePercent}, 100` }}
                                                transition={{ duration: 1.5, delay: 0.2 }}
                                                cx="18" cy="18" r="15.9" fill="none" stroke="#53728A" strokeWidth="3.5" strokeLinecap="round"
                                          />
                                          {/* Female Segment */}
                                          <motion.circle
                                                initial={{ strokeDasharray: "0, 100", strokeDashoffset: 0 }}
                                                whileInView={{ strokeDasharray: `${100 - malePercent}, 100`, strokeDashoffset: -malePercent }}
                                                transition={{ duration: 1.5, delay: 0.4 }}
                                                cx="18" cy="18" r="15.9" fill="none" stroke="var(--primary)" strokeWidth="3.5" strokeLinecap="round"
                                          />
                                    </svg>
                                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                          <span className="text-xl font-black leading-none mb-0.5">{total}</span>
                                          <span className="text-[8px] text-gray-500 uppercase font-bold tracking-tighter">Athletes</span>
                                    </div>
                              </div>
                              <div className="grid grid-cols-2 gap-2 mt-2">
                                    <div className="flex flex-col items-center">
                                          <div className="w-full h-1 bg-[#53728A] rounded-full mb-1"></div>
                                          <span className="text-[8px] text-gray-400 font-bold">남성 {malePercent}%</span>
                                    </div>
                                    <div className="flex flex-col items-center">
                                          <div className="w-full h-1 bg-[var(--primary)] rounded-full mb-1"></div>
                                          <span className="text-[8px] text-white font-bold">여성 {100 - malePercent}%</span>
                                    </div>
                              </div>
                        </motion.div>

                        {/* Resource Allocation (Average FIS Points by Sport) - UPDATED per PRD */}
                        <motion.div
                              initial={{ opacity: 0, scale: 0.95 }}
                              whileInView={{ opacity: 1, scale: 1 }}
                              className="glass-card p-6 min-h-[280px] flex flex-col justify-between group hover:border-[var(--primary)]/30 transition-all duration-500"
                        >
                              <p className="text-[10px] uppercase font-bold tracking-widest text-gray-400 font-sans">Resource Allocation</p>
                              <div className="flex flex-col gap-3 py-2">
                                    {performanceEntries.length > 0 ? performanceEntries.map((entry, i) => (
                                          <div key={i} className="flex flex-col gap-1.5">
                                                <div className="flex justify-between text-[8px] font-black uppercase tracking-widest">
                                                      <span className="text-white/60">{entry.sport}</span>
                                                      <span className="text-[var(--primary)]">{entry.avgPoints.toFixed(1)} pts</span>
                                                </div>
                                                <div className="h-1.5 bg-white/5 rounded-full relative overflow-hidden">
                                                      <motion.div
                                                            initial={{ width: 0 }}
                                                            whileInView={{
                                                                  width: entry.avgPoints > 0
                                                                        ? `${Math.max(5, 100 - (entry.avgPoints / maxPoints) * 80)}%`
                                                                        : "0%"
                                                            }}
                                                            transition={{ duration: 1.2, delay: i * 0.1 }}
                                                            style={{ backgroundColor: i % 2 === 0 ? '#FF929A' : '#53728A' }}
                                                            className="h-full relative shadow-sm"
                                                      />
                                                </div>
                                          </div>
                                    )) : (
                                          <div className="text-center text-gray-500 text-xs py-4">
                                                No FIS points data available
                                          </div>
                                    )}
                              </div>
                              <p className="text-[9px] text-center text-gray-500 font-black uppercase tracking-widest font-sans">Avg FIS Points (Lower = Better)</p>
                        </motion.div>

                        {/* Success Momentum (Real Rank History) - UPDATED per PRD */}
                        <motion.div
                              initial={{ opacity: 0, scale: 0.95 }}
                              whileInView={{ opacity: 1, scale: 1 }}
                              className="glass-card p-6 min-h-[280px] flex flex-col justify-between"
                        >
                              <p className="text-[10px] uppercase font-bold tracking-widest text-gray-400">Success Momentum</p>
                              <div className="h-24 w-full flex items-end mb-4 relative">
                                    {(() => {
                                          // Get rank history from stats (calculated in useAthletes)
                                          const { stats } = useAthletes();
                                          const rankHistory = stats?.rank_history || [];

                                          if (rankHistory.length === 0) {
                                                // Fallback to decorative chart if no data
                                                return (
                                                      <svg className="w-full h-full overflow-visible" viewBox="0 0 100 40" preserveAspectRatio="none">
                                                            <defs>
                                                                  <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                                                                        <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.4" />
                                                                        <stop offset="100%" stopColor="var(--primary)" stopOpacity="0" />
                                                                  </linearGradient>
                                                            </defs>
                                                            <motion.path
                                                                  initial={{ pathLength: 0, opacity: 0 }}
                                                                  whileInView={{ pathLength: 1, opacity: 1 }}
                                                                  transition={{ duration: 2, ease: "easeInOut" }}
                                                                  d="M0,40 C10,38 20,35 30,36 C40,37 50,30 60,20 C70,10 80,5 100,2"
                                                                  fill="none"
                                                                  stroke="var(--primary)"
                                                                  strokeWidth="3"
                                                                  strokeLinecap="round"
                                                                  className="drop-shadow-[0_0_12px_rgba(255,146,154,0.6)]"
                                                            />
                                                            <motion.path
                                                                  initial={{ opacity: 0 }}
                                                                  whileInView={{ opacity: 1 }}
                                                                  transition={{ duration: 3, delay: 0.5 }}
                                                                  d="M0,40 C10,38 20,35 30,36 C40,37 50,30 60,20 C70,10 80,5 100,2 V40 H0 Z"
                                                                  fill="url(#areaGradient)"
                                                            />
                                                      </svg>
                                                );
                                          }

                                          // Calculate path from real data (lower rank = better, so invert Y)
                                          const maxRank = Math.max(...rankHistory.map((d: any) => d.average_rank));
                                          const minRank = Math.min(...rankHistory.map((d: any) => d.average_rank));
                                          const rangeRank = maxRank - minRank || 1;

                                          const points = rankHistory.map((d: any, i: number) => {
                                                const x = (i / (rankHistory.length - 1 || 1)) * 100;
                                                // Invert: lower rank (better) = higher on chart
                                                const y = 40 - ((d.average_rank - minRank) / rangeRank) * 35;
                                                return `${x},${y}`;
                                          }).join(' ');

                                          const pathD = `M${points.split(' ').join(' L')}`;
                                          const areaD = `${pathD} L100,40 L0,40 Z`;

                                          return (
                                                <svg className="w-full h-full overflow-visible" viewBox="0 0 100 40" preserveAspectRatio="none">
                                                      <defs>
                                                            <linearGradient id="realAreaGradient" x1="0" y1="0" x2="0" y2="1">
                                                                  <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.4" />
                                                                  <stop offset="100%" stopColor="var(--primary)" stopOpacity="0" />
                                                            </linearGradient>
                                                      </defs>
                                                      <motion.path
                                                            initial={{ pathLength: 0, opacity: 0 }}
                                                            whileInView={{ pathLength: 1, opacity: 1 }}
                                                            transition={{ duration: 2, ease: "easeInOut" }}
                                                            d={pathD}
                                                            fill="none"
                                                            stroke="var(--primary)"
                                                            strokeWidth="3"
                                                            strokeLinecap="round"
                                                            className="drop-shadow-[0_0_12px_rgba(255,146,154,0.6)]"
                                                      />
                                                      <motion.path
                                                            initial={{ opacity: 0 }}
                                                            whileInView={{ opacity: 1 }}
                                                            transition={{ duration: 3, delay: 0.5 }}
                                                            d={areaD}
                                                            fill="url(#realAreaGradient)"
                                                      />
                                                </svg>
                                          );
                                    })()}
                                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-[var(--primary)] rounded-full animate-ping opacity-75" />
                              </div>
                              <p className="text-[9px] text-center text-gray-400 font-bold uppercase tracking-widest italic">Team Rank Trend (36mo)</p>
                        </motion.div>
                  </div>
            </section >
      );
};
