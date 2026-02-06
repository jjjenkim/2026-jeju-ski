import { GlassPanel } from '../common/GlassPanel'

export const StatsGrid = () => {
  const stats = [
    {
      label: 'Milano Cortina 2026',
      value: 'D-452',
      accent: 'border-l-4 border-primary'
    },
    {
      label: 'Elite Squad',
      value: '124',
      accent: 'border-l-4 border-secondary-blue'
    }
  ]

  return (
    <div className="grid grid-cols-2 gap-4 px-6 -mt-12">
      {stats.map((stat, idx) => (
        <GlassPanel key={idx} className={`p-4 rounded-2xl ${stat.accent}`}>
          <div className="text-xs text-white/60 uppercase tracking-wide font-semibold">
            {stat.label}
          </div>
          <div className="text-3xl font-bold text-white mt-1">
            {stat.value}
          </div>
        </GlassPanel>
      ))}
    </div>
  )
}
