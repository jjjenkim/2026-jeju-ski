import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

export const TeamStatusBarChart = ({ stats }: { stats: any }) => {
      // stats.by_team comes from athletes.json
      const data = Object.entries(stats?.by_team || {}).map(([name, value]) => ({
            name,
            value
      }))

      return (
            <div style={{ width: '100%', height: 200 }}>
                  <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                              <XAxis type="number" hide />
                              <YAxis dataKey="name" type="category" width={80} tick={{ fill: '#999', fontSize: 10 }} axisLine={false} tickLine={false} />
                              <Tooltip
                                    cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                                    contentStyle={{ backgroundColor: '#181010', border: '1px solid #333', borderRadius: '8px' }}
                              />
                              <Bar dataKey="value" fill="#ff4747" radius={[0, 4, 4, 0]} barSize={20} />
                        </BarChart>
                  </ResponsiveContainer>
            </div>
      )
}
