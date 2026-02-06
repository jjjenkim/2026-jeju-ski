import { Search, X } from 'lucide-react';

interface FiltersProps {
  availableFilters: {
    종목: string[];
    세부종목: string[];
    연령대: string[];
    시즌: string[];
  };
  activeFilters: {
    종목: string[];
    세부종목: string[];
    연령대: string[];
    시즌: string[];
    검색어: string;
  };
  onToggleFilter: (category: '종목' | '세부종목' | '연령대' | '시즌', value: string) => void;
  onSearchChange: (term: string) => void;
  onClearFilters: () => void;
}

export function Filters({
  availableFilters,
  activeFilters,
  onToggleFilter,
  onSearchChange,
  onClearFilters
}: FiltersProps) {
  const hasActiveFilters =
    activeFilters.종목.length > 0 ||
    activeFilters.세부종목.length > 0 ||
    activeFilters.연령대.length > 0 ||
    activeFilters.시즌.length > 0 ||
    activeFilters.검색어.length > 0;

  return (
    <div className="card mb-6">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4 lg:mb-0">
          필터
        </h2>

        {hasActiveFilters && (
          <button
            onClick={onClearFilters}
            className="flex items-center space-x-2 px-4 py-2 text-sm bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-md hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
          >
            <X size={16} />
            <span>필터 초기화</span>
          </button>
        )}
      </div>

      {/* Search */}
      <div className="mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="선수명 또는 소속 검색..."
            value={activeFilters.검색어}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-ksa-dark-border rounded-md bg-white dark:bg-ksa-dark text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-ksa-primary focus:border-transparent"
          />
        </div>
      </div>

      {/* Filter Groups */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 종목 */}
        <FilterGroup
          title="종목"
          options={availableFilters.종목}
          activeValues={activeFilters.종목}
          onToggle={(value) => onToggleFilter('종목', value)}
        />

        {/* 세부종목 */}
        <FilterGroup
          title="세부종목"
          options={availableFilters.세부종목}
          activeValues={activeFilters.세부종목}
          onToggle={(value) => onToggleFilter('세부종목', value)}
        />

        {/* 연령대 */}
        <FilterGroup
          title="연령대"
          options={availableFilters.연령대}
          activeValues={activeFilters.연령대}
          onToggle={(value) => onToggleFilter('연령대', value)}
        />

        {/* 시즌 */}
        <FilterGroup
          title="시즌"
          options={availableFilters.시즌}
          activeValues={activeFilters.시즌}
          onToggle={(value) => onToggleFilter('시즌', value)}
        />
      </div>
    </div>
  );
}

interface FilterGroupProps {
  title: string;
  options: string[];
  activeValues: string[];
  onToggle: (value: string) => void;
}

function FilterGroup({ title, options, activeValues, onToggle }: FilterGroupProps) {
  return (
    <div>
      <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
        {title}
      </h3>
      <div className="flex flex-wrap gap-2">
        {options.map(option => (
          <button
            key={option}
            onClick={() => onToggle(option)}
            className={`filter-button text-sm ${
              activeValues.includes(option)
                ? 'filter-button-active'
                : 'filter-button-inactive'
            }`}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
}
