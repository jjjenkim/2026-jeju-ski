import { useState } from 'react'

interface FilterTabsProps {
  onFilterChange?: (filter: string) => void
}

const filters = ['All Sports', 'Snowboard', 'Alpine Ski', 'Freestyle']

export const FilterTabs = ({ onFilterChange }: FilterTabsProps) => {
  const [activeFilter, setActiveFilter] = useState('All Sports')

  const handleFilterClick = (filter: string) => {
    setActiveFilter(filter)
    onFilterChange?.(filter)
  }

  return (
    <div className="px-6 mb-6">
      <div className="flex gap-2 overflow-x-auto scrollbar-hide">
        {filters.map((filter) => (
          <button
            key={filter}
            onClick={() => handleFilterClick(filter)}
            className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all ${
              activeFilter === filter
                ? 'bg-white text-background-dark'
                : 'bg-white/10 text-white/60 hover:bg-white/20'
            }`}
          >
            {filter}
          </button>
        ))}
      </div>
    </div>
  )
}
