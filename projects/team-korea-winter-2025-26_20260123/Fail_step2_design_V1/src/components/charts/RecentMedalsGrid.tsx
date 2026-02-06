export const RecentMedalsGrid = ({ athletes }: { athletes: any[] }) => {
      // Filter athletes with medals
      const medalists = athletes
            .filter(a => (a.medals?.gold || 0) + (a.medals?.silver || 0) + (a.medals?.bronze || 0) > 0)
            .slice(0, 4) // Show top 4

      return (
            <div className="grid grid-cols-2 gap-3">
                  {medalists.map(athlete => (
                        <div key={athlete.id} className="p-3 rounded-xl bg-white/5 border border-white/5 flex flex-col gap-2">
                              <div className="flex justify-between items-start">
                                    <span className="text-white font-bold text-sm">{athlete.name_ko}</span>
                                    <span className="text-[10px] text-gray-400">{athlete.sport_display?.split('-')[0]}</span>
                              </div>
                              <div className="flex gap-1">
                                    {athlete.medals.gold > 0 && <span className="bg-gradient-to-br from-yellow-400 to-yellow-600 text-[10px] text-black font-bold px-1.5 py-0.5 rounded">🥇 {athlete.medals.gold}</span>}
                                    {athlete.medals.silver > 0 && <span className="bg-gradient-to-br from-gray-300 to-gray-400 text-[10px] text-black font-bold px-1.5 py-0.5 rounded">🥈 {athlete.medals.silver}</span>}
                                    {athlete.medals.bronze > 0 && <span className="bg-gradient-to-br from-orange-400 to-orange-600 text-[10px] text-black font-bold px-1.5 py-0.5 rounded">🥉 {athlete.medals.bronze}</span>}
                              </div>
                        </div>
                  ))}
                  {medalists.length === 0 && <p className="text-gray-500 text-sm col-span-2">No recent medals recorded.</p>}
            </div>
      )
}
