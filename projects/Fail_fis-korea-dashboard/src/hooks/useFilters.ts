import { useState, useMemo } from 'react';
import type { Athlete, FilterState } from '../types';

export function useFilters(athletes: Athlete[]) {
  const [filters, setFilters] = useState<FilterState>({
    종목: [],
    세부종목: [],
    연령대: [],
    시즌: [],
    검색어: ''
  });

  const availableFilters = useMemo(() => {
    return {
      종목: Array.from(new Set(athletes.map(a => a.종목))).sort(),
      세부종목: Array.from(new Set(athletes.map(a => a.세부종목))).sort(),
      연령대: Array.from(new Set(athletes.map(a => a.연령대))).sort(),
      시즌: Array.from(new Set(athletes.map(a => a.시즌))).sort()
    };
  }, [athletes]);

  const filteredAthletes = useMemo(() => {
    return athletes.filter(athlete => {
      // 종목 filter
      if (filters.종목.length > 0 && !filters.종목.includes(athlete.종목)) {
        return false;
      }

      // 세부종목 filter
      if (filters.세부종목.length > 0 && !filters.세부종목.includes(athlete.세부종목)) {
        return false;
      }

      // 연령대 filter
      if (filters.연령대.length > 0 && !filters.연령대.includes(athlete.연령대)) {
        return false;
      }

      // 시즌 filter
      if (filters.시즌.length > 0 && !filters.시즌.includes(athlete.시즌)) {
        return false;
      }

      // 검색어 filter
      if (filters.검색어) {
        const searchLower = filters.검색어.toLowerCase();
        return (
          athlete.선수명.toLowerCase().includes(searchLower) ||
          athlete.소속.toLowerCase().includes(searchLower)
        );
      }

      return true;
    });
  }, [athletes, filters]);

  const toggleFilter = (category: keyof Omit<FilterState, '검색어'>, value: string) => {
    setFilters(prev => {
      const current = prev[category];
      const updated = current.includes(value)
        ? current.filter(v => v !== value)
        : [...current, value];

      return { ...prev, [category]: updated };
    });
  };

  const setSearchTerm = (term: string) => {
    setFilters(prev => ({ ...prev, 검색어: term }));
  };

  const clearFilters = () => {
    setFilters({
      종목: [],
      세부종목: [],
      연령대: [],
      시즌: [],
      검색어: ''
    });
  };

  return {
    filters,
    availableFilters,
    filteredAthletes,
    toggleFilter,
    setSearchTerm,
    clearFilters
  };
}
