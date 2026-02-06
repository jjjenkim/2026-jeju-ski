import { GlassPanel } from '../common/GlassPanel'
import { SparklineChart } from '../charts/SparklineChart'

interface AthleteResultCardProps {
  rank: number
  name: string
  event: string
  score: number
  performance: number[]
}

export const AthleteResultCard = ({
  rank,
  name,
  event,
  score,
  performance
}: AthleteResultCardProps) => {
  return (
    <GlassPanel variant="card" className="p-4 rounded-xl">
      <div className="grid grid-cols-[auto_1fr_auto] gap-4 items-center">
        {/* Rank */}
        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
          <span className="text-primary font-black text-sm">
            {String(rank).padStart(2, '0')}
          </span>
        </div>

        {/* Name & Event */}
        <div className="min-w-0">
          <div className="font-semibold text-white truncate">{name}</div>
          <div className="text-sm text-white/60 truncate">{event}</div>
        </div>

        {/* Score & Sparkline */}
        <div className="flex flex-col items-end gap-1">
          <div className="text-white font-bold">{score}</div>
          <SparklineChart values={performance} />
        </div>
      </div>
    </GlassPanel>
  )
}
