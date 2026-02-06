import { useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { initializeAnimations } from '../utils/animations'
import { PerformanceChart } from '../components/charts/PerformanceChart'

export const AnalysisPage = () => {
  const navigate = useNavigate()
  const pageRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (pageRef.current) {
      const { applyEntranceAnimations } = initializeAnimations()
      applyEntranceAnimations(pageRef.current)
    }
  }, [])

  return (
    <div ref={pageRef} className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4 bg-black/60 backdrop-blur-sm">
      {/* Background click to close */}
      <div className="absolute inset-0" onClick={() => navigate(-1)}></div>

      <div className="relative z-10 w-full max-w-[480px] h-[90vh] bg-[#181010] border border-white/10 rounded-t-3xl sm:rounded-2xl flex flex-col overflow-hidden shadow-2xl pt-6">
        {/* Handle for mobile feel */}
        <div className="h-1.5 w-12 bg-white/20 rounded-full mx-auto my-3 shrink-0"></div>

        <header className="flex items-center justify-between px-6 pb-4 shrink-0">
          <h2 className="text-xl font-bold text-white tracking-tight">Competition Analysis</h2>
          <button onClick={() => navigate(-1)} className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
            <span className="material-symbols-outlined text-white">close</span>
          </button>
        </header>

        <div className="flex-1 overflow-y-auto px-6 pb-10 space-y-8">
          {/* Filters */}
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            <div className="flex h-10 shrink-0 items-center justify-center gap-x-2 rounded-full bg-primary px-5 text-white shadow-lg shadow-primary/20">
              <span className="material-symbols-outlined text-[18px]">downhill_skiing</span>
              <p className="text-sm font-semibold">Alpine</p>
            </div>
            <div className="flex h-10 shrink-0 items-center justify-center gap-x-2 rounded-full bg-white/10 px-5 text-white/70 border border-white/5">
              <span className="material-symbols-outlined text-[18px]">snowboarding</span>
              <p className="text-sm font-medium">Snowboard</p>
            </div>
            <div className="flex h-10 shrink-0 items-center justify-center gap-x-2 rounded-full bg-white/10 px-5 text-white/70 border border-white/5">
              <span className="material-symbols-outlined text-[18px]">skateboarding</span>
              <p className="text-sm font-medium">Freestyle</p>
            </div>
          </div>

          {/* Chart Section */}
          <div className="flex flex-col gap-4">
            <div>
              <p className="text-white/60 text-sm font-medium">Performance Trend</p>
              <div className="flex items-baseline gap-2">
                <span className="text-white text-4xl font-bold tracking-tight">88.5</span>
                <span className="text-[#0bda0b] text-sm font-bold bg-[#0bda0b]/10 px-2 py-0.5 rounded-md">+12.4%</span>
              </div>
            </div>
            <div className="relative w-full h-[240px] bg-black/40 rounded-3xl p-2 knob-shadow overflow-hidden border border-white/5">
              <PerformanceChart data={[
                { name: 'OCT', alpine: 40, snowboard: 35 },
                { name: 'NOV', alpine: 55, snowboard: 62 },
                { name: 'DEC', alpine: 68, snowboard: 58 },
                { name: 'JAN', alpine: 72, snowboard: 85 },
                { name: 'FEB', alpine: 88, snowboard: 78 },
                { name: 'MAR', alpine: 92, snowboard: 90 },
              ]} />
            </div>
          </div>

          {/* Top Athletes Table */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-white text-lg font-bold tracking-tight">Top Performers</h3>
              <button className="text-primary text-xs font-bold flex items-center gap-1">
                VIEW ALL
                <span className="material-symbols-outlined text-[14px]">chevron_right</span>
              </button>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-orange-500 flex items-center justify-center text-white font-bold text-sm">SH</div>
                  <div>
                    <p className="text-white font-bold">Sangho LEE</p>
                    <p className="text-white/50 text-xs">Snowboard</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-white font-bold">92.4 <span className="text-[10px] text-white/40 font-normal">AVG</span></p>
                  <div className="flex items-center justify-end gap-1">
                    <span className="material-symbols-outlined text-yellow-500 text-[14px] font-variation-settings-fill">military_tech</span>
                    <span className="text-white/70 text-xs font-medium">3 Medals</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4">
            <button className="w-full h-14 bg-primary hover:bg-primary/90 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-transform active:scale-[0.98] knob-shadow">
              <span className="material-symbols-outlined">analytics</span>
              Download Report
            </button>
          </div>

        </div>
      </div>
    </div>
  )
}
