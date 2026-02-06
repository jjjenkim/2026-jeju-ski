interface FilterSelectorProps {
  activeFilter: 'week' | 'month' | 'season'
  onFilterChange: (filter: 'week' | 'month' | 'season') => void
}

const filters: Array<{ value: 'week' | 'month' | 'season'; label: string }> = [
  { value: 'week', label: 'Week' },
  { value: 'month', label: 'Month' },
  { value: 'season', label: 'Season' }
]

export const FilterSelector = ({ activeFilter, onFilterChange }: FilterSelectorProps) => {
  return (
    <div className="px-6 py-4">
      <div className="flex gap-2">
        {filters.map((filter) => (
          <button
            key={filter.value}
            onClick={() => onFilterChange(filter.value)}
            className={`px-6 py-2 rounded-full text-sm font-semibold transition-all ${
              activeFilter === filter.value
                ? 'bg-primary text-white'
                : 'bg-white/10 text-white/60 hover:bg-white/20'
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>
    </div>
  )
}
