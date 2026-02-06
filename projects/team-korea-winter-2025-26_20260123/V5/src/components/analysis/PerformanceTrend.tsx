import { GlassPanel } from '../common/GlassPanel'
import { PerformanceGraph } from '../charts/PerformanceGraph'

interface PerformanceTrendProps {
  isLoading: boolean
  data: Array<{ month: string; value: number; rank: number }>
}

export const PerformanceTrend = ({ isLoading, data }: PerformanceTrendProps) => {
  if (isLoading) {
    return (
      <div className="px-6 mb-6">
        <GlassPanel className="p-6 rounded-2xl">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto mb-4" />
              <p className="text-white/60 text-sm">Loading performance data...</p>
            </div>
          </div>
          {/* Shimmer effect */}
          <div className="shimmer-bg h-48 rounded-lg mt-4" />
        </GlassPanel>
      </div>
    )
  }

  return (
    <div className="px-6 mb-6">
      <GlassPanel className="p-6 rounded-2xl">
        <h3 className="text-lg font-semibold text-white mb-6">Performance Trend</h3>
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
