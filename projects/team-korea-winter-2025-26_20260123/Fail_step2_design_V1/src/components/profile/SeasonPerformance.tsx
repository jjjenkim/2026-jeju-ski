import { GlassPanel } from '../common/GlassPanel'
import { PerformanceGraph } from '../charts/PerformanceGraph'

interface DataPoint {
  month: string
  value: number
  rank: number
}

interface SeasonPerformanceProps {
  globalRank: number
  totalPoints: number
  data: DataPoint[]
}

export const SeasonPerformance = ({
  globalRank,
  totalPoints,
  data
}: SeasonPerformanceProps) => {
  return (
    <div className="px-6 mb-6">
      <GlassPanel className="p-6 rounded-2xl">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h3 className="text-lg font-semibold text-white mb-1">Season Performance</h3>
            <p className="text-sm text-white/60">2025-26 Season</p>
          </div>
          <div className="text-right">
            <div className="text-xs text-white/60">Global Rank</div>
            <div className="text-2xl font-bold text-primary">#{globalRank}</div>
          </div>
        </div>

        <div className="mb-4">
          <div className="text-xs text-white/60 mb-1">Total Points</div>
          <div className="text-3xl font-bold text-white">{totalPoints.toLocaleString()}</div>
        </div>

        <PerformanceGraph data={data} />

        <div className="flex justify-between mt-4 text-xs text-white/40">
          {data.map((d, idx) => (
            <span key={idx}>{d.month}</span>
          ))}
        </div>
      </GlassPanel>
    </div>
  )
}
