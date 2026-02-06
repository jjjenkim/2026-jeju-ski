import { V6_Hero as Hero } from '../components/dashboard/V6_HeroSection';
import { V6_PerformanceAnalysis as PerformanceAnalysis } from '../components/dashboard/V6_PerformanceAnalysis';
import { V6_DistributionCharts as DistributionCharts } from '../components/dashboard/V6_DistributionCharts';
import { useAthletes } from '../hooks/useAthletes';

export const V6_DashboardPage = () => {
      const { stats, athletes } = useAthletes();

      return (
            <div className="min-h-screen bg-[#050505] text-white selection:bg-[#FF929A] selection:text-white pb-32">
                  <header className="fixed top-0 left-0 right-0 z-50 p-4 bg-black/20 backdrop-blur-md border-b border-white/5">
                        <div className="max-w-7xl mx-auto flex items-center justify-between">
                              <span className="font-display font-black italic text-xl tracking-tighter uppercase transition-colors">TEAM <span className="text-[var(--primary)]">KOREA</span></span>
                              <div className="flex gap-2">
                                    <div className="size-2 rounded-full bg-[var(--primary)] shadow-[0_0_10px_rgba(255,70,70,0.5)]"></div>
                                    <div className="size-2 rounded-full bg-[var(--secondary)]"></div>
                              </div>
                        </div>
                  </header>

                  <main className="relative z-10 w-full max-w-7xl mx-auto bg-transparent min-h-screen">
                        <Hero />

                        {/* V3 Performance Analysis Section */}
                        <div className="px-4 lg:px-6">
                              <PerformanceAnalysis />
                        </div>


                        {/* Distribution Details Section */}
                        <div className="px-6 lg:px-8 mt-12">
                              {/* @ts-ignore */}
                              <DistributionCharts stats={stats} athletes={athletes} />
                        </div>
                  </main>

                  {/* Footer */}
                  <footer className="py-12 bg-black/40 backdrop-blur-lg border-t border-white/5 mt-20">
                        <div className="max-w-7xl mx-auto px-10 text-center text-gray-700 font-bold uppercase tracking-[0.2em] text-[8px] flex flex-col items-center gap-2">
                              <p>© TEAM KOREA SKI & SNOWBOARD</p>
                              <div className="flex items-center gap-2 text-[7px] text-gray-800">
                                    <span>PERFORMANCE DATA SERVICE</span>
                              </div>
                        </div>
                  </footer>
            </div>
      );
};
