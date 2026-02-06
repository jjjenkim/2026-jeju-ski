// src/pages/Dashboard.tsx
import { useData } from '../contexts/DataContext';
import { Card } from '../components/common/Card';
import { Loading } from '../components/common/Loading';
import { DonutChart } from '../components/charts/DonutChart';
import { BarChart } from '../components/charts/BarChart';
import { Histogram } from '../components/charts/Histogram';
import { Timeline } from '../components/charts/Timeline';
import { Top5Ranking } from '../components/charts/Top5Ranking';
import { RecentMedals } from '../components/charts/RecentMedals';
import { differenceInDays } from 'date-fns';

export const Dashboard = () => {
  const { data, loading, error } = useData();

  if (loading) return <Loading />;
  if (error) {
    return (
      <div className="text-center py-20">
        <p className="text-red-500 text-lg">⚠️ {error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="mt-4 btn btn-primary"
        >
          새로고침
        </button>
      </div>
    );
  }
  if (!data) return null;

  // 올림픽 카운트다운 (2026년 2월 6일)
  const olympicDate = new Date('2026-02-06');
  const today = new Date();
  const daysUntilOlympic = differenceInDays(olympicDate, today);

  // 이번 달의 선수 (랜덤)
  const athleteOfMonth = data.athletes
    .filter(a => a.recent_results && a.recent_results.length > 0)
    .sort(() => Math.random() - 0.5)[0];

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <Card className="text-center">
        <h1 className="text-5xl font-bold mb-4 gradient-text">
          대한민국 동계 국가대표
        </h1>
        <div className="flex justify-center gap-8 text-lg mb-4">
          <div>
            <span className="font-bold text-korea-red text-2xl">
              {data.metadata.total_athletes}명
            </span>{' '}
            선수
          </div>
          <div>
            <span className="font-bold text-korea-blue text-2xl">
              {data.metadata.sports}개
            </span>{' '}
            종목
          </div>
          <div>
            <span className="font-bold text-gold text-2xl">
              {data.statistics.total_medals.gold + 
               data.statistics.total_medals.silver + 
               data.statistics.total_medals.bronze}개
            </span>{' '}
            메달
          </div>
        </div>
        <div className="mt-4 text-3xl font-bold text-gold">
          🏔️ 2026 밀라노-코르티나 동계올림픽 D-{daysUntilOlympic}
        </div>
      </Card>

      {/* Data Visualization Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card delay={0.1}>
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            📊 종목 분포
          </h3>
          <DonutChart data={data.statistics.by_sport} />
        </Card>

        <Card delay={0.2}>
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            👥 팀별 현황
          </h3>
          <BarChart data={data.statistics.by_team} />
        </Card>

        <Card delay={0.3}>
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            🎂 연령 분포
          </h3>
          <Histogram data={data.statistics.age_distribution} />
        </Card>

        <Card delay={0.4}>
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            📅 시즌 활동
          </h3>
          <Timeline athletes={data.athletes} />
        </Card>

        <Card delay={0.5}>
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            🏆 국제 랭킹 TOP 5
          </h3>
          <Top5Ranking athletes={data.athletes} />
        </Card>

        <Card delay={0.6}>
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            🥇 최근 메달
          </h3>
          <RecentMedals athletes={data.athletes} />
        </Card>
      </div>

      {/* 이번 달의 선수 */}
      {athleteOfMonth && (
        <Card delay={0.7} className="bg-gradient-to-r from-korea-red/10 to-korea-blue/10">
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 bg-gradient-to-br from-korea-red to-korea-blue rounded-full flex items-center justify-center text-white text-4xl">
              ⭐
            </div>
            <div className="flex-1">
              <h3 className="text-2xl font-bold mb-2">🌟 이번 달의 선수</h3>
              <p className="text-xl font-semibold mb-1">{athleteOfMonth.name_ko}</p>
              <p className="text-gray-600 mb-2">{athleteOfMonth.sport_display}</p>
              {athleteOfMonth.recent_results[0] && (
                <p className="text-sm text-gray-700">
                  최근 성적: {athleteOfMonth.recent_results[0].event} - {athleteOfMonth.recent_results[0].rank}위
                </p>
              )}
            </div>
            {athleteOfMonth.best_rank && (
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-1">최고 순위</p>
                <p className="text-4xl font-bold text-korea-red">
                  #{athleteOfMonth.best_rank}
                </p>
              </div>
            )}
          </div>
        </Card>
      )}
    </div>
  );
};
