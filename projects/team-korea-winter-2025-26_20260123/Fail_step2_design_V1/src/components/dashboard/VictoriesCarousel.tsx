import { GlassPanel } from '../common/GlassPanel'

interface Victory {
  badge: string
  title: string
  timeAgo: string
}

const mockVictories: Victory[] = [
  {
    badge: 'FIS World Cup',
    title: '이상호 선수, 슬로베니아 대회 금메달 획득',
    timeAgo: '2 HOURS AGO'
  },
  {
    badge: 'National Championship',
    title: '김다은 선수, 스노보드 하프파이프 우승',
    timeAgo: '5 HOURS AGO'
  },
  {
    badge: 'FIS World Cup',
    title: '정동현 선수, 알파인 대회 동메달',
    timeAgo: '1 DAY AGO'
  }
]

export const VictoriesCarousel = () => {
  return (
    <div className="px-6 mt-8">
      <h2 className="text-xl font-bold text-white mb-4">Recent Victories</h2>
      <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-4">
        {mockVictories.map((victory, idx) => (
          <GlassPanel
            key={idx}
            variant="card"
            className="min-w-[280px] p-4 rounded-xl"
          >
            <div className="inline-block px-2 py-1 bg-primary/20 text-primary text-xs font-bold rounded-lg mb-2">
              {victory.badge}
            </div>
            <p className="text-white font-medium mb-2">{victory.title}</p>
            <p className="text-white/40 text-xs uppercase tracking-wide">
              {victory.timeAgo}
            </p>
          </GlassPanel>
        ))}
      </div>
    </div>
  )
}
