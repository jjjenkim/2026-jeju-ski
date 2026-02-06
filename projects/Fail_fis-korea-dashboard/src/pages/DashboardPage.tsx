import { Filters } from '../components/Filters';
import { StatsCards } from '../components/StatsCards';
import { RankingCards } from '../components/RankingCards';
import { CategoryPieChart } from '../components/charts/CategoryPieChart';
import { RecentPerformanceChart } from '../components/charts/RecentPerformanceChart';
import { SeasonTrendChart } from '../components/charts/SeasonTrendChart';
import { DisciplineHeatmap } from '../components/charts/DisciplineHeatmap';
import { AgeGroupBarChart } from '../components/charts/AgeGroupBarChart';
import { AthleteTable } from '../components/charts/AthleteTable';
import { ErrorBoundary } from '../components/ErrorBoundary';
import { useFilters } from '../hooks/useFilters';
import type { Athlete } from '../types';

interface DashboardPageProps {
      athletes: Athlete[];
      lastUpdated?: string;
      darkMode: boolean;
}

export function DashboardPage({ athletes, lastUpdated, darkMode }: DashboardPageProps) {
      const {
            filters,
            availableFilters,
            filteredAthletes,
            toggleFilter,
            setSearchTerm,
            clearFilters
      } = useFilters(athletes);

      return (
            <div className="animate-slide-up space-y-6">
                  {/* Dashboard Description */}
                  <div className="mb-8 p-6 bg-white dark:bg-ksa-dark-card rounded-2xl shadow-sm border border-gray-100 dark:border-ksa-dark-border">
                        <h2 className="text-lg font-black text-gray-900 dark:text-white mb-2 tracking-tight">DASHBOARD OVERVIEW</h2>
                        <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-sm font-medium">
                              본 대시보드는 FIS(국제스키연맹) 공식 데이터를 기반으로 대한민국 국가대표 선수단의 성적을 실시간으로 분석합니다.
                        </p>
                  </div>

                  {/* Stats Cards */}
                  <ErrorBoundary>
                        <StatsCards athletes={filteredAthletes} />
                  </ErrorBoundary>

                  <ErrorBoundary>
                        <Filters
                              availableFilters={availableFilters}
                              activeFilters={filters}
                              onToggleFilter={toggleFilter}
                              onSearchChange={setSearchTerm}
                              onClearFilters={clearFilters}
                        />
                  </ErrorBoundary>

                  <ErrorBoundary>
                        <RankingCards athletes={filteredAthletes} />
                  </ErrorBoundary>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <ErrorBoundary>
                              <div className="glass-card">
                                    <CategoryPieChart athletes={filteredAthletes} darkMode={darkMode} />
                              </div>
                        </ErrorBoundary>
                        <ErrorBoundary>
                              <div className="glass-card">
                                    <RecentPerformanceChart athletes={filteredAthletes} darkMode={darkMode} />
                              </div>
                        </ErrorBoundary>
                        <ErrorBoundary>
                              <div className="glass-card">
                                    <SeasonTrendChart athletes={filteredAthletes} darkMode={darkMode} />
                              </div>
                        </ErrorBoundary>
                        <ErrorBoundary>
                              <div className="glass-card">
                                    <DisciplineHeatmap athletes={filteredAthletes} darkMode={darkMode} />
                              </div>
                        </ErrorBoundary>
                  </div>

                  <ErrorBoundary>
                        <div className="glass-card">
                              <AgeGroupBarChart athletes={filteredAthletes} darkMode={darkMode} />
                        </div>
                  </ErrorBoundary>

                  <ErrorBoundary>
                        <div className="glass-card overflow-hidden">
                              <AthleteTable athletes={filteredAthletes} lastUpdated={lastUpdated} />
                        </div>
                  </ErrorBoundary>
            </div>
      );
}
