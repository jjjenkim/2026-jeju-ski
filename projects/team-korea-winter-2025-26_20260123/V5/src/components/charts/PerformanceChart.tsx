import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import { motion } from 'framer-motion'

interface PerformanceChartProps {
      data?: any[]
}

const defaultData = [
      { name: 'OCT', alpine: 30, snowboard: 45 },
      { name: 'NOV', alpine: 50, snowboard: 55 },
      { name: 'DEC', alpine: 75, snowboard: 60 },
      { name: 'JAN', alpine: 60, snowboard: 80 },
      { name: 'FEB', alpine: 90, snowboard: 70 },
      { name: 'MAR', alpine: 85, snowboard: 88 },
]

const CustomTooltip = ({ active, payload, label }: any) => {
      if (active && payload && payload.length) {
            return (
                  <div className="premium-tooltip p-3 rounded-xl border border-white/20 shadow-2xl backdrop-blur-md">
                        <p className="text-[10px] font-bold text-gray-400 mb-2 uppercase tracking-wider">{label}</p>
                        <div className="space-y-1">
                              {payload.map((entry: any, index: number) => (
                                    <div key={index} className="flex items-center gap-2">
                                          <div className={`w-1.5 h-1.5 rounded-full ${entry.name === 'snowboard' ? 'bg-secondary' : 'bg-primary'}`} />
                                          <span className="text-xs font-bold text-white uppercase w-20">{entry.name}</span>
                                          <span className="text-sm font-black text-white">{entry.value}</span>
                                    </div>
                              ))}
                        </div>
                  </div>
            )
      }
      return null
}

export const PerformanceChart = ({ data = defaultData }: PerformanceChartProps) => {
      return (
            <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                  className="w-full h-full min-h-[200px]"
            >
                  <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={data} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                              <defs>
                                    <linearGradient id="colorAlpine" x1="0" y1="0" x2="0" y2="1">
                                          <stop offset="5%" stopColor="#ff4747" stopOpacity={0.4} />
                                          <stop offset="95%" stopColor="#ff4747" stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id="colorSnowboard" x1="0" y1="0" x2="0" y2="1">
                                          <stop offset="5%" stopColor="#148CFF" stopOpacity={0.4} />
                                          <stop offset="95%" stopColor="#148CFF" stopOpacity={0} />
                                    </linearGradient>
                              </defs>

                              <CartesianGrid vertical={false} stroke="rgba(255,255,255,0.05)" strokeDasharray="4 4" />

                              <XAxis
                                    dataKey="name"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 10, fontWeight: 600, fontFamily: 'Lexend' }}
                                    dy={10}
                                    interval="preserveStartEnd"
                              />
                              <YAxis hide domain={[0, 100]} />

                              <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 1, strokeDasharray: '4 4' }} />

                              <Area
                                    type="monotone"
                                    dataKey="snowboard"
                                    stroke="#148CFF"
                                    strokeWidth={3}
                                    fillOpacity={1}
                                    fill="url(#colorSnowboard)"
                                    animationDuration={1500}
                              />
                              <Area
                                    type="monotone"
                                    dataKey="alpine"
                                    stroke="#ff4747"
                                    strokeWidth={3}
                                    fillOpacity={1}
                                    fill="url(#colorAlpine)"
                                    animationDuration={1500}
                                    animationBegin={300}
                              />
                        </AreaChart>
                  </ResponsiveContainer>
            </motion.div>
      )
}
