import { Search, Filter, ChevronRight } from 'lucide-react';

// Mock Data (In real app, this comes from data/processed/athletes.json via a hook)
const MOCK_ATHLETES = [
      { id: 'KOR_AL_001', name: 'Kim Cheolsu', discipline: 'ALPINE SKIING', rank: 45, status: 'ACTIVE' },
      { id: 'KOR_SB_002', name: 'Lee Minho', discipline: 'SNOWBOARD', rank: 12, status: 'ACTIVE' },
      { id: 'KOR_MO_003', name: 'Park Ji-sung', discipline: 'MOGULS', rank: 4, status: 'Top Tier' },
      // ... more mock data would be loaded from JSON
];

export const Results = () => {
      return (
            <div className="space-y-6 animate-reveal-up">
                  {/* Header & Controls */}
                  <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-8 border-b border-white/5 pb-6">
                        <div>
                              <h1 className="font-display text-5xl text-white mb-2">RESULTS DATABASE</h1>
                              <p className="text-steel">Official FIS Records & Live Status</p>
                        </div>

                        <div className="flex gap-2 w-full md:w-auto">
                              <div className="relative flex-1 md:w-64">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-steel" size={16} />
                                    <input
                                          type="text"
                                          placeholder="Search Athlete..."
                                          className="w-full bg-void-navy border border-white/10 text-white pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-kor-blue transition-colors"
                                    />
                              </div>
                              <button className="px-4 py-3 bg-void-navy border border-white/10 hover:border-white text-steel hover:text-white transition-colors">
                                    <Filter size={18} />
                              </button>
                        </div>
                  </div>

                  {/* Noir Data Table */}
                  <div className="w-full overflow-hidden border border-white/5 bg-void-navy/30 backdrop-blur-sm">
                        <table className="w-full text-left border-collapse">
                              <thead>
                                    <tr className="border-b border-white/5 text-xs text-steel uppercase tracking-widest">
                                          <th className="p-4 font-medium w-20">Rank</th>
                                          <th className="p-4 font-medium">Athlete</th>
                                          <th className="p-4 font-medium">Discipline</th>
                                          <th className="p-4 font-medium w-32">Index</th>
                                          <th className="p-4 font-medium w-24">Link</th>
                                    </tr>
                              </thead>
                              <tbody className="divide-y divide-white/5">
                                    {MOCK_ATHLETES.map((athlete) => (
                                          <tr key={athlete.id} className="group hover:bg-white/[0.02] transition-colors cursor-pointer">
                                                <td className="p-4 font-display text-xl text-white">{athlete.rank}</td>
                                                <td className="p-4">
                                                      <div className="text-white font-bold">{athlete.name}</div>
                                                      <div className="text-xs text-steel">{athlete.id}</div>
                                                </td>
                                                <td className="p-4 text-sm text-steel group-hover:text-kor-blue transition-colors">{athlete.discipline}</td>
                                                <td className="p-4">
                                                      <div className={`text-xs font-bold px-2 py-1 inline-block ${athlete.rank <= 10 ? 'text-kor-red bg-kor-red/10' : 'text-green-500 bg-green-500/10'}`}>
                                                            {athlete.status}
                                                      </div>
                                                </td>
                                                <td className="p-4 text-steel group-hover:text-white">
                                                      <ChevronRight size={18} />
                                                </td>
                                          </tr>
                                    ))}
                                    {/* Visual Filler for Loop */}
                                    {[1, 2, 3, 4, 5].map((_, i) => (
                                          <tr key={i} className="group hover:bg-white/[0.02] transition-colors">
                                                <td className="p-4 text-steel/20">-</td>
                                                <td className="p-4 text-steel/20">Data Loading...</td>
                                                <td className="p-4 text-steel/20">...</td>
                                                <td className="p-4 text-steel/20">...</td>
                                                <td className="p-4 text-steel/20"><ChevronRight size={18} /></td>
                                          </tr>
                                    ))}
                              </tbody>
                        </table>
                  </div>
            </div>
      );
};
