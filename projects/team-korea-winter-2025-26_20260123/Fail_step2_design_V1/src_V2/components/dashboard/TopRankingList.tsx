import { GlassPanel } from '../common/GlassPanel'
import { MaterialIcon } from '../common/MaterialIcon'

interface Athlete {
  rank: number
  name: string
  sport: string
  score: number
  trend: 'up' | 'down' | 'same'
}

const mockAthletes: Athlete[] = [
  { rank: 1, name: '이상호', sport: 'Alpine Skiing', score: 1240, trend: 'up' },
  { rank: 2, name: '김다은', sport: 'Snowboard', score: 1180, trend: 'up' },
  { rank: 3, name: '정동현', sport: 'Freestyle', score: 1050, trend: 'same' },
  { rank: 4, name: '박서윤', sport: 'Alpine Skiing', score: 980, trend: 'down' },
  { rank: 5, name: '이지예', sport: 'Snowboard', score: 920, trend: 'up' }
]

export const TopRankingList = () => {
  return (
    <div className="px-6 mt-8 pb-24">
      <h2 className="text-xl font-bold text-white mb-4">Top Rankings</h2>
      <div className="space-y-3">
        {mockAthletes.map((athlete) => (
          <GlassPanel key={athlete.rank} variant="card" className="p-4 rounded-xl">
            <div className="flex items-center gap-4">
              {/* Rank Badge */}
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                <span className="text-primary font-black text-lg">
                  {String(athlete.rank).padStart(2, '0')}
                </span>
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-white truncate">
                  {athlete.name}
                </div>
                <div className="text-sm text-white/60">{athlete.sport}</div>
              </div>

              {/* Score & Trend */}
              <div className="flex items-center gap-2">
                <span className="text-white font-bold">{athlete.score}</span>
                <MaterialIcon
                  name={
                    athlete.trend === 'up'
                      ? 'trending_up'
                      : athlete.trend === 'down'
                      ? 'trending_down'
                      : 'trending_flat'
                  }
                  className={
                    athlete.trend === 'up'
                      ? 'text-green-400'
                      : athlete.trend === 'down'
                      ? 'text-red-400'
                      : 'text-white/40'
                  }
                />
              </div>
            </div>
          </GlassPanel>
        ))}
      </div>
    </div>
  )
}
