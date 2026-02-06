interface SparklineChartProps {
  values: number[]
}

export const SparklineChart = ({ values }: SparklineChartProps) => {
  // Normalize values to 4 bars with graduated heights
  const heights = ['h-2', 'h-3', 'h-4', 'h-5']
  const opacities = ['opacity-20', 'opacity-40', 'opacity-60', 'opacity-100']

  const normalizedValues = values.slice(0, 4).map((val, idx) => ({
    height: heights[Math.min(Math.floor((val / 100) * 4), 3)],
    opacity: opacities[idx]
  }))

  return (
    <div className="flex items-end gap-0.5 h-6">
      {normalizedValues.map((bar, idx) => (
        <div
          key={idx}
          className={`w-1 rounded-full bg-secondary-blue ${bar.height} ${bar.opacity}`}
        />
      ))}
    </div>
  )
}
