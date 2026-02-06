import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowLeft, Award } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { Athlete } from '../../types';

interface AthleteProfileModalProps {
      athlete: Athlete | null;
      isOpen: boolean;
      onClose: () => void;
}

export const AthleteProfileModal = ({ athlete, isOpen, onClose }: AthleteProfileModalProps) => {
      const navigate = useNavigate();
      if (!athlete) return null;

      const age = athlete.birth_year ? 2026 - athlete.birth_year : '-';
      const currentRank = athlete.current_rank || 99;

      return (
            <AnimatePresence>
                  {isOpen && (
                        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
                              <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    onClick={onClose}
                                    className="absolute inset-0 bg-black/80 backdrop-blur-md"
                              />

                              <motion.div
                                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                                    animate={{ scale: 1, opacity: 1, y: 0 }}
                                    exit={{ scale: 0.9, opacity: 0, y: 20 }}
                                    className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-[#0a0a0a] rounded-3xl shadow-2xl border border-white/10"
                              >
                                    {/* Header */}
                                    <div className="sticky top-0 z-10 flex items-center justify-between p-4 bg-black/40 backdrop-blur-md border-b border-white/5">
                                          <span className="text-xs font-bold tracking-widest text-white/40 uppercase">Athlete Profile</span>
                                          <div className="flex gap-2">
                                                {athlete.fis_url && (
                                                      <a
                                                            href={athlete.fis_url}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="flex size-10 items-center justify-center rounded-full glass-card hover:bg-white/10 transition-colors"
                                                            title="View FIS Profile"
                                                      >
                                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                                                                  <polyline points="15 3 21 3 21 9" />
                                                                  <line x1="10" y1="14" x2="21" y2="3" />
                                                            </svg>
                                                      </a>
                                                )}
                                                <button
                                                      onClick={() => navigate(-1)}
                                                      className="flex size-10 items-center justify-center rounded-full glass-card hover:bg-[var(--primary)] hover:text-white transition-all group"
                                                      title="Go Back"
                                                >
                                                      <ArrowLeft size={18} className="group-active:scale-90 transition-transform" />
                                                </button>
                                                <button
                                                      onClick={onClose}
                                                      className="flex size-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-[var(--primary)] transition-all active:scale-90"
                                                      title="Close Profile"
                                                >
                                                      <X size={20} />
                                                </button>
                                          </div>
                                    </div>

                                    {/* Hero Section */}
                                    <div className="relative h-[320px] w-full">
                                          <div className="absolute inset-0 bg-cover bg-center"
                                                style={{ backgroundImage: `url('https://images.unsplash.com/photo-1551698618-1fedfeadfe52?q=80&w=2070&auto=format&fit=crop')` }}>
                                          </div>
                                          <div className="absolute inset-0 hero-gradient"></div>

                                          <div className="absolute bottom-0 left-0 p-6 w-full">
                                                <div className="flex items-center gap-2 mb-2">
                                                      <span className="inline-block px-3 py-1 bg-[var(--primary)] text-[10px] font-bold tracking-widest rounded-full uppercase">
                                                            Team Korea
                                                      </span>
                                                      {athlete.status && (
                                                            <span className="inline-block px-3 py-1 bg-green-500/20 text-green-400 border border-green-500/30 text-[10px] font-bold tracking-widest rounded-full uppercase">
                                                                  {athlete.status}
                                                            </span>
                                                      )}
                                                </div>
                                                <motion.h1
                                                      initial={{ opacity: 0, y: 20 }}
                                                      animate={{ opacity: 1, y: 0 }}
                                                      transition={{ delay: 0.1 }}
                                                      className="text-2xl sm:text-4xl font-extrabold tracking-tighter mb-1 uppercase italic font-display leading-tight"
                                                >
                                                      {athlete.name_ko}
                                                </motion.h1>
                                                <motion.p
                                                      initial={{ opacity: 0 }}
                                                      animate={{ opacity: 1 }}
                                                      transition={{ delay: 0.2 }}
                                                      className="text-white/70 text-sm font-medium"
                                                >
                                                      {athlete.name_en}
                                                </motion.p>
                                                <motion.p
                                                      initial={{ opacity: 0 }}
                                                      animate={{ opacity: 1 }}
                                                      transition={{ delay: 0.3 }}
                                                      className="text-white/50 text-xs mt-1"
                                                >
                                                      {athlete.sport_display}
                                                </motion.p>
                                          </div>
                                    </div>

                                    {/* Quick Stats Grid */}
                                    <div className="grid grid-cols-4 gap-3 px-6 -mt-8 relative z-10">
                                          {[
                                                { label: '나이', value: age },
                                                { label: '랭킹', value: currentRank },
                                                { label: '성별', value: athlete.gender === 'M' ? '남' : '여' },
                                                { label: '소속', value: 'KOR' }
                                          ].map((item, idx) => (
                                                <motion.div
                                                      key={idx}
                                                      initial={{ opacity: 0, y: 20 }}
                                                      animate={{ opacity: 1, y: 0 }}
                                                      transition={{ delay: 0.3 + idx * 0.05 }}
                                                      className="glass-card rounded-xl p-3 flex flex-col items-center justify-center shadow-lg"
                                                >
                                                      <span className="text-white/40 text-[9px] uppercase font-bold tracking-tighter mb-1">{item.label}</span>
                                                      <span className="text-base font-bold">{item.value}</span>
                                                </motion.div>
                                          ))}
                                    </div>

                                    {/* Season Performance */}
                                    <div className="px-6 pt-8 pb-4">
                                          <h2 className="text-lg font-bold tracking-tight border-l-4 border-[var(--primary)] pl-4 uppercase italic font-display">
                                                Season Performance
                                          </h2>
                                    </div>

                                    <div className="px-6 mb-8">
                                          <motion.div
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className="bg-[#141414] rounded-2xl p-5 border border-white/5 shadow-xl"
                                          >
                                                <div className="flex justify-between items-end mb-6">
                                                      <div>
                                                            <p className="text-white/40 text-[10px] font-bold mb-1 uppercase tracking-widest">Global Rank</p>
                                                            <p className="text-4xl font-black text-white italic">
                                                                  #{currentRank}
                                                            </p>
                                                      </div>
                                                      <div className="text-right">
                                                            <p className="text-white/40 text-[10px] font-bold mb-1 uppercase tracking-widest">FIS Code</p>
                                                            <p className="text-lg font-black text-secondary italic">{athlete.fis_code}</p>
                                                      </div>
                                                </div>

                                                {/* Sparkline */}
                                                <div className="relative h-24 w-full mb-4">
                                                      <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 100">
                                                            <motion.path
                                                                  initial={{ pathLength: 0 }}
                                                                  animate={{ pathLength: 1 }}
                                                                  transition={{ duration: 1.5 }}
                                                                  d="M0,80 Q10,75 20,60 T40,40 T60,50 T80,20 T100,10"
                                                                  fill="none"
                                                                  stroke="var(--primary)"
                                                                  strokeWidth="3"
                                                                  strokeLinecap="round"
                                                            />
                                                      </svg>
                                                </div>

                                                <div className="flex justify-between text-[9px] text-white/30 font-bold uppercase tracking-[0.2em]">
                                                      {['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'].map(m => <span key={m}>{m}</span>)}
                                                </div>
                                          </motion.div>
                                    </div>

                                    {/* Recent Results */}
                                    <div className="px-6 pb-8">
                                          <h2 className="text-lg font-bold tracking-tight border-l-4 border-[var(--primary)] pl-4 mb-4 uppercase italic font-display">
                                                Recent Results
                                          </h2>
                                          <div className="space-y-3">
                                                {([...(athlete.recent_results || [])].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5)).map((result, idx) => (
                                                      <motion.a
                                                            key={idx}
                                                            href={athlete.fis_url}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            initial={{ opacity: 0, x: -10 }}
                                                            animate={{ opacity: 1, x: 0 }}
                                                            transition={{ delay: idx * 0.05 }}
                                                            className="block group"
                                                      >
                                                            <div className="flex items-center gap-4 bg-[#141414] p-4 rounded-xl border border-white/5 hover:bg-white/[0.05] hover:border-[var(--primary)]/30 transition-all">
                                                                  <div className={`flex shrink-0 size-10 items-center justify-center rounded-lg bg-white/5 ${result.rank === 1 ? 'text-yellow-500' :
                                                                        result.rank === 2 ? 'text-slate-400' :
                                                                              result.rank === 3 ? 'text-amber-700' :
                                                                                    'text-[var(--primary)]'
                                                                        }`}>
                                                                        <Award size={20} />
                                                                  </div>
                                                                  <div className="flex-1 min-w-0 pr-2">
                                                                        <div className="flex items-center gap-2">
                                                                              <p className="text-sm font-bold uppercase italic truncate">{result.category}</p>
                                                                        </div>
                                                                        <p className="text-[10px] text-white/40 font-medium mt-0.5 truncate">
                                                                              {result.date} • {result.place}
                                                                        </p>
                                                                  </div>
                                                                  <div className="text-right shrink-0">
                                                                        <p className="text-lg font-black text-white">#{result.rank}</p>
                                                                        <p className="text-[9px] text-white/30 uppercase tracking-widest">Rank</p>
                                                                  </div>
                                                            </div>
                                                      </motion.a>
                                                ))}
                                          </div>
                                    </div>
                              </motion.div>
                        </div>
                  )}
            </AnimatePresence>
      );
};
