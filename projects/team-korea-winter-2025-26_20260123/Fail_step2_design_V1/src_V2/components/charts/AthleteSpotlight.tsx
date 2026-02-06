export const AthleteSpotlight = ({ athlete }: { athlete: any }) => {
      if (!athlete) return null

      return (
            <div className="relative w-full h-64 rounded-3xl overflow-hidden group cursor-pointer knob-shadow border border-white/10">
                  {/* Background Image Mock - in real app, use athlete.image_url */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-primary to-black opacity-80 mix-blend-multiply"></div>
                  <div className="absolute inset-0 bg-[url('/placeholder-athlete.jpg')] bg-cover bg-center grayscale opacity-40 group-hover:scale-105 transition-transform duration-700"></div>

                  <div className="absolute bottom-0 left-0 p-6 w-full bg-gradient-to-t from-black via-black/80 to-transparent">
                        <span className="inline-block px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-[10px] font-bold tracking-widest uppercase mb-3">
                              Athlete of the Month
                        </span>
                        <h3 className="text-3xl font-black italic text-white mb-1">{athlete.name_ko}</h3>
                        <p className="text-gray-300 text-sm font-medium mb-4">{athlete.sport_display}</p>

                        <div className="flex items-center justify-between">
                              <div className="flex gap-4">
                                    <div>
                                          <p className="text-[10px] text-gray-500 uppercase font-bold">World Rank</p>
                                          <p className="text-xl font-black text-primary">#{athlete.current_rank || '-'}</p>
                                    </div>
                                    <div>
                                          <p className="text-[10px] text-gray-500 uppercase font-bold">Points</p>
                                          <p className="text-xl font-black text-white">92.4</p>
                                    </div>
                              </div>
                              <button className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center hover:scale-110 transition-transform">
                                    <span className="material-symbols-outlined">arrow_forward</span>
                              </button>
                        </div>
                  </div>
            </div>
      )
}
