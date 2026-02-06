import { GlassPanel } from '../common/GlassPanel'
import { MaterialIcon } from '../common/MaterialIcon'

interface Highlight {
  title: string
  date: string
  location: string
  medal?: 'gold' | 'silver' | 'bronze'
}

const mockHighlights: Highlight[] = [
  {
    title: 'FIS World Cup - Gold Medal',
    date: '2026-01-15',
    location: 'Kitzbühel, Austria',
    medal: 'gold'
  },
  {
    title: 'Asian Winter Games - Silver',
    date: '2025-12-20',
    location: 'Harbin, China',
    medal: 'silver'
  },
  {
    title: 'National Championship - Gold',
    date: '2025-11-10',
    location: 'PyeongChang, Korea',
    medal: 'gold'
  }
]

export const CareerHighlights = () => {
  const medalColors = {
    gold: 'text-yellow-400',
    silver: 'text-gray-300',
    bronze: 'text-orange-400'
  }

  return (
    <div className="px-6 pb-24">
      <h3 className="text-lg font-semibold text-white mb-4">Career Highlights</h3>
      <div className="space-y-3">
        {mockHighlights.map((highlight, idx) => (
          <GlassPanel key={idx} variant="card" className="p-4 rounded-xl">
            <div className="flex gap-3">
              <MaterialIcon
                name="emoji_events"
                filled
                className={highlight.medal ? medalColors[highlight.medal] : 'text-white/40'}
              />
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-white mb-1">{highlight.title}</div>
                <div className="text-sm text-white/60">{highlight.date}</div>
                <div className="text-sm text-white/40">{highlight.location}</div>
              </div>
            </div>
          </GlassPanel>
        ))}
      </div>
    </div>
  )
}
