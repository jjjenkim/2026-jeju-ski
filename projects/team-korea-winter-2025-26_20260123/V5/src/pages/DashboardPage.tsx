import { useNavigate } from 'react-router-dom'
import { useAthleteData } from '../hooks/useAthleteData'
import { BottomNav } from '../components/layout/BottomNav'
import { DistributionCharts } from '../components/charts/DistributionCharts'

export const DashboardPage = () => {
  const navigate = useNavigate()
  const { data, loading } = useAthleteData()

  if (loading || !data) return null

  // Real Data Mapping
  const topRanker = data.athletes.find(a => a.current_rank === 1) || data.athletes[0];
  const topNews = topRanker ? `${topRanker.name_ko}, IS World Cup Ranking #1` : "Team Korea Season Start";

  const topAthletes = data.athletes
    .filter(a => a.current_rank && a.current_rank <= 5)
    .sort((a, b) => (a.current_rank || 100) - (b.current_rank || 100))
    .slice(0, 5)
    .map(a => ({
      id: a.id,
      name: a.name_ko,
      sport: a.sport_display?.split('-')[0].trim(),
      score: (100 - (a.current_rank || 0) * 0.5).toFixed(2), // Mock score based on rank
      trend: Math.random() > 0.5 ? 'up' : 'down',
      val: (Math.random() * 5).toFixed(1) + '%'
    }));

  return (
    <div className="min-h-screen bg-deep-bg text-off-white pb-32">
      <header className="hero-gradient pt-16 pb-10 px-6 relative">
        <div className="mb-10 text-center sm:text-left">
          <h2 className="text-[10px] font-bold tracking-[0.4em] text-secondary/80 mb-2 uppercase">Republic of Korea</h2>
          <h1 className="massive-title text-[72px] font-black italic flex flex-col leading-[0.85]">
            <span>TEAM</span>
            <span className="text-primary">KOREA</span>
          </h1>
          <p className="text-[11px] font-medium tracking-[0.2em] text-gray-500 mt-4 uppercase">Elite Winter Sports Division</p>
        </div>
        <div className="flex gap-4">
          <div className="glass-panel px-5 py-4 rounded-2xl flex-1 border-l-4 border-l-primary">
            <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-1">Milano 2026</p>
            <span className="text-2xl font-black">D-452</span>
          </div>
          <div className="glass-panel px-5 py-4 rounded-2xl flex-1 border-l-4 border-l-secondary">
            <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-1">Elite Squad</p>
            <span className="text-2xl font-black">{data.metadata?.total_athletes || 124}</span>
          </div>
        </div>
      </header>

      <main className="px-6 space-y-10">
        {/* Statistics Charts - Added per PM Req */}
        <section>
          <DistributionCharts stats={data.statistics || { by_sport: {}, by_team: {}, age_distribution: { teens: 0, twenties: 0, thirties: 0 } }} />
        </section>

        <section className="grid grid-cols-2 gap-4">
          <div className="glass-panel p-5 rounded-3xl relative overflow-hidden">
            <span className="material-symbols-outlined text-secondary mb-3 text-2xl">public</span>
            <p className="text-[11px] text-gray-400 font-bold uppercase tracking-wider mb-1">Global Standing</p>
            <p className="text-2xl font-black">Top 7</p>
          </div>
          <div className="glass-panel p-5 rounded-3xl relative overflow-hidden">
            <span className="material-symbols-outlined text-primary mb-3 text-2xl">military_tech</span>
            <p className="text-[11px] text-gray-400 font-bold uppercase tracking-wider mb-1">Medal Forecast</p>
            <p className="text-2xl font-black">{data.statistics?.total_medals?.gold + data.statistics?.total_medals?.silver + data.statistics?.total_medals?.bronze || 12} Total</p>
          </div>
        </section>

        <section>
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-black text-xl tracking-tight uppercase italic">Recent Victories</h3>
            <span className="text-[10px] font-bold text-gray-500 border-b border-gray-500 cursor-pointer">VIEW ALL</span>
          </div>
          <div className="flex overflow-x-auto gap-4 hide-scrollbar -mx-6 px-6 pb-2">
            <div onClick={() => navigate('/analysis/month')} className="min-w-[280px] cursor-pointer glass-panel rounded-[2rem] p-6 relative overflow-hidden bg-gradient-to-br from-white/5 to-transparent">
              <div className="inline-block px-2 py-1 rounded-lg bg-primary/20 text-primary text-[10px] font-black mb-4 uppercase tracking-widest">FIS World Cup</div>
              <h4 className="font-bold text-xl leading-tight mb-4">{topNews}</h4>
              <div className="flex items-center gap-2 text-gray-500 text-[11px] font-medium">
                <span className="material-symbols-outlined text-sm">schedule</span>
                <span>2 HOURS AGO</span>
              </div>
            </div>
            <div className="min-w-[280px] glass-panel rounded-[2rem] p-6 relative overflow-hidden bg-gradient-to-br from-white/5 to-transparent">
              <div className="inline-block px-2 py-1 rounded-lg bg-secondary/20 text-secondary text-[10px] font-black mb-4 uppercase tracking-widest">National Trials</div>
              <h4 className="font-bold text-xl leading-tight mb-4">박제윤, 국가대표 선발전 압도적 1위</h4>
              <div className="flex items-center gap-2 text-gray-500 text-[11px] font-medium">
                <span className="material-symbols-outlined text-sm">schedule</span>
                <span>YESTERDAY</span>
              </div>
            </div>
          </div>
        </section>

        <section>
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-black text-xl tracking-tight uppercase italic">Top Ranking</h3>
            <button onClick={() => navigate('/results')} className="text-[10px] font-bold text-gray-500">ALL ATHLETES</button>
          </div>
          <div className="space-y-3">
            {topAthletes.map((item: any, idx: number) => (
              <div key={item.id || idx} onClick={() => navigate('/profile')} className="glass-panel p-4 rounded-2xl flex items-center justify-between cursor-pointer active:scale-95 transition-all group hover:bg-white/5">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black italic shadow-lg ${idx === 0 ? 'bg-primary text-white shadow-primary/40' : idx === 1 ? 'bg-secondary text-white shadow-secondary/40' : 'bg-white/5 text-gray-500'}`}>
                    {(idx + 1).toString().padStart(2, '0')}
                  </div>
                  <div>
                    <p className={`font-bold text-[15px] group-hover:text-white transition-colors ${idx === 0 ? 'text-primary' : 'text-off-white'}`}>{item.name}</p>
                    <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">{item.sport}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-black text-[15px] ${idx === 0 ? 'text-white' : 'text-off-white/60'}`}>{item.score}</p>
                  <p className={`text-[10px] font-bold flex items-center justify-end gap-0.5 ${item.trend === 'up' ? 'text-[#0bda0b]' : 'text-primary'}`}>
                    <span className="material-symbols-outlined text-[12px] font-bold">trending_{item.trend}</span> {item.val}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
      <BottomNav />
    </div>
  )
}
