import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';


export const V6_Hero = () => {

      const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0, isPast: false });

      useEffect(() => {
            // Target: Milano 2026 Opening Ceremony (Midnight or Evening)
            // User requested D+ counting, so we set this to the start of the timeframe.
            const targetDate = new Date('2026-02-06T00:00:00');

            const calculateTimeLeft = () => {
                  const now = new Date();
                  const difference = targetDate.getTime() - now.getTime();
                  const isPast = difference < 0;
                  const absDiff = Math.abs(difference);

                  return {
                        days: Math.floor(absDiff / (1000 * 60 * 60 * 24)),
                        hours: Math.floor((absDiff / (1000 * 60 * 60)) % 24),
                        minutes: Math.floor((absDiff / 1000 / 60) % 60),
                        seconds: Math.floor((absDiff / 1000) % 60),
                        isPast
                  };
            };

            setTimeLeft(calculateTimeLeft()); // Initial call

            const timer = setInterval(() => {
                  setTimeLeft(calculateTimeLeft());
            }, 1000);

            return () => clearInterval(timer);
      }, []);

      return (
            <header className="hero-gradient pt-16 pb-12 px-6 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                        <div className="text-[120px] font-black italic select-none">KR</div>
                  </div>

                  <div className="max-w-7xl mx-auto">
                        <div className="mb-12 text-left relative z-10">
                              <motion.h2
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="text-[10px] font-bold tracking-[0.4em] text-[#7691AD] mb-2 uppercase font-sans text-left"
                              >
                                    Republic of Korea
                              </motion.h2>
                              <motion.h1
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.8, ease: "easeOut" }}
                                    className="huge-title text-white flex flex-col items-start leading-[0.8] font-display text-left"
                              >
                                    <span className="opacity-90 leading-none">TEAM</span>
                                    <span className="text-[var(--primary)] drop-shadow-[0_0_30px_rgba(255,146,154,0.3)] leading-none">KOREA</span>
                              </motion.h1>
                              <motion.p
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.5 }}
                                    className="text-[11px] font-medium tracking-[0.2em] text-gray-500 mt-6 uppercase text-left pl-1"
                              >
                                    SKI & SNOWBOARD
                              </motion.p>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 relative z-10">
                              <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.6 }}
                                    className="glass-card px-8 py-5 flex-1 border-l-4 border-l-[var(--primary)]"
                              >
                                    <div className="flex items-baseline gap-2">
                                          <span className="text-4xl font-black italic tabular-nums">
                                                {timeLeft.isPast
                                                      ? (timeLeft.days === 0 ? "D-DAY" : `D+${timeLeft.days}`)
                                                      : `D-${timeLeft.days}`
                                                }
                                          </span>
                                          <span className="text-xs text-gray-400 font-medium tracking-tight">
                                                {timeLeft.hours}h {timeLeft.minutes}m {timeLeft.seconds}s
                                          </span>
                                    </div>
                              </motion.div>
                              <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.7 }}
                                    className="glass-card px-8 py-5 flex-1 border-l-4 border-l-[var(--secondary)]"
                              >
                                    <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-2">Elite National Squad</p>
                                    <div className="flex items-baseline gap-2">
                                          <span className="text-4xl font-black italic">43</span>
                                          <span className="text-xs text-gray-400 font-medium tracking-tight">Active Athletes</span>
                                    </div>
                              </motion.div>
                        </div>
                  </div>

                  {/* Background Ambience */}
                  <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-[#53728A]/10 blur-[120px] rounded-full pointer-events-none" />
            </header >
      );
};
