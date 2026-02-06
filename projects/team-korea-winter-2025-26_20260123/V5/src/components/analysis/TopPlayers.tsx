import { GlassPanel } from '../common/GlassPanel'

interface Player {
  name: string
  score: number
  change: number
}

const mockPlayers: Player[] = [
  { name: '이상호', score: 1240, change: 12 },
  { name: '김다은', score: 1180, change: 8 },
  { name: '정동현', score: 1050, change: -3 }
]

export const TopPlayers = () => {
  const getInitials = (name: string) => {
    return name.slice(0, 2)
  }

  const gradients = [
    'bg-gradient-to-br from-primary to-red-600',
    'bg-gradient-to-br from-secondary-blue to-blue-600',
    'bg-gradient-to-br from-purple-500 to-pink-600'
  ]

  return (
    <div className="px-6 pb-24">
      <h3 className="text-lg font-semibold text-white mb-4">Top Performers</h3>
      <div className="space-y-3">
        {mockPlayers.map((player, idx) => (
          <GlassPanel key={idx} variant="card" className="p-4 rounded-xl">
            <div className="flex items-center gap-3">
              {/* Avatar */}
              <div className={`w-12 h-12 rounded-full ${gradients[idx]} flex items-center justify-center flex-shrink-0`}>
                <span className="text-white font-bold text-sm">
                  {getInitials(player.name)}
                </span>
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-white">{player.name}</div>
                <div className="text-sm text-white/60">
                  {player.change > 0 ? '+' : ''}{player.change}% this month
                </div>
              </div>

              {/* Score */}
              <div className="text-right">
                <div className="text-xl font-bold text-white">{player.score}</div>
                <div className="text-xs text-white/40">points</div>
              </div>
            </div>
          </GlassPanel>
        ))}
      </div>
    </div>
  )
}
