import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

export const AgeHistogram = ({ stats }: { stats: any }) => {
      // stats.age_distribution
      const data = Object.entries(stats?.age_distribution || {}).map(([age, value]) => ({
            age: `${age}s`,
            value
      }))

      return (
            <div style={{ width: '100%', height: 200 }}>
                  <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data}>
                              <XAxis dataKey="age" tick={{ fill: '#666', fontSize: 10 }} axisLine={false} tickLine={false} />
                              <Tooltip
                                    cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                                    contentStyle={{ backgroundColor: '#181010', border: '1px solid #333', borderRadius: '8px' }}
                              />
                              <Bar dataKey="value" fill="#148CFF" radius={[4, 4, 0, 0]} />
                        </BarChart>
                  </ResponsiveContainer>
            </div>
      )
}
