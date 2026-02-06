import { motion, AnimatePresence } from 'framer-motion';
import { useAthletes } from '../hooks/useAthletes';
import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

// Utility to parse YYYY-MM-DD format from our transformed data
const parseFISDate = (dateStr: string): Date => {
      if (!dateStr) return new Date();
      // Handle YYYY-MM-DD format
      const [year, month, day] = dateStr.split('-').map(Number);
      return new Date(year, month - 1, day);
};

export const V6_ResultsPage = () => {
      const { athletes } = useAthletes();
      const [selectedCategory, setSelectedCategory] = useState('All');
      const [selectedResult, setSelectedResult] = useState<any>(null);
      const [currentPage, setCurrentPage] = useState(1);
      const navigate = useNavigate();
      const itemsPerPage = 12;

      const categories = ['All', 'Snowboard', 'Freeski', 'Moguls', 'Alpine', 'Cross Country'];

      const allResults = useMemo(() => {
            const flattened = athletes.flatMap(a =>
                  (a.recent_results || []).map(r => ({
                        ...r,
                        athleteName: a.name_ko,
                        athleteId: a.id || a.fis_code,
                        disciplineDisplay: r.discipline || (a as any).detail_discipline || a.sport_display,
                        sport: a.sport
                  }))
            );

            return flattened
                  .filter(r => {
                        if (selectedCategory === 'All') return true;
                        const cat = selectedCategory.toLowerCase().replace(' ', '_');
                        return r.sport?.toLowerCase().includes(cat);
                  })
                  .filter(r => r.rank != null)  // Only show results with valid ranks
                  .sort((a, b) => parseFISDate(b.date).getTime() - parseFISDate(a.date).getTime());
      }, [athletes, selectedCategory]);

      return (
            <div className="min-h-screen bg-[#0a0a0b] text-white selection:bg-primary/30 antialiased pb-32">
                  <main className="max-w-7xl mx-auto px-6 py-10 space-y-8">
                        {/* Header Section */}
                        <header className="space-y-6 pt-4">
                              <div className="flex items-center justify-between">
                                    <div>
                                          <motion.h1
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                className="text-3xl font-display font-black italic tracking-tighter text-white mb-1 uppercase"
                                          >
                                                Competition
                                          </motion.h1>
                                    </div>
                              </div>

                              <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide no-scrollbar pt-2">
                                    {categories.map((cat, i) => (
                                          <motion.button
                                                key={cat}
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: i * 0.05 }}
                                                onClick={() => setSelectedCategory(cat)}
                                                className={`px-5 py-2.5 rounded-full text-[11px] font-bold border transition-all duration-300 whitespace-nowrap uppercase italic
                                                      ${selectedCategory === cat
                                                            ? 'bg-white text-black border-white shadow-[0_0_20px_rgba(255,255,255,0.2)] scale-105 select-none'
                                                            : 'bg-white/5 border-white/10 text-gray-500 hover:bg-white/10 hover:text-gray-300 active:scale-95'}`}
                                          >
                                                {cat}
                                          </motion.button>
                                    ))}
                              </div>
                        </header>

                        {/* High-Impact Results Feed */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6 max-w-7xl mx-auto">
                              <AnimatePresence mode="popLayout">
                                    {allResults.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((item, idx) => (
                                          <motion.div
                                                key={`${item.athleteId}-${item.date}-${idx}`}
                                                layout
                                                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                                exit={{ opacity: 0, scale: 0.95, y: -20 }}
                                                transition={{ duration: 0.4, delay: idx * 0.03 }}
                                                className="glass-card relative p-3 sm:p-8 rounded-[2.5rem] border-white/5 group hover:bg-white/[0.04] transition-all cursor-pointer"
                                                onClick={() => setSelectedResult(item)}
                                          >
                                                {/* Background Accent for Top 3 */}
                                                {item.rank <= 3 && (
                                                      <div className={`absolute -right-10 -top-10 size-40 blur-3xl opacity-10 rounded-full
                                                            ${item.rank === 1 ? 'bg-yellow-500' : item.rank === 2 ? 'bg-slate-300' : 'bg-orange-700'}`}
                                                      />
                                                )}

                                                <div className="flex flex-wrap sm:flex-nowrap items-center gap-1.5 sm:gap-8 relative z-10 w-full sm:justify-between h-auto">
                                                      {/* 1. Date (Leftmost) */}
                                                      <div className="shrink-0 flex flex-col items-center justify-center bg-white/5 rounded-3xl p-1.5 sm:p-6 border border-white/10 min-w-[50px] sm:min-w-[140px] group-hover:bg-white/10 transition-all duration-300 shadow-2xl">
                                                            <span className="text-[10px] sm:text-base text-gray-500 font-bold uppercase tracking-tighter">
                                                                  {parseFISDate(item.date).toLocaleDateString('en-US', { month: 'short' })}
                                                            </span>
                                                            <span className="text-2xl sm:text-6xl font-black italic text-white leading-none my-0.5 sm:my-2">
                                                                  {parseFISDate(item.date).getDate()}
                                                            </span>
                                                            <span className="text-[9px] sm:text-sm text-[var(--primary)] font-black italic">
                                                                  {parseFISDate(item.date).getFullYear()}
                                                            </span>
                                                      </div>

                                                      {/* 2 & 3 & 4. Details Group (Place, Category, Discipline) */}
                                                      <div className="flex flex-col gap-0.5 pr-1 sm:pr-0 shrink-0 max-w-[30%] sm:max-w-none overflow-hidden sm:flex-1 sm:items-start sm:ml-4">
                                                            <div className="flex flex-col overflow-hidden sm:gap-1">
                                                                  <span className="text-[9px] sm:text-2xl text-gray-300 font-bold uppercase tracking-tight truncate leading-tight">
                                                                        {item.place}
                                                                  </span>
                                                                  <span className="text-[7px] sm:text-lg text-gray-500 font-bold uppercase tracking-widest truncate leading-tight opacity-70">
                                                                        {item.category}
                                                                  </span>
                                                            </div>
                                                            <div className="flex items-center gap-1.5 mt-1 overflow-hidden">
                                                                  <span className="text-[8px] sm:text-sm px-1.5 py-0.5 rounded-full bg-white/10 text-gray-400 font-bold uppercase tracking-wider whitespace-nowrap">
                                                                        <span className="sm:hidden">{item.sport?.replace('snowboard_', 'SB-').replace('freeski', 'FS').replace('alpine_skiing', 'Alpine').replace('cross_country', 'XC').replace('_', ' ').toUpperCase() || 'SKI'}</span>
                                                                        <span className="hidden sm:inline">{item.sport?.replace('snowboard_', 'Snowboard ').replace('freeski', 'Freeski').replace('alpine_skiing', 'Alpine Skiing').replace('cross_country', 'Cross Country').replace('_', ' ').toUpperCase() || 'SKI'}</span>
                                                                  </span>
                                                                  <span className="size-0.5 rounded-full bg-white/20 shrink-0" />
                                                                  <span className="text-[9px] sm:text-lg text-[var(--primary)] font-black uppercase italic tracking-tighter truncate">
                                                                        {item.disciplineDisplay}
                                                                  </span>
                                                            </div>
                                                      </div>

                                                      {/* 5. Rank (Number Only) */}
                                                      {/* 5. Rank (Number Only) - Desktop: Grouped with Name on Right */}
                                                      <div className="shrink-0 flex items-center justify-center relative px-1 sm:px-0 sm:order-3">
                                                            <span className={`text-xl sm:text-4xl font-black italic tabular-nums leading-none z-10 sm:mr-6
                                                                  ${item.rank === 1 ? 'text-yellow-400 drop-shadow-[0_0_15px_rgba(250,204,21,0.6)]' :
                                                                        item.rank === 2 ? 'text-slate-300 drop-shadow-[0_0_10px_rgba(203,213,225,0.4)]' :
                                                                              item.rank === 3 ? 'text-amber-700 drop-shadow-[0_0_10px_rgba(180,83,9,0.4)]' : 'text-white/40'}`}>
                                                                  {item.rank}
                                                            </span>
                                                      </div>

                                                      <div className="flex-1 min-w-[60px] flex justify-end pl-1 sm:pl-0 sm:flex-none sm:order-4 z-20">
                                                            <h2 className="font-black text-xs sm:text-3xl text-white uppercase italic tracking-tighter text-right group-hover:text-[var(--primary)] transition-colors leading-tight whitespace-normal break-keep sm:whitespace-nowrap">
                                                                  {item.athleteName}
                                                            </h2>
                                                      </div>
                                                </div>
                                          </motion.div>
                                    ))}
                              </AnimatePresence>
                        </div>

                        {/* Pagination */}
                        <div className="flex flex-col items-center gap-6 mt-12 mb-20">
                              <span className="text-[10px] font-black italic text-gray-500 uppercase tracking-widest opacity-60">
                                    Page {currentPage} of {Math.ceil(allResults.length / itemsPerPage)}
                              </span>
                              <div className="flex gap-3">
                                    <button
                                          onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                          className="size-12 rounded-2xl glass-card flex items-center justify-center text-gray-400 border-white/5 hover:bg-white/5 disabled:opacity-20 active:scale-90 transition-all"
                                          disabled={currentPage === 1}
                                    >
                                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M15 18l-6-6 6-6" /></svg>
                                    </button>

                                    {[...Array(Math.min(5, Math.ceil(allResults.length / itemsPerPage)))].map((_, i) => (
                                          <button
                                                key={i}
                                                onClick={() => setCurrentPage(i + 1)}
                                                className={`size-12 rounded-2xl font-black text-sm italic transition-all duration-300 shadow-2xl
                                                       ${currentPage === i + 1
                                                            ? 'bg-white text-black scale-110'
                                                            : 'glass-card text-gray-400 border-white/5 hover:bg-white/5'}`}
                                          >
                                                {i + 1}
                                          </button>
                                    ))}

                                    <button
                                          onClick={() => setCurrentPage(prev => Math.min(Math.ceil(allResults.length / itemsPerPage), prev + 1))}
                                          className="size-12 rounded-2xl glass-card flex items-center justify-center text-gray-400 border-white/5 hover:bg-white/5 disabled:opacity-20 active:scale-90 transition-all"
                                          disabled={currentPage === Math.ceil(allResults.length / itemsPerPage)}
                                    >
                                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M9 18l6-6-6-6" /></svg>
                                    </button>
                              </div>
                        </div>
                  </main>

                  {/* Detail Modal - Optimized for V6 */}
                  <AnimatePresence>
                        {selectedResult && (
                              <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 sm:p-0">
                                    <motion.div
                                          initial={{ opacity: 0 }}
                                          animate={{ opacity: 1 }}
                                          exit={{ opacity: 0 }}
                                          onClick={() => setSelectedResult(null)}
                                          className="absolute inset-0 bg-black/90 backdrop-blur-md"
                                    />
                                    <motion.div
                                          initial={{ scale: 0.9, opacity: 0, y: 30 }}
                                          animate={{ scale: 1, opacity: 1, y: 0 }}
                                          exit={{ scale: 0.9, opacity: 0, y: 30 }}
                                          className="glass-card w-full max-w-[360px] p-8 relative overflow-hidden ring-1 ring-white/10"
                                    >
                                          {/* Decorative Background Labels */}
                                          <div className="absolute top-0 right-0 p-6 opacity-[0.03] text-8xl font-black italic select-none">M2026</div>

                                          <div className="space-y-8 relative z-10">
                                                <header>
                                                      <p className="text-[10px] text-[var(--primary)] font-black uppercase tracking-[0.3em] mb-2 italic">Official Record</p>
                                                      <h2 className="text-3xl font-black italic uppercase tracking-tighter text-white">{selectedResult.athleteName}</h2>
                                                      <div className="flex items-center gap-2 mt-1">
                                                            <div className="size-2 rounded-full bg-green-500 animate-pulse" />
                                                            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest leading-none">{selectedResult.disciplineDisplay}</p>
                                                      </div>
                                                </header>

                                                <div className="grid grid-cols-2 gap-4">
                                                      <div className="p-4 bg-white/5 rounded-[2rem] border border-white/10 group hover:bg-white/10 transition-colors">
                                                            <p className="text-[9px] text-gray-500 font-bold uppercase mb-1">Race Rank</p>
                                                            <p className={`text-3xl font-black italic ${selectedResult.rank <= 3 ? 'text-[var(--primary)]' : 'text-white'}`}>
                                                                  {selectedResult.rank}
                                                            </p>
                                                      </div>
                                                      <div className="p-4 bg-white/5 rounded-[2rem] border border-white/10">
                                                            <p className="text-[9px] text-gray-500 font-bold uppercase mb-1">FIS Points</p>
                                                            <p className="text-3xl font-black italic text-[var(--secondary)]">
                                                                  {selectedResult.fis_points?.toFixed(1) || '0.0'}
                                                            </p>
                                                      </div>
                                                </div>

                                                <div className="space-y-5">
                                                      <div className="p-5 bg-white/5 rounded-[2.5rem] border border-white/5">
                                                            <div className="space-y-4">
                                                                  <div>
                                                                        <p className="text-[9px] text-gray-500 font-bold uppercase mb-1.5 tracking-tighter opacity-60">Competition Category</p>
                                                                        <p className="text-sm font-black text-white uppercase italic tracking-tighter leading-tight">{selectedResult.category}</p>
                                                                  </div>
                                                                  <div className="flex justify-between items-end border-t border-white/5 pt-4">
                                                                        <div>
                                                                              <p className="text-[9px] text-gray-500 font-bold uppercase mb-1 tracking-tighter opacity-60">Venue</p>
                                                                              <p className="text-[11px] font-bold text-gray-300 uppercase leading-none">{selectedResult.place}</p>
                                                                        </div>
                                                                        <div className="text-right">
                                                                              <p className="text-[9px] text-gray-500 font-bold uppercase mb-1 tracking-tighter opacity-60">Date</p>
                                                                              <p className="text-[11px] font-black text-[var(--primary)]">{selectedResult.date}</p>
                                                                        </div>
                                                                  </div>
                                                            </div>
                                                      </div>
                                                </div>

                                                <div className="flex gap-3">
                                                      <button
                                                            onClick={() => {
                                                                  setSelectedResult(null);
                                                                  navigate(`/athletes?id=${selectedResult.athleteId}`);
                                                            }}
                                                            className="flex-1 py-4 bg-[var(--primary)] text-white font-black text-[11px] uppercase italic rounded-[2rem] hover:bg-white hover:text-black transition-all shadow-xl active:scale-95"
                                                      >
                                                            View Athlete Profile
                                                      </button>
                                                      <button
                                                            onClick={() => setSelectedResult(null)}
                                                            className="px-6 py-4 bg-white/5 text-gray-400 font-black text-[11px] uppercase italic rounded-[2rem] hover:bg-white/10 hover:text-white transition-all active:scale-95"
                                                      >
                                                            Close
                                                      </button>
                                                </div>
                                          </div>
                                    </motion.div>
                              </div>
                        )}
                  </AnimatePresence>
            </div>
      );
};
