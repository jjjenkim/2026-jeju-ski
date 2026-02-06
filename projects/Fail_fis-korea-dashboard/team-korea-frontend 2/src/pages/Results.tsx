// src/pages/Results.tsx
import { useState } from 'react';
import { useData } from '../contexts/DataContext';
import { Card } from '../components/common/Card';
import { Loading } from '../components/common/Loading';
import { Athlete } from '../types';

export const Results = () => {
  const { data, loading, error } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSport, setSelectedSport] = useState('all');
  const [selectedAthlete, setSelectedAthlete] = useState<Athlete | null>(null);

  if (loading) return <Loading />;
  if (error) return <div className="text-center py-20 text-red-500">⚠️ {error}</div>;
  if (!data) return null;

  // 필터링
  const filteredAthletes = data.athletes.filter((athlete) => {
    const matchesSearch = athlete.name_ko.includes(searchTerm) || 
                         athlete.name_en.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSport = selectedSport === 'all' || athlete.sport === selectedSport;
    return matchesSearch && matchesSport;
  });

  // 모든 결과 수집
  const allResults = filteredAthletes.flatMap((athlete) =>
    athlete.recent_results.map((result) => ({
      ...result,
      athlete,
    }))
  ).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const sports = Object.keys(data.statistics.by_sport);

  return (
    <div className="space-y-6">
      <Card>
        <h1 className="text-3xl font-bold gradient-text mb-6">📈 최신 결과</h1>

        {/* 필터 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-semibold mb-2">선수 검색</label>
            <input
              type="text"
              placeholder="선수 이름 입력..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-korea-blue"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2">종목 선택</label>
            <select
              value={selectedSport}
              onChange={(e) => setSelectedSport(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-korea-blue"
            >
              <option value="all">전체</option>
              {sports.map((sport) => (
                <option key={sport} value={sport}>
                  {data.statistics.by_sport[sport]}개 - {sport}
                </option>
              ))}
            </select>
          </div>
        </div>

        <p className="text-sm text-gray-600 mb-4">
          총 {allResults.length}개의 결과
        </p>
      </Card>

      {/* 결과 테이블 */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-gray-200">
                <th className="text-left py-3 px-4 font-semibold">날짜</th>
                <th className="text-left py-3 px-4 font-semibold">선수</th>
                <th className="text-left py-3 px-4 font-semibold">대회명</th>
                <th className="text-left py-3 px-4 font-semibold">종목</th>
                <th className="text-center py-3 px-4 font-semibold">순위</th>
                <th className="text-center py-3 px-4 font-semibold">포인트</th>
              </tr>
            </thead>
            <tbody>
              {allResults.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-gray-500">
                    결과가 없습니다
                  </td>
                </tr>
              ) : (
                allResults.map((result, index) => (
                  <tr
                    key={index}
                    onClick={() => setSelectedAthlete(result.athlete)}
                    className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition"
                  >
                    <td className="py-3 px-4">{result.date}</td>
                    <td className="py-3 px-4 font-semibold">{result.athlete.name_ko}</td>
                    <td className="py-3 px-4">{result.event}</td>
                    <td className="py-3 px-4 text-sm text-gray-600">
                      {result.athlete.sport_display}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className={`font-bold ${
                        result.rank <= 3 ? 'text-korea-red' : 'text-gray-700'
                      }`}>
                        {result.rank}위
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">{result.points}pt</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* 선수 상세 모달 */}
      {selectedAthlete && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedAthlete(null)}
        >
          <Card
            className="max-w-2xl w-full max-h-[80vh] overflow-y-auto"
            onClick={(e: React.MouseEvent) => e.stopPropagation()}
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-2xl font-bold">{selectedAthlete.name_ko}</h2>
                <p className="text-gray-600">{selectedAthlete.name_en}</p>
              </div>
              <button
                onClick={() => setSelectedAthlete(null)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <p className="text-sm text-gray-600">나이</p>
                <p className="font-semibold">{selectedAthlete.age}세</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">종목</p>
                <p className="font-semibold">{selectedAthlete.sport_display}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">소속</p>
                <p className="font-semibold">{selectedAthlete.team}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">현재 순위</p>
                <p className="font-semibold text-korea-red">
                  {selectedAthlete.current_rank ? `#${selectedAthlete.current_rank}` : '-'}
                </p>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="font-bold mb-2">메달</h3>
              <div className="flex gap-2">
                <span className="badge badge-gold">🥇 {selectedAthlete.medals.gold}</span>
                <span className="badge badge-silver">🥈 {selectedAthlete.medals.silver}</span>
                <span className="badge badge-bronze">🥉 {selectedAthlete.medals.bronze}</span>
              </div>
            </div>

            <div>
              <h3 className="font-bold mb-2">최근 5경기</h3>
              <div className="space-y-2">
                {selectedAthlete.recent_results.map((result, index) => (
                  <div key={index} className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-semibold">{result.event}</p>
                        <p className="text-sm text-gray-600">{result.date}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-korea-red">{result.rank}위</p>
                        <p className="text-sm text-gray-600">{result.points}pt</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};
