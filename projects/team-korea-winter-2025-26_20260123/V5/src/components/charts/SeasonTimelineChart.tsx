import { LineChart, Line, XAxis, Tooltip, ResponsiveContainer } from 'recharts'

export const SeasonTimelineChart = () => {
      // Mock data as this specific timeline data isn't in athletes.json usually
      const data = [
            { month: 'SEP', events: 5 },
            { month: 'OCT', events: 12 },
            { month: 'NOV', events: 18 },
            { month: 'DEC', events: 25 },
            { month: 'JAN', events: 22 },
            { month: 'FEB', events: 20 },
            { month: 'MAR', events: 15 },
      ]

      return (
            <div style={{ width: '100%', height: 200 }}>
                  <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={data}>
                              <XAxis dataKey="month" tick={{ fill: '#666', fontSize: 10 }} axisLine={false} tickLine={false} />
                              <Tooltip
                                    contentStyle={{ backgroundColor: '#181010', border: '1px solid #333', borderRadius: '8px' }}
                                    itemStyle={{ color: '#fff' }}
                              />
                              <Line
                                    type="monotone"
                                    dataKey="events"
                                    stroke="#ff4747"
                                    strokeWidth={3}
                                    dot={{ fill: '#ff4747', r: 4 }}
                                    activeDot={{ r: 6, fill: '#fff' }}
                              />
                        </LineChart>
                  </ResponsiveContainer>
            </div>
      )
}
