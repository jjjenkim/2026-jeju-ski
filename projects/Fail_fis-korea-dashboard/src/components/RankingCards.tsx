import { Trophy, Zap, Crown } from 'lucide-react';
import type { Athlete } from '../types';

interface RankingCardsProps {
      athletes: Athlete[];
}

interface RankedAthlete {
      name: string;
      discipline: string;
      value: number | string;
      subValue?: string;
      rank?: number;
}

export function RankingCards({ athletes }: RankingCardsProps) {
      const seasonStart = new Date(2025, 6, 1).getTime(); // July 2025
      const seasonEnd = new Date(2026, 5, 30).getTime(); // June 2026

      // 1. Olympic Appearances (Cumulative)
      const olympicRankings = athletes
            .map(athlete => {
                  const count = (athlete.최근10경기 || []).filter(p => {
                        const cat = (p.category || '').toLowerCase();
                        return cat.includes('olympic') || cat.includes('owg');
                  }).length;
                  return {
                        name: athlete.선수명,
                        discipline: athlete.종목,
                        value: count,
                        subValue: '회'
                  };
            })
            .filter(a => a.value > 0)
            .sort((a, b) => (b.value as number) - (a.value as number))
            .slice(0, 5);

      // 2. World Cup Appearances (Cumulative)
      const wcRankings = athletes
            .map(athlete => {
                  const count = (athlete.최근10경기 || []).filter(p => {
                        const cat = (p.category || '').toLowerCase();
                        return cat.includes('world cup') || cat.includes('wc');
                  }).length;
                  return {
                        name: athlete.선수명,
                        discipline: athlete.종목,
                        value: count,
                        subValue: '회'
                  };
            })
            .filter(a => a.value > 0)
            .sort((a, b) => (b.value as number) - (a.value as number))
            .slice(0, 5);

      // 3. Season Best (2025-26)
      const seasonRankings = athletes
            .map(athlete => {
                  let bestRank = 999;
                  let bestDate = '';

                  (athlete.최근10경기 || []).forEach(p => {
                        const dateParts = p.date.split('-');
                        if (dateParts.length === 3) {
                              const pDate = new Date(parseInt(dateParts[0]), parseInt(dateParts[1]) - 1, parseInt(dateParts[2])).getTime();
                              if (pDate >= seasonStart && pDate <= seasonEnd) {
                                    const r = typeof p.랭킹 === 'number' ? p.랭킹 : parseInt(String(p.랭킹));
                                    if (!isNaN(r) && r > 0 && r < bestRank) {
                                          bestRank = r;
                                          bestDate = p.date.substring(5); // MM-DD
                                    }
                              }
                        }
                  });

                  return {
                        name: athlete.선수명,
                        discipline: athlete.종목,
                        value: bestRank,
                        subValue: bestDate
                  };
            })
            .filter(a => (a.value as number) < 999)
            .sort((a, b) => (a.value as number) - (b.value as number))
            .slice(0, 5);

      const renderRankingCard = (title: string, icon: React.ReactNode, data: RankedAthlete[], valueType: 'count' | 'rank', borderColor: string) => (
            <div className={`p-5 rounded-2xl border ${borderColor} shadow-sm bg-white dark:bg-ksa-dark-card hover:shadow-md transition-all`}>
                  <div className="flex items-center gap-2 mb-6 border-b border-gray-100 dark:border-gray-700 pb-4">
                        {icon}
                        <h3 className="font-bold text-gray-900 dark:text-white text-base">{title}</h3>
                  </div>

                  <div className="space-y-4">
                        {data.map((item, index) => (
                              <div key={index} className="flex items-center justify-between group">
                                    <div className="flex items-center gap-3">
                                          <div className={`
                w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold
                ${index === 0 ? 'bg-yellow-400 text-white shadow-yellow-200 dark:shadow-none' :
                                                      index === 1 ? 'bg-gray-400 text-white' :
                                                            index === 2 ? 'bg-orange-400 text-white' :
                                                                  'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'}
              `}>
                                                {index + 1}
                                          </div>
                                          <div className="flex flex-col">
                                                <span className="text-sm font-bold text-gray-800 dark:text-gray-200 group-hover:text-neon-mint transition-colors">
                                                      {item.name}
                                                </span>
                                                <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                                                      {item.discipline}
                                                </span>
                                          </div>
                                    </div>
                                    <div className="text-right">
                                          <div className={`text-lg font-black tracking-tight ${valueType === 'rank' && index === 0 ? 'text-neon-mint' : 'text-gray-900 dark:text-white'}`}>
                                                {valueType === 'rank' ? `${item.value}위` : `${item.value}${item.subValue}`}
                                          </div>
                                          {valueType === 'rank' && item.subValue && (
                                                <div className="text-xs text-gray-400 font-medium">{item.subValue}</div>
                                          )}
                                    </div>
                              </div>
                        ))}
                        {data.length === 0 && (
                              <div className="text-center py-8 text-gray-400 text-sm">데이터 없음</div>
                        )}
                  </div>
            </div>
      );

      return (
            <div className="mb-8">
                  <div className="flex items-center gap-2 mb-4 px-2">
                        <Crown className="text-neon-gold" size={20} />
                        <h2 className="text-lg font-bold text-gray-900 dark:text-white">TOP 5 Rankings</h2>
                        <span className="text-xs text-gray-500 dark:text-gray-400 ml-2 font-medium">
                              (2025/26 시즌 기준 / 올림픽·월드컵은 전체 누적)
                        </span>
                  </div>
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {renderRankingCard(
                              '올림픽 최다 출전 (전체)',
                              <Trophy className="text-neon-gold" size={20} />,
                              olympicRankings,
                              'count',
                              'border-neon-gold/30'
                        )}
                        {renderRankingCard(
                              '월드컵 최다 출전 (전체)',
                              <Trophy className="text-neon-cyan" size={20} />,
                              wcRankings,
                              'count',
                              'border-neon-cyan/30'
                        )}
                        {renderRankingCard(
                              '이번 시즌 최고 성적 (2025/26)',
                              <Zap className="text-neon-mint" size={20} />,
                              seasonRankings,
                              'rank',
                              'border-neon-mint/30'
                        )}
                  </div>
            </div>
      );
}
