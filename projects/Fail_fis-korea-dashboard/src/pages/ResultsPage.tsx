import { useState, useMemo } from 'react';
import { Search, Calendar, MapPin, Award } from 'lucide-react';
import type { Athlete } from '../types';

interface ResultsPageProps {
      athletes: Athlete[];
}

export function ResultsPage({ athletes }: ResultsPageProps) {
      const [searchTerm, setSearchTerm] = useState('');
      const [selectedDiscipline, setSelectedDiscipline] = useState('All');

      // Flatten all results
      const allResults = useMemo(() => {
            return athletes.flatMap(athlete =>
                  (athlete.최근10경기 || []).map(result => ({
                        athlete: athlete.선수명,
                        discipline: athlete.종목,
                        ...result,
                        location: result.location || 'Unknown'
                  }))
            ).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      }, [athletes]);

      // Filter results
      const filteredResults = useMemo(() => {
            return allResults.filter(result => {
                  const matchesSearch =
                        result.athlete.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        result.event.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        result.location.toLowerCase().includes(searchTerm.toLowerCase());

                  const matchesDiscipline = selectedDiscipline === 'All' || result.discipline === selectedDiscipline;

                  return matchesSearch && matchesDiscipline;
            });
      }, [allResults, searchTerm, selectedDiscipline]);

      const uniqueDisciplines = ['All', ...new Set(athletes.map(a => a.종목))];

      return (
            <div className="animate-slide-up space-y-6">
                  {/* Header & Filters */}
                  <div className="flex flex-col md:flex-row justify-between gap-4 bg-white dark:bg-ksa-dark-card p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-ksa-dark-border">
                        <div>
                              <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-2">RECENT RESULTS</h2>
                              <p className="text-gray-500 dark:text-gray-400 text-sm">최근 경기 결과를 확인하세요.</p>
                        </div>

                        <div className="flex gap-3">
                              <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                    <input
                                          type="text"
                                          placeholder="선수, 장소 검색..."
                                          value={searchTerm}
                                          onChange={(e) => setSearchTerm(e.target.value)}
                                          className="pl-10 pr-4 py-2 bg-gray-50 dark:bg-[#1A1D29] border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ksa-primary dark:text-white w-full md:w-64"
                                    />
                              </div>

                              <select
                                    value={selectedDiscipline}
                                    onChange={(e) => setSelectedDiscipline(e.target.value)}
                                    className="px-4 py-2 bg-gray-50 dark:bg-[#1A1D29] border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ksa-primary dark:text-white"
                              >
                                    {uniqueDisciplines.map(d => (
                                          <option key={d} value={d}>{d}</option>
                                    ))}
                              </select>
                        </div>
                  </div>

                  {/* Mobile Card View */}
                  <div className="lg:hidden space-y-4">
                        {filteredResults.map((result, i) => (
                              <div key={i} className="bg-white dark:bg-ksa-dark-card p-4 rounded-xl shadow-sm border border-gray-100 dark:border-ksa-dark-border">
                                    <div className="flex justify-between items-start mb-3">
                                          <div>
                                                <h3 className="font-bold text-gray-900 dark:text-white text-lg">{result.athlete}</h3>
                                                <span className="text-xs font-semibold text-ksa-primary dark:text-neon-mint">{result.discipline}</span>
                                          </div>
                                          <span className={`
                px-3 py-1 rounded-full text-xs font-bold
                ${result.랭킹 === 1 || result.랭킹 === '1' ? 'bg-yellow-100 text-yellow-700 border border-yellow-200' :
                                                      result.랭킹 === 2 || result.랭킹 === '2' ? 'bg-gray-100 text-gray-700 border border-gray-200' :
                                                            result.랭킹 === 3 || result.랭킹 === '3' ? 'bg-orange-100 text-orange-700 border border-orange-200' :
                                                                  'bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400'}
              `}>
                                                {result.랭킹}위
                                          </span>
                                    </div>

                                    <div className="grid grid-cols-2 gap-2 text-sm">
                                          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                                                <Calendar size={14} />
                                                <span>{result.date}</span>
                                          </div>
                                          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                                                <Award size={14} />
                                                <span>{result.점수} pts</span>
                                          </div>
                                          <div className="col-span-2 flex items-center gap-2 text-gray-600 dark:text-gray-400">
                                                <MapPin size={14} />
                                                <span className="truncate">{result.location}</span>
                                          </div>
                                    </div>
                              </div>
                        ))}
                  </div>

                  {/* Desktop Table View */}
                  <div className="hidden lg:block bg-white dark:bg-ksa-dark-card rounded-2xl shadow-sm border border-gray-100 dark:border-ksa-dark-border overflow-hidden">
                        <table className="w-full text-sm text-left">
                              <thead className="bg-gray-50 dark:bg-[#1A1D29] text-gray-500 dark:text-gray-400 font-medium">
                                    <tr>
                                          <th className="px-6 py-4">Date</th>
                                          <th className="px-6 py-4">Athlete</th>
                                          <th className="px-6 py-4">Event</th>
                                          <th className="px-6 py-4">Location</th>
                                          <th className="px-6 py-4">Rank</th>
                                          <th className="px-6 py-4">Points</th>
                                    </tr>
                              </thead>
                              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                                    {filteredResults.map((result, i) => (
                                          <tr key={i} className="hover:bg-gray-50 dark:hover:bg-[#1A1D29]/50 transition-colors">
                                                <td className="px-6 py-4 font-mono text-gray-600 dark:text-gray-400">{result.date}</td>
                                                <td className="px-6 py-4 font-bold text-gray-900 dark:text-white">{result.athlete}</td>
                                                <td className="px-6 py-4">
                                                      <span className="px-2 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded text-xs font-semibold">
                                                            {result.discipline}
                                                      </span>
                                                </td>
                                                <td className="px-6 py-4 text-gray-600 dark:text-gray-300">{result.location}</td>
                                                <td className="px-6 py-4">
                                                      <span className={`font-bold ${result.랭킹 === 1 || result.랭킹 === '1' ? 'text-yellow-500' :
                                                            result.랭킹 === 2 || result.랭킹 === '2' ? 'text-gray-400' :
                                                                  result.랭킹 === 3 || result.랭킹 === '3' ? 'text-orange-500' :
                                                                        'text-gray-600 dark:text-gray-500'
                                                            }`}>
                                                            {result.랭킹}
                                                      </span>
                                                </td>
                                                <td className="px-6 py-4 font-mono text-gray-900 dark:text-white">{result.점수}</td>
                                          </tr>
                                    ))}
                              </tbody>
                        </table>
                  </div>
            </div>
      );
}
