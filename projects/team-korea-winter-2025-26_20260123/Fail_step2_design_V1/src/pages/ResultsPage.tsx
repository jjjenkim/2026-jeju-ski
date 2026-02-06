import { useState, useEffect, useRef } from 'react'
import { useAthleteData } from '../hooks/useAthleteData'
import { initializeAnimations } from '../utils/animations'


export const ResultsPage = () => {
  const { data, loading } = useAthleteData()
  const [filter, setFilter] = useState('All Sports')
  const pageRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (pageRef.current && !loading) {
      const { applyEntranceAnimations } = initializeAnimations()
      applyEntranceAnimations(pageRef.current)
    }
  }, [loading, filter])

  if (loading || !data) return <div className="min-h-screen bg-background-dark" />

  const athletes = data.athletes || []

  const filteredAthletes = filter === 'All Sports'
    ? athletes
    : athletes.filter(a => {
      if (filter === 'Snowboard') return a.sport === 'snowboard_alpine' || a.sport === 'snowboard_park' || a.sport === 'snowboard_cross'
      if (filter === 'Alpine Ski') return a.sport === 'alpine_skiing'
      return true
    })

  // Sort by Rank
  const sortedAthletes = [...filteredAthletes].sort((a, b) => (a.current_rank || 100) - (b.current_rank || 100))

  return (
    <div ref={pageRef} className="min-h-screen bg-deep-bg text-off-white pb-32 px-5 py-8">
      <header className="space-y-6 pt-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white mb-1">Competition</h1>
            <p className="text-primary text-[10px] font-bold uppercase tracking-[0.2em]">Milano Cortina 2026</p>
          </div>
          <button className="w-10 h-10 rounded-2xl glass-panel flex items-center justify-center text-gray-300">
            <span className="material-symbols-outlined text-xl">tune</span>
          </button>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {['All Sports', 'Snowboard', 'Alpine Ski'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`filter-knob whitespace-nowrap ${filter === f ? 'filter-knob-active' : 'filter-knob-inactive'}`}
            >
              {f}
            </button>
          ))}
          <button className="filter-knob filter-knob-inactive whitespace-nowrap">Jan 2024</button>
        </div>
      </header>

      <div className="space-y-4 mt-8">
        <div className="grid grid-cols-12 px-4 text-[10px] font-bold uppercase tracking-widest text-gray-500">
          <div className="col-span-2">Rank</div>
          <div className="col-span-6">Athlete / Event</div>
          <div className="col-span-4 text-right">Performance</div>
        </div>
        <div className="space-y-2.5">
          {sortedAthletes.map((athlete, index) => {
            const rank = athlete.current_rank || index + 1
            let rankClass = "bg-white/5 text-gray-400"
            let rankTextClass = "text-gray-300"

            if (rank === 1) {
              rankClass = "bg-primary text-white shadow-lg shadow-primary/40"
              rankTextClass = "text-white"
            } else if (rank <= 3) {
              rankClass = "bg-secondary text-white shadow-lg shadow-secondary/40"
              rankTextClass = "text-white"
            }

            return (
              <div key={athlete.id} className="glass-panel grid grid-cols-12 items-center p-3.5 rounded-2xl group hover:bg-white/5 transition-colors">
                <div className="col-span-2">
                  <div className={`w-9 h-9 rounded-xl ${rankClass} flex items-center justify-center`}>
                    <span className={`${rankTextClass} font-black text-sm italic`}>{String(rank).padStart(2, '0')}</span>
                  </div>
                </div>
                <div className="col-span-6 flex flex-col pl-2">
                  <span className={`font-bold text-base transition-colors ${rank === 1 ? 'text-primary' : 'text-white group-hover:text-white'}`}>{athlete.name_ko}</span>
                  <span className="text-[10px] text-gray-400 font-medium truncate pr-2 uppercase tracking-tight">{athlete.sport_display}</span>
                </div>
                <div className="col-span-4 flex items-center justify-end gap-3">
                  <div className="text-right">
                    <span className={`block font-black text-sm tabular-nums ${rank === 1 ? 'text-white' : 'text-off-white/70'}`}>{athlete.total_points}</span>
                  </div>
                  <div className="flex items-end gap-0.5 h-6">
                    <div className={`w-1 rounded-full ${rank <= 3 ? 'bg-secondary/20' : 'bg-white/10'} h-2`}></div>
                    <div className={`w-1 rounded-full ${rank <= 3 ? 'bg-secondary/40' : 'bg-white/10'} h-3`}></div>
                    <div className={`w-1 rounded-full ${rank <= 3 ? 'bg-secondary/60' : 'bg-white/20'} h-4`}></div>
                    <div className={`w-1 rounded-full ${rank <= 3 ? 'bg-secondary' : 'bg-white/30'} h-5`}></div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
