import { useRef, useEffect } from 'react'
import { initializeAnimations } from '../utils/animations'
import { useAthleteData } from '../hooks/useAthleteData'
import { PerformanceChart } from '../components/charts/PerformanceChart'

export const ProfilePage = () => {
  const { data, loading } = useAthleteData()
  const pageRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (pageRef.current && !loading) {
      const { applyEntranceAnimations } = initializeAnimations()
      applyEntranceAnimations(pageRef.current)
    }
  }, [loading])

  if (loading || !data || !data.athletes || data.athletes.length === 0) return <div className="min-h-screen bg-deep-bg" />

  // Determine athlete (Default to Sangho Lee/Rank 1 for demo)
  const athlete = data.athletes.find(a => a.name_ko === '이상호') || data.athletes[0]

  return (
    <div ref={pageRef} className="min-h-screen bg-deep-bg text-white pb-32">
      {/* Header / Hero Section */}
      <header className="relative w-full h-[55vh] overflow-hidden rounded-b-[3rem] shadow-2xl shadow-black/50">
        {/* Background Image Placeholder or Asset */}
        <div className="absolute inset-0 bg-gray-800">
          <img
            src="/api/placeholder/400/800"
            alt={athlete.name_en}
            className="w-full h-full object-cover opacity-80 mix-blend-overlay"
          />
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-deep-bg via-transparent to-black/30"></div>
        </div>

        {/* Top Nav Overlay */}
        <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center z-20">
          <span className="material-symbols-outlined text-white/80">arrow_back</span>
          <span className="material-symbols-outlined text-white/80">favorite_border</span>
        </div>

        {/* Athlete Info Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
          <span className="text-[10px] font-bold text-primary uppercase tracking-[0.2em] mb-1 block">Team Korea</span>
          <h1 className="text-4xl font-black italic tracking-tighter mb-1">{athlete.name_ko}</h1>
          <p className="text-gray-400 text-xs font-medium mb-6">Snowboard Parallel Giant Slalom</p>

          {/* Status Pill */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0bda0b]/20 border border-[#0bda0b]/20 mb-6">
            <div className="w-1.5 h-1.5 rounded-full bg-[#0bda0b] animate-pulse"></div>
            <span className="text-[9px] font-bold text-[#0bda0b] uppercase tracking-wide">Active Status</span>
          </div>

          {/* Quick Stats Row */}
          <div className="flex items-center gap-3">
            <div className="glass-panel px-4 py-3 rounded-2xl flex-1 text-center backdrop-blur-md bg-white/5">
              <span className="text-[9px] font-bold text-gray-500 uppercase block mb-0.5">Age</span>
              <span className="text-lg font-bold">28</span>
            </div>
            <div className="glass-panel px-4 py-3 rounded-2xl flex-1 text-center backdrop-blur-md bg-white/5">
              <span className="text-[9px] font-bold text-gray-500 uppercase block mb-0.5">Height</span>
              <span className="text-lg font-bold">180</span>
            </div>
            <div className="glass-panel px-4 py-3 rounded-2xl flex-1 text-center backdrop-blur-md bg-white/5">
              <span className="text-[9px] font-bold text-gray-500 uppercase block mb-0.5">Weight</span>
              <span className="text-lg font-bold">78</span>
            </div>
            <div className="glass-panel px-4 py-3 rounded-2xl flex-1 text-center backdrop-blur-md bg-white/5 border border-white/20">
              <span className="text-[9px] font-bold text-white uppercase block mb-0.5">Rank</span>
              <span className="text-lg font-bold">1st</span>
            </div>
          </div>
        </div>
      </header>

      {/* Content Body */}
      <main className="px-6 py-8 space-y-8">

        {/* Season Performance Section (Chart) */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-lg">Season Performance</h3>
          </div>

          <div className="glass-panel p-5 rounded-3xl relative overflow-hidden">
            <div className="absolute top-4 left-4 z-10">
              <span className="text-[10px] font-bold text-gray-500 uppercase block">Global Rank</span>
              <div className="flex items-center gap-1">
                <span className="text-2xl font-black italic">#1</span>
                <span className="text-[10px] font-bold text-primary">▲ 2</span>
              </div>
            </div>
            <div className="absolute top-4 right-4 z-10 text-right">
              <span className="text-[10px] font-bold text-gray-500 uppercase block">Total Points</span>
              <span className="text-lg font-bold text-secondary-blue">5,240 <span className="text-[10px] text-gray-500 font-normal">pts</span></span>
            </div>

            {/* Chart Container - Replacing SVG with Dynamic Chart */}
            <div className="h-[240px] mt-12 w-full relative -ml-2">
              <PerformanceChart />
            </div>
          </div>
        </section>

        {/* Career Highlights List */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-lg">Career Highlights</h3>
          </div>
          <div className="space-y-3">
            <div className="glass-panel p-4 rounded-2xl flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-yellow-500/10 flex items-center justify-center border border-yellow-500/20">
                <span className="material-symbols-outlined text-yellow-500">emoji_events</span>
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-sm text-white">FIS World Cup 1st Place</h4>
                <p className="text-[10px] text-gray-500">March 2024 • Winterberg, GER</p>
              </div>
              <span className="text-[10px] font-bold text-gray-600 uppercase">Gold</span>
            </div>
            <div className="glass-panel p-4 rounded-2xl flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-gray-400/10 flex items-center justify-center border border-gray-400/20">
                <span className="material-symbols-outlined text-gray-400">emoji_events</span>
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-sm text-white">FIS World Cup 2nd Place</h4>
                <p className="text-[10px] text-gray-500">Feb 2024 • Krynica, POL</p>
              </div>
              <span className="text-[10px] font-bold text-gray-600 uppercase">Silver</span>
            </div>
            <div className="glass-panel p-4 rounded-2xl flex items-center gap-4 opacity-50">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
                <span className="material-symbols-outlined text-primary">local_fire_department</span>
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-sm text-white">Beijing 2022 Winter Olympics</h4>
                <p className="text-[10px] text-gray-500">Feb 2022 • Beijing, CHN</p>
              </div>
              <span className="text-[10px] font-bold text-gray-600 uppercase">Final 4</span>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
