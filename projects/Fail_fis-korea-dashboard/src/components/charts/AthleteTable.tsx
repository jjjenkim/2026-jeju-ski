import { ExternalLink } from 'lucide-react';
import type { Athlete } from '../../types';

interface AthleteTableProps {
  athletes: Athlete[];
  lastUpdated?: string;
}

export function AthleteTable({ athletes, lastUpdated }: AthleteTableProps) {
  const displayDate = lastUpdated
    ? new Date(lastUpdated).toLocaleDateString('ko-KR')
    : new Date().toLocaleDateString('ko-KR');

  // Flatten and sort global results
  const allResults = athletes.flatMap(athlete =>
    (athlete.최근10경기 || []).map(perf => ({
      ...perf,
      athleteName: athlete.선수명,
      gender: athlete.성별,
      discipline: athlete.세부종목,
      competitorId: athlete.FIS코드,
      profileUrl: athlete.FIS프로필URL,
      categoryMain: athlete.대회카테고리 // Fallback if perf.category is missing
    }))
  ).sort((a, b) => {
    const parse = (d: string) => {
      const parts = d.split('-');
      return parts.length === 3
        ? new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0])).getTime()
        : 0;
    };
    return parse(b.date) - parse(a.date);
  });

  return (
    <div className="card overflow-hidden bg-white dark:bg-[#1E293B] border border-gray-200 dark:border-gray-800 shadow-xl">
      <div className="p-6 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight uppercase">
            TEAM KOREA <span className="text-ksa-primary">RECENT RESULTS</span>
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 font-medium">
            2025-2026 SEASON | UPDATED: {displayDate}
          </p>
        </div>
        <div className="px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded text-xs font-mono text-gray-500 dark:text-gray-400">
          LIVE DATA
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50 dark:bg-[#0F172A] text-xs uppercase font-bold text-gray-500 dark:text-gray-400">
            <tr>
              <th className="px-6 py-4">Date</th>
              <th className="px-6 py-4">Athlete</th>
              <th className="px-6 py-4">Discipline</th>
              <th className="px-6 py-4">Location / Event</th>
              <th className="px-6 py-4">Category</th>
              <th className="px-6 py-4 text-center">Rank</th>
              <th className="px-6 py-4 text-right">Link</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
            {allResults.slice(0, 50).map((result, idx) => (
              <tr
                key={`${result.competitorId}-${result.date}-${idx}`}
                className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors duration-150"
              >
                <td className="px-6 py-4 font-mono text-gray-600 dark:text-gray-400 whitespace-nowrap">
                  {result.date}
                </td>
                <td className="px-6 py-4 font-bold text-gray-900 dark:text-white whitespace-nowrap">
                  {result.athleteName}
                  <span className="ml-2 text-xs font-normal text-gray-400">
                    {result.gender === 'F' ? 'W' : 'M'}
                  </span>
                </td>
                <td className="px-6 py-4 text-gray-700 dark:text-gray-300 whitespace-nowrap">
                  {result.discipline}
                </td>
                <td className="px-6 py-4 text-gray-700 dark:text-gray-300">
                  {result.location || result.event.split(' - ')[0]}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 rounded text-[10px] font-black tracking-wider ${(result.category || result.categoryMain) === 'WC' ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400' :
                      (result.category || result.categoryMain) === 'WCH' ? 'bg-purple-500/10 text-purple-600 dark:text-purple-400' :
                        'bg-gray-500/10 text-gray-600 dark:text-gray-400'
                    }`}>
                    {result.category || result.categoryMain || 'FIS'}
                  </span>
                </td>
                <td className="px-6 py-4 text-center whitespace-nowrap">
                  <span className={`font-black text-lg ${result.랭킹 === 1 ? 'text-yellow-500' :
                      result.랭킹 === 2 ? 'text-gray-400' :
                        result.랭킹 === 3 ? 'text-orange-400' :
                          typeof result.랭킹 === 'number' && result.랭킹 <= 10 ? 'text-blue-400' :
                            'text-gray-600 dark:text-gray-500' // DNS/DNF or low rank
                    }`}>
                    {typeof result.랭킹 === 'number' ? `${result.랭킹}` : result.랭킹}
                    {typeof result.랭킹 === 'number' && <span className="text-xs font-normal ml-0.5 text-gray-500">위</span>}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <a
                    href={result.profileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    <ExternalLink size={14} />
                  </a>
                </td>
              </tr>
            ))}
            {allResults.length === 0 && (
              <tr>
                <td colSpan={7} className="p-12 text-center text-gray-500 dark:text-gray-400">
                  데이터가 없습니다.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
