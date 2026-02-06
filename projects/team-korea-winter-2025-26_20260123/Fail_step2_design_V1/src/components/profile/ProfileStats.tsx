import { GlassPanel } from '../common/GlassPanel'

interface ProfileStatsProps {
  age: number
  height: string
  weight: string
  team: string
}

export const ProfileStats = ({ age, height, weight, team }: ProfileStatsProps) => {
  const stats = [
    { label: 'Age', value: age },
    { label: 'Height', value: height },
    { label: 'Weight', value: weight },
    { label: 'Team', value: team }
  ]

  return (
    <div className="px-6 -mt-6 mb-6">
      <div className="grid grid-cols-4 gap-3">
        {stats.map((stat, idx) => (
          <GlassPanel key={idx} variant="card" className="p-3 rounded-xl text-center">
            <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
            <div className="text-[10px] text-white/60 uppercase tracking-wide">
              {stat.label}
            </div>
          </GlassPanel>
        ))}
      </div>
    </div>
  )
}
