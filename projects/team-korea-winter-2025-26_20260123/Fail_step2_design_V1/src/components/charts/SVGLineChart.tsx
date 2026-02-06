interface DataPoint {
  month: string
  value: number
}

interface SVGLineChartProps {
  data: DataPoint[]
  color: string
  animated?: boolean
}

export const SVGLineChart = ({ data, color, animated = false }: SVGLineChartProps) => {
  // Generate SVG path from data points
  const generatePath = () => {
    if (data.length === 0) return ''

    const points = data.map((d, i) => ({
      x: (i / (data.length - 1)) * 100,
      y: 100 - d.value
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

  return (
    <svg viewBox="0 0 100 100" className="w-full h-full" preserveAspectRatio="none">
      <path
        d={generatePath()}
        fill="none"
        stroke={color}
        strokeWidth="2"
        className={animated ? 'animate-draw' : ''}
      />
    </svg>
  )
}
