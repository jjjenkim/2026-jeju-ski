import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';

interface Props {
      stats: any;
}

const COLORS = ['#C60C30', '#003478', '#148CFF', '#FFD700', '#5D5FEF', '#FF4747', '#03DAC6'];

export const DistributionCharts = ({ stats }: Props) => {
      if (!stats) return null;

      // Prepare Data for Charts
      const sportData = Object.entries(stats.by_sport || {}).map(([name, value]) => ({ name: name.split('-')[0].trim(), value }));
      const teamData = Object.entries(stats.by_team || {}).map(([name, value]) => ({ name, value }));
      const ageData = [
            { name: 'Teens', value: stats.age_distribution.teens },
            { name: '20s', value: stats.age_distribution.twenties },
            { name: '30s', value: stats.age_distribution.thirties },
      ];

      return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* 1. Sport Distribution (Donut) */}
                  <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                        className="glass-panel p-6 rounded-3xl"
                  >
                        <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-4">Discipline Ratio</h3>
                        <div className="h-[180px] w-full relative">
                              <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                          <Pie
                                                data={sportData}
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={50}
                                                outerRadius={70}
                                                paddingAngle={5}
                                                dataKey="value"
                                                stroke="none"
                                          >
                                                {sportData.map((entry, index) => (
                                                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                ))}
                                          </Pie>
                                          <Tooltip
                                                contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', borderRadius: '12px', border: 'none', color: '#fff' }}
                                                itemStyle={{ color: '#fff', fontSize: '12px', fontWeight: 'bold' }}
                                          />
                                    </PieChart>
                              </ResponsiveContainer>
                              {/* Center Text */}
                              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                    <div className="text-center">
                                          <span className="block text-2xl font-black text-white">{stats.total_athletes}</span>
                                          <span className="text-[9px] text-gray-400 uppercase font-bold">Athletes</span>
                                    </div>
                              </div>
                        </div>
                  </motion.div>

                  {/* 2. Team Size (Bar) */}
                  <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="glass-panel p-6 rounded-3xl"
                  >
                        <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-4">Team Composition</h3>
                        <div className="h-[180px] w-full">
                              <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={teamData} layout="vertical" margin={{ top: 0, right: 30, left: 20, bottom: 0 }}>
                                          <XAxis type="number" hide />
                                          <YAxis dataKey="name" type="category" width={80} tick={{ fill: '#9CA3AF', fontSize: 10, fontWeight: 'bold' }} axisLine={false} tickLine={false} />
                                          <Tooltip
                                                cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                                                contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', borderRadius: '12px', border: 'none' }}
                                                itemStyle={{ color: '#fff' }}
                                          />
                                          <Bar dataKey="value" fill="#003478" radius={[0, 4, 4, 0]} barSize={20}>
                                                {teamData.map((entry, index) => {
                                                      const isMax = entry.value === Math.max(...teamData.map(d => d.value));
                                                      return <Cell key={`cell-${index}`} fill={isMax ? '#C60C30' : '#003478'} />;
                                                })}
                                          </Bar>
                                    </BarChart>
                              </ResponsiveContainer>
                        </div>
                  </motion.div>

                  {/* 3. Age Distribution (Histogram-like) */}
                  <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="glass-panel p-6 rounded-3xl"
                  >
                        <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-4">Age Demographics</h3>
                        <div className="h-[180px] w-full flex items-end justify-between px-4 pb-2">
                              {ageData.map((d, i) => (
                                    <div key={i} className="flex flex-col items-center gap-2 w-1/3 group">
                                          <div className="relative w-full flex justify-center">
                                                <motion.div
                                                      initial={{ height: 0 }}
                                                      whileInView={{ height: `${(d.value / Math.max(...ageData.map(x => x.value))) * 120}px` }}
                                                      transition={{ duration: 1, delay: 0.3 + (i * 0.1) }}
                                                      className={`w-12 rounded-t-lg bg-gradient-to-t ${i === 1 ? 'from-secondary to-secondary/50' : 'from-gray-700 to-gray-600'}`} // Highlight 20s as main
                                                >
                                                      <div className="absolute -top-6 left-0 right-0 text-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                            <span className="text-xs font-black text-white">{d.value}</span>
                                                      </div>
                                                </motion.div>
                                          </div>
                                          <span className="text-[10px] font-bold text-gray-400 uppercase">{d.name}</span>
                                    </div>
                              ))}
                        </div>
                  </motion.div>
            </div>
      );
};
