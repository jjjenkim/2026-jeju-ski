import { TrendingUp, Medal, Activity, Snowflake } from 'lucide-react';

export const Dashboard = () => {
      return (
            <div className="space-y-6">
                  {/* Header Section */}
                  <header className="mb-12 animate-reveal-up">
                        <h1 className="font-display text-7xl md:text-[8rem] leading-[0.85] text-white">
                              BEYOND <span className="text-transparent bg-clip-text bg-gradient-to-r from-kor-red to-white/20">DATA</span>
                        </h1>
                        <div className="mt-6 flex flex-col md:flex-row gap-6 md:items-end justify-between border-l-2 border-kor-blue pl-6">
                              <p className="text-steel text-lg max-w-xl leading-relaxed">
                                    The official intelligence platform for Team Korea Winter 2026.
                                    <br />
                                    Tracking <strong className="text-white">Performance Velocity</strong>, <strong className="text-white">Medal Trajectory</strong>, and <strong className="text-white">Physiological Status</strong>.
                              </p>
                              <div className="flex gap-4">
                                    <StatBadge label="ATHLETES" value="43" />
                                    <StatBadge label="EVENTS" value="12" />
                                    <StatBadge label="D-DAY" value="D-372" color="text-kor-red" />
                              </div>
                        </div>
                  </header>

                  {/* Bento Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-4 h-[1200px] md:h-[600px] animate-reveal-up" style={{ animationDelay: '0.2s' }}>

                        {/* Large Tile: Medal Projection */}
                        <div className="col-span-1 md:col-span-2 md:row-span-2 bg-void-navy border border-white/5 p-8 relative overflow-hidden group">
                              <div className="absolute inset-0 bg-night-ice opacity-40" />
                              <div className="relative z-10 flex flex-col h-full justify-between">
                                    <div>
                                          <div className="flex items-center gap-2 text-kor-red mb-2">
                                                <Medal size={20} />
                                                <span className="text-xs font-bold tracking-widest">PRIMARY OBJECTIVE</span>
                                          </div>
                                          <h3 className="font-display text-4xl text-white">GOLD TRAJECTORY</h3>
                                    </div>

                                    {/* Visual Placeholder for D3/Recharts Graph */}
                                    <div className="flex-1 flex items-center justify-center border border-white/5 bg-dye-black/20 my-6 backdrop-blur-sm">
                                          <span className="text-steel/50 text-sm">[ LIVE PROJECTION GRAPH ]</span>
                                    </div>

                                    <div className="grid grid-cols-3 gap-4 border-t border-white/10 pt-6">
                                          <Metric label="Short Track" value="5" trend="+2" />
                                          <Metric label="Speed" value="2" trend="0" />
                                          <Metric label="Figure" value="1" trend="+1" />
                                    </div>
                              </div>
                        </div>

                        {/* Medium Tile: Velocity */}
                        <div className="col-span-1 md:col-span-2 bg-void-navy border border-white/5 p-8 relative group hover:border-white/10 transition-colors">
                              <div className="flex justify-between items-start mb-6">
                                    <div>
                                          <div className="flex items-center gap-2 text-kor-blue mb-1">
                                                <Activity size={18} />
                                                <span className="text-xs font-bold tracking-widest">TEAM VELOCITY</span>
                                          </div>
                                          <h3 className="font-display text-3xl text-white">SEASON PEAK</h3>
                                    </div>
                                    <div className="text-5xl font-display text-white">92<span className="text-2xl text-steel">%</span></div>
                              </div>
                              <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                                    <div className="h-full bg-gradient-to-r from-kor-blue to-white w-[92%]" />
                              </div>
                        </div>

                        {/* Small Tile: Recent Result */}
                        <div className="col-span-1 bg-void-navy border border-white/5 p-6 flex flex-col justify-between">
                              <div className="flex items-center justify-between text-steel">
                                    <span className="text-xs tracking-widest">LATEST</span>
                                    <Snowflake size={16} />
                              </div>
                              <div>
                                    <div className="text-2xl font-display text-white mb-1">HWANG D.H.</div>
                                    <div className="text-sm text-kor-red font-bold">WR #4 (MOGUL)</div>
                              </div>
                        </div>

                        {/* Small Tile: Status */}
                        <div className="col-span-1 bg-void-navy border border-white/5 p-6 flex flex-col justify-between">
                              <div className="flex items-center justify-between text-steel">
                                    <span className="text-xs tracking-widest">SYSTEM</span>
                                    <TrendingUp size={16} />
                              </div>
                              <div>
                                    <div className="text-2xl font-display text-white mb-1">OPTIMAL</div>
                                    <div className="text-sm text-green-500 font-bold">ALL SYSTEMS GO</div>
                              </div>
                        </div>

                  </div>
            </div>
      );
};

// Micro-Component
const StatBadge = ({ label, value, color = 'text-white' }: { label: string, value: string, color?: string }) => (
      <div>
            <div className={`font-display text-3xl ${color}`}>{value}</div>
            <div className="text-[10px] text-steel tracking-widest">{label}</div>
      </div>
);

const Metric = ({ label, value, trend }: { label: string, value: string, trend: string }) => (
      <div>
            <div className="text-xs text-steel uppercase mb-1">{label}</div>
            <div className="flex items-end gap-2">
                  <span className="text-2xl font-display text-white">{value}</span>
                  <span className={`text-xs font-bold ${trend.includes('+') ? 'text-kor-red' : 'text-steel'}`}>{trend}</span>
            </div>
      </div>
);
