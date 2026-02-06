import { useState, useEffect } from 'react'

export interface Athlete {
  id: string
  name_ko: string
  name_en: string
  birth_year: string
  age: number
  gender: string
  sport: string
  sport_display: string
  team: string
  fis_code: string
  current_rank: number
  total_points: string | number
  medals: {
    gold: number
    silver: number
    bronze: number
  }
  history: {
    name: string
    alpine: number
    snowboard: number
  }[]
}

export interface AthleteData {
  athletes: Athlete[]
  metadata: any
  statistics: {
    total_athletes: number
    by_sport: Record<string, number>
    by_team: Record<string, number>
    by_gender: Record<string, number>
    age_distribution: {
      teens: number
      twenties: number
      thirties: number
    }
    total_medals: {
      gold: number
      silver: number
      bronze: number
    }
  }
}

export const useAthleteData = () => {
  const [data, setData] = useState<AthleteData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    fetch('/data/athletes_enriched.json')
      .then(res => res.json())
      .then(jsonData => {
        setData(jsonData)
        setLoading(false)
      })
      .catch(err => {
        console.error("Failed to load athlete data:", err)
        setError(err)
        setLoading(false)
      })
  }, [])

  return { data, loading, error }
}
