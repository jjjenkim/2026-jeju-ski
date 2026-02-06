import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts'

const COLORS = ['#003478', '#C60C30', '#FFD700', '#6B7280', '#0057A8', '#E61B3F']

export const SportDistributionChart = ({ stats }: { stats: any }) => {
      // stats.by_sport comes from athletes.json
      const data = Object.entries(stats?.by_sport || {}).map(([name, value]) => ({
            name: name.replace('_', ' ').toUpperCase(),
            value
      }))

      return (
            <div style={{ width: '100%', height: 200 }}>
                  {/* Explicit Height for Recharts Fix */}
                  <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                              <Pie
                                    data={data}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={40}
                                    outerRadius={70}
                                    paddingAngle={5}
                                    dataKey="value"
                              >
                                    {data.map((_, index) => (
                                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="none" />
                                    ))}
                              </Pie>
                              <Tooltip
                                    contentStyle={{ backgroundColor: '#181010', border: '1px solid #333', borderRadius: '8px' }}
                                    itemStyle={{ color: '#fff' }}
                              />
                              <Legend iconSize={8} wrapperStyle={{ fontSize: '10px', color: '#999' }} />
                        </PieChart>
                  </ResponsiveContainer>
            </div>
      )
}
