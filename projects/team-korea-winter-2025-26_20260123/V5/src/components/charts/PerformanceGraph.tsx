import { useState } from 'react'

interface DataPoint {
  month: string
  value: number
  rank?: number
}

interface PerformanceGraphProps {
  data: DataPoint[]
  primaryColor?: string
  secondaryColor?: string
}

export const PerformanceGraph = ({
  data,
  primaryColor = '#ff4747',
  secondaryColor = '#148CFF'
}: PerformanceGraphProps) => {
  const [hoveredPoint, setHoveredPoint] = useState<number | null>(null)

  const generatePath = (values: number[]) => {
    if (values.length === 0) return ''

    const points = values.map((v, i) => ({
      x: (i / (values.length - 1)) * 100,
      y: 100 - v
    }))

    let path = `M${points[0].x},${points[0].y}`
    for (let i = 1; i < points.length; i++) {
      const prev = points[i - 1]
      const curr = points[i]
      const cpx = (prev.x + curr.x) / 2
      path += ` Q${cpx},${prev.y},${curr.x},${curr.y}`
    }
    return path
  }

  const values = data.map(d => d.value)
  const ranks = data.map(d => d.rank || 0)

  return (
    <div className="relative w-full h-48">
      <svg viewBox="0 0 100 100" className="w-full h-full" preserveAspectRatio="none">
        {/* Grid lines */}
        {[0, 25, 50, 75, 100].map(y => (
          <line
            key={y}
            x1="0"
            y1={y}
            x2="100"
            y2={y}
            stroke="rgba(255,255,255,0.1)"
            strokeWidth="0.5"
          />
        ))}

        {/* Secondary line (dashed) */}
        <path
          d={generatePath(ranks)}
          fill="none"
          stroke={secondaryColor}
          strokeWidth="1.5"
          strokeDasharray="3,3"
          opacity="0.6"
        />

        {/* Primary line (solid) */}
        <path
          d={generatePath(values)}
          fill="none"
          stroke={primaryColor}
          strokeWidth="2"
          className="animate-draw"
        />

        {/* Data points */}
        {data.map((d, i) => {
          const x = (i / (data.length - 1)) * 100
          const y = 100 - d.value
          return (
            <circle
              key={i}
              cx={x}
              cy={y}
              r={hoveredPoint === i ? 3 : 2}
              fill={primaryColor}
              className="cursor-pointer transition-all"
              onMouseEnter={() => setHoveredPoint(i)}
              onMouseLeave={() => setHoveredPoint(null)}
            />
          )
        })}
      </svg>

      {/* Tooltip */}
      {hoveredPoint !== null && (
        <div className="premium-tooltip absolute top-0 left-1/2 transform -translate-x-1/2 px-3 py-2 rounded-lg text-sm">
          <div className="font-semibold">{data[hoveredPoint].month}</div>
          <div className="text-xs">Value: {data[hoveredPoint].value.toFixed(1)}</div>
          {data[hoveredPoint].rank && (
            <div className="text-xs">Rank: #{data[hoveredPoint].rank}</div>
          )}
        </div>
      )}
    </div>
  )
}
