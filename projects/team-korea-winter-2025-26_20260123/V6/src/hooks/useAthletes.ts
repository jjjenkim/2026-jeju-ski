/**
 * Custom hook to load and manage athlete data.
 * Simulates an API call by importing the JSON directly.
 */
import { useState, useEffect } from 'react';
import type { Athlete } from '../types';
import athleteData from '../data/athletes.json';

export const useAthletes = () => {
      const [athletes, setAthletes] = useState<Athlete[]>([]);
      const [loading, setLoading] = useState(true);
      const [lastUpdated, setLastUpdated] = useState<string>('');

      const [stats, setStats] = useState<any>(null);

      useEffect(() => {
            // Simulate network delay using setTimeout
            const timer = setTimeout(() => {
                  let rawAthletes: Athlete[] = [];
                  let lastUpdatedStr = new Date().toISOString();
                  let preCalcStats: any = {};

                  // Handle both Array format (new) and Object format (legacy/metadata included)
                  if (Array.isArray(athleteData)) {
                        rawAthletes = athleteData as unknown as Athlete[];
                  } else {
                        // @ts-ignore
                        rawAthletes = (athleteData.athletes || []) as Athlete[];
                        // @ts-ignore
                        lastUpdatedStr = athleteData.metadata?.last_updated || lastUpdatedStr;
                        // @ts-ignore
                        preCalcStats = athleteData.statistics || {};
                  }

                  setAthletes(rawAthletes);
                  setLastUpdated(lastUpdatedStr);

                  // Merge with any additional calculations needed
                  const newStats = {
                        ...preCalcStats,
                        total_athletes: rawAthletes.length,
                        // Ensure required stats exist even if missing from pre-calc
                        by_sport: preCalcStats.by_sport || rawAthletes.reduce((acc: any, curr) => {
                              const sport = curr.detail_discipline || curr.sport_display || curr.sport;
                              const key = sport?.split(' (')[0] || 'Other';
                              acc[key] = (acc[key] || 0) + 1;
                              return acc;
                        }, {}),
                        by_team: preCalcStats.by_team || rawAthletes.reduce((acc: any, curr) => {
                              // Use the team field directly (now populated by transformer) or derive
                              const team = curr.team || 'Other';
                              acc[team] = (acc[team] || 0) + 1;
                              return acc;
                        }, {}),
                        age_distribution: preCalcStats.age_distribution || rawAthletes.reduce((acc: any, curr) => {
                              // Calculate age responsibly
                              const currentYear = new Date().getFullYear();
                              let age = curr.age;

                              if (!age && curr.birth_year) {
                                    age = currentYear - curr.birth_year;
                              }

                              // Fallback if still no age
                              if (!age) age = 20;

                              if (age < 20) acc.teens++;
                              else if (age < 30) acc.twenties++;
                              else if (age < 40) acc.thirties++;
                              else acc.forties++;
                              return acc;
                        }, { teens: 0, twenties: 0, thirties: 0, forties: 0 }),
                        gender_distribution: preCalcStats.gender_distribution || rawAthletes.reduce((acc: any, curr) => {
                              const gender = curr.gender || 'M';
                              acc[gender] = (acc[gender] || 0) + 1;
                              return acc;
                        }, { M: 0, F: 0 }),
                  };

                  setStats(newStats);
                  setLoading(false);
            }, 800);

            return () => clearTimeout(timer);
      }, []);

      const getMedalists = () => {
            return athletes.filter(a =>
                  (a.medals?.gold || 0) + (a.medals?.silver || 0) + (a.medals?.bronze || 0) > 0
            );
      };

      const getTopRankers = (limit = 5) => {
            return [...athletes]
                  .filter(a => a.current_rank)
                  .sort((a, b) => (a.current_rank || 999) - (b.current_rank || 999))
                  .slice(0, limit);
      };

      return {
            athletes,
            stats,
            loading,
            lastUpdated,
            getMedalists,
            getTopRankers
      };
};
