import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAthletes } from '../hooks/useAthletes';
import { AthleteProfileModal } from '../components/common/AthleteProfileModal';
import { useSearchParams } from 'react-router-dom';
import type { Athlete } from '../types';

const SPORT_ORDER = ['alpine_skiing', 'cross_country', 'freeski', 'moguls', 'ski_jumping', 'snowboard_alpine', 'snowboard_cross', 'snowboard_park'];

const SPORT_DISPLAY_KR: Record<string, string> = {
      'alpine_skiing': '알파인 스키',
      'cross_country': '크로스컨트리',
      'freeski': '프리스키',
      'moguls': '모굴',
      'ski_jumping': '스키점프',
      'snowboard_alpine': '스노보드 알파인',
      'snowboard_cross': '스노보드 크로스',
      'snowboard_park': '스노보드 파크'
};

export const V6_AthletesPage = () => {
      const { athletes } = useAthletes();
      const [selectedAthlete, setSelectedAthlete] = useState<Athlete | null>(null);
      const [selectedSport, setSelectedSport] = useState<string>('all');
      const [searchParams, setSearchParams] = useSearchParams();

      // Handle deep linking for athletes
      useEffect(() => {
            const athleteId = searchParams.get('id');
            if (athleteId && athletes.length > 0) {
                  const athlete = athletes.find(a => String(a.id) === athleteId || String(a.fis_code) === athleteId);
                  if (athlete) {
                        setSelectedAthlete(athlete);
                  }
            } else if (!athleteId) {
                  setSelectedAthlete(null);
            }
      }, [searchParams, athletes]);

      // Group athletes by sport
      const athletesBySport = athletes.reduce((acc, athlete) => {
            if (!acc[athlete.sport]) {
                  acc[athlete.sport] = [];
            }
            acc[athlete.sport].push(athlete);
            return acc;
      }, {} as Record<string, Athlete[]>);

      // Get filtered athletes
      const filteredAthletes = selectedSport === 'all'
            ? athletes
            : athletesBySport[selectedSport] || [];

      // Get available sports
      const availableSports = SPORT_ORDER.filter(sport => athletesBySport[sport]?.length > 0);

      return (
            <div className="min-h-screen bg-[#050505] text-white pb-32">
                  {/* Top Header - Brand Consistency with Dashboard */}
                  <header className="fixed top-0 left-0 right-0 z-50 p-4 bg-black/20 backdrop-blur-md border-b border-white/5">
                        <div className="max-w-7xl mx-auto flex items-center justify-between">
                              <span className="font-display font-black italic text-xl tracking-tighter uppercase transition-colors">TEAM <span className="text-[var(--primary)]">KOREA</span></span>
                              <div className="flex gap-2">
                                    <div className="size-2 rounded-full bg-[var(--primary)] shadow-[0_0_10px_rgba(255,70,70,0.5)]"></div>
                                    <div className="size-2 rounded-full bg-[var(--secondary)]"></div>
                              </div>
                        </div>
                  </header>

                  {/* Page Title */}
                  <div className="px-6 pt-24 pb-6">
                        <motion.h1
                              className="text-4xl md:text-5xl font-display font-bold tracking-tight mb-2"
                              initial={{ opacity: 0, y: -20 }}
                              animate={{ opacity: 1, y: 0 }}
                        >
                              선수단
                        </motion.h1>
                        <p className="text-gray-400 font-sans">Team Korea Athletes</p>
                  </div>

                  {/* Sport Filter */}
                  <div className="px-6 mb-8">
                        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                              <button
                                    onClick={() => setSelectedSport('all')}
                                    className={`px-4 py-2 rounded-lg font-sans text-sm whitespace-nowrap transition-all ${selectedSport === 'all'
                                          ? 'bg-[var(--primary)] text-white'
                                          : 'bg-white/5 text-gray-400 hover:bg-white/10'
                                          }`}
                              >
                                    전체 ({athletes.length})
                              </button>
                              {availableSports.map(sport => (
                                    <button
                                          key={sport}
                                          onClick={() => setSelectedSport(sport)}
                                          className={`px-4 py-2 rounded-lg font-sans text-sm whitespace-nowrap transition-all ${selectedSport === sport
                                                ? 'bg-[var(--primary)] text-white'
                                                : 'bg-white/5 text-gray-400 hover:bg-white/10'
                                                }`}
                                    >
                                          {SPORT_DISPLAY_KR[sport]} ({athletesBySport[sport]?.length || 0})
                                    </button>
                              ))}
                        </div>
                  </div>

                  {/* Athletes Grid */}
                  <div className="px-6">
                        {selectedSport === 'all' ? (
                              // Show by sport groups
                              <div className="space-y-12">
                                    {availableSports.map(sport => (
                                          <div key={sport}>
                                                <h2 className="text-2xl font-display font-bold mb-4 text-[var(--primary)]">
                                                      {SPORT_DISPLAY_KR[sport]}
                                                </h2>
                                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                                                      <AnimatePresence mode="popLayout">
                                                            {athletesBySport[sport]?.map((athlete, idx) => {
                                                                  const initial = athlete.name_ko?.charAt(0) || athlete.name_en?.charAt(0) || '?';
                                                                  const age = athlete.age || (athlete.birth_year ? 2026 - athlete.birth_year : '?');
                                                                  const sportKr = SPORT_DISPLAY_KR[athlete.sport as keyof typeof SPORT_DISPLAY_KR] || athlete.sport;

                                                                  return (
                                                                        <motion.div
                                                                              key={athlete.id || athlete.fis_code}
                                                                              layout
                                                                              initial={{ opacity: 0, scale: 0.9 }}
                                                                              animate={{ opacity: 1, scale: 1 }}
                                                                              exit={{ opacity: 0, scale: 0.9 }}
                                                                              transition={{ duration: 0.3, delay: idx * 0.02 }}
                                                                              onClick={() => setSearchParams({ id: athlete.id || athlete.fis_code })}
                                                                              className="glass-card p-5 rounded-3xl border-white/5 hover:bg-white/[0.08] transition-all cursor-pointer group relative overflow-hidden"
                                                                        >
                                                                              {/* Background Gradient */}
                                                                              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                                                                              <div className="relative z-10 space-y-3">
                                                                                    {/* Initial Circle */}
                                                                                    <div className="w-16 h-16 mx-auto rounded-full bg-white/10 border border-white/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                                                                                          <span className="text-2xl font-black italic text-white/80">{initial}</span>
                                                                                    </div>

                                                                                    {/* Name */}
                                                                                    <div className="text-center">
                                                                                          <h3 className="text-lg font-black italic text-white uppercase tracking-tight leading-tight group-hover:text-primary transition-colors">
                                                                                                {athlete.name_ko}
                                                                                          </h3>
                                                                                          <p className="text-[9px] text-gray-500 font-bold uppercase tracking-wider mt-0.5">
                                                                                                {athlete.name_en}
                                                                                          </p>
                                                                                    </div>

                                                                                    {/* Sport Badge */}
                                                                                    <div className="flex justify-center">
                                                                                          <span className="px-3 py-1 rounded-full bg-primary/20 text-primary text-[10px] font-black uppercase italic tracking-tight border border-primary/30">
                                                                                                {sportKr}
                                                                                          </span>
                                                                                    </div>

                                                                                    {/* Stats */}
                                                                                    <div className="flex items-center justify-center gap-3 pt-2 border-t border-white/5">
                                                                                          <div className="text-center">
                                                                                                <p className="text-xs font-black italic text-white">{age}</p>
                                                                                                <p className="text-[8px] text-gray-500 uppercase tracking-wider">Age</p>
                                                                                          </div>
                                                                                          <div className="w-px h-6 bg-white/10" />
                                                                                          <div className="text-center">
                                                                                                <p className="text-xs font-black italic text-white">{athlete.gender === 'M' ? '남' : '여'}</p>
                                                                                                <p className="text-[8px] text-gray-500 uppercase tracking-wider">Gender</p>
                                                                                          </div>
                                                                                    </div>
                                                                              </div>
                                                                        </motion.div>
                                                                  );
                                                            })}
                                                      </AnimatePresence>
                                                </div>
                                          </div>
                                    ))}
                              </div>
                        ) : (
                              // Show filtered sport
                              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                                    <AnimatePresence mode="popLayout">
                                          {filteredAthletes.map((athlete, idx) => {
                                                const initial = athlete.name_ko?.charAt(0) || athlete.name_en?.charAt(0) || '?';
                                                const age = athlete.age || (athlete.birth_year ? 2026 - athlete.birth_year : '?');
                                                const sportKr = SPORT_DISPLAY_KR[athlete.sport as keyof typeof SPORT_DISPLAY_KR] || athlete.sport;

                                                return (
                                                      <motion.div
                                                            key={athlete.id || athlete.fis_code}
                                                            layout
                                                            initial={{ opacity: 0, scale: 0.9 }}
                                                            animate={{ opacity: 1, scale: 1 }}
                                                            exit={{ opacity: 0, scale: 0.9 }}
                                                            transition={{ duration: 0.3, delay: idx * 0.02 }}
                                                            onClick={() => setSearchParams({ id: athlete.id || athlete.fis_code })}
                                                            className="glass-card p-5 rounded-3xl border-white/5 hover:bg-white/[0.08] transition-all cursor-pointer group relative overflow-hidden"
                                                      >
                                                            {/* Background Gradient */}
                                                            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                                                            <div className="relative z-10 space-y-3">
                                                                  {/* Initial Circle */}
                                                                  <div className="w-16 h-16 mx-auto rounded-full bg-white/10 border border-white/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                                                                        <span className="text-2xl font-black italic text-white/80">{initial}</span>
                                                                  </div>

                                                                  {/* Name */}
                                                                  <div className="text-center">
                                                                        <h3 className="text-lg font-black italic text-white uppercase tracking-tight leading-tight group-hover:text-primary transition-colors">
                                                                              {athlete.name_ko}
                                                                        </h3>
                                                                        <p className="text-[9px] text-gray-500 font-bold uppercase tracking-wider mt-0.5">
                                                                              {athlete.name_en}
                                                                        </p>
                                                                  </div>

                                                                  {/* Sport Badge */}
                                                                  <div className="flex justify-center">
                                                                        <span className="px-3 py-1 rounded-full bg-primary/20 text-primary text-[10px] font-black uppercase italic tracking-tight border border-primary/30">
                                                                              {sportKr}
                                                                        </span>
                                                                  </div>

                                                                  {/* Stats */}
                                                                  <div className="flex items-center justify-center gap-3 pt-2 border-t border-white/5">
                                                                        <div className="text-center">
                                                                              <p className="text-xs font-black italic text-white">{age}</p>
                                                                              <p className="text-[8px] text-gray-500 uppercase tracking-wider">Age</p>
                                                                        </div>
                                                                        <div className="w-px h-6 bg-white/10" />
                                                                        <div className="text-center">
                                                                              <p className="text-xs font-black italic text-white">{athlete.gender === 'M' ? '남' : '여'}</p>
                                                                              <p className="text-[8px] text-gray-500 uppercase tracking-wider">Gender</p>
                                                                        </div>
                                                                  </div>
                                                            </div>
                                                      </motion.div>
                                                );
                                          })}
                                    </AnimatePresence>
                              </div>
                        )}
                  </div>

                  {/* Athlete Profile Modal */}
                  {selectedAthlete && (
                        <AthleteProfileModal
                              isOpen={!!selectedAthlete}
                              athlete={selectedAthlete}
                              onClose={() => setSelectedAthlete(null)}
                        />
                  )}

                  {/* Footer - Brand Consistency with Dashboard */}
                  <footer className="py-12 bg-black/40 backdrop-blur-lg border-t border-white/5 mt-20">
                        <div className="max-w-7xl mx-auto px-10 text-center text-gray-700 font-bold uppercase tracking-[0.2em] text-[8px] flex flex-col items-center gap-2">
                              <p>© TEAM KOREA SKI & SNOWBOARD</p>
                              <div className="flex items-center gap-2 text-[7px] text-gray-800">
                                    <span>PERFORMANCE DATA SERVICE</span>
                              </div>
                        </div>
                  </footer>
            </div>
      );
};
