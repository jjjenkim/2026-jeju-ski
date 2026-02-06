import { useState } from 'react'

const sports = ['Alpine', 'Snowboard', 'Freestyle', 'Cross-Country', 'Biathlon']

export const SportTabs = () => {
  const [activeSport, setActiveSport] = useState('Alpine')

  return (
    <div className="px-6 mb-6">
      <div className="flex gap-3 overflow-x-auto scrollbar-hide">
        {sports.map((sport) => (
          <button
            key={sport}
            onClick={() => setActiveSport(sport)}
            className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all ${
              activeSport === sport
                ? 'bg-secondary-blue text-white'
                : 'bg-white/10 text-white/60 hover:bg-white/20'
            }`}
          >
            {sport}
          </button>
        ))}
      </div>
    </div>
  )
}
