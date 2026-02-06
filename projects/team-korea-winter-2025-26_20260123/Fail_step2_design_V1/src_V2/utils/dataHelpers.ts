interface Athlete {
  name_ko?: string
  current_rank?: number
  sport?: string
  [key: string]: any
}

export const getTopAthletes = (athletes: Athlete[], count = 5): Athlete[] => {
  return athletes
    .filter(a => a.current_rank && a.current_rank > 0)
    .sort((a, b) => (a.current_rank || 0) - (b.current_rank || 0))
    .slice(0, count)
}

export const filterBySport = (athletes: Athlete[], sport: string): Athlete[] => {
  if (sport === 'All Sports') return athletes
  return athletes.filter(a => a.sport === sport)
}

export const mockPerformanceData = () => {
  return ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'].map(month => ({
    month,
    value: Math.random() * 100,
    rank: Math.floor(Math.random() * 30) + 1
  }))
}
