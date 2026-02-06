import { BarChart, Bar, ResponsiveContainer, Cell } from 'recharts'

interface SparklineProps {
      data: number[] // e.g. [40, 60, 80, 50]
      color?: string
      height?: number
}

export const Sparkline = ({ data, color = '#ff4747', height = 24 }: SparklineProps) => {
      const chartData = data.map((val, i) => ({ i, val }))

      return (
            <div style={{ width: 60, height }}>
                  <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData}>
                              <Bar dataKey="val" radius={[2, 2, 0, 0]}>
                                    {chartData.map((entry, index) => (
                                          <Cell
                                                key={`cell-${index}`}
                                                fill={color}
                                                opacity={0.3 + (entry.val / 100) * 0.7} // Dynamic opacity based on value
                                          />
                                    ))}
                              </Bar>
                        </BarChart>
                  </ResponsiveContainer>
            </div>
      )
}
