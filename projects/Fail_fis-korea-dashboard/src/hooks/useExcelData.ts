import { useState, useEffect } from 'react';
import { loadAllAthletesData } from '../utils/excelLoader';
import { convertAllExcelToAthletes } from '../utils/excelConverter';
import { AntigravityCache } from '../utils/cache';
import ANTIGRAVITY_CONFIG from '../config/antigravity.config';
import type { Athlete } from '../types';

// Initialize cache for Excel data
const excelCache = new AntigravityCache(
      ANTIGRAVITY_CONFIG.cache.ttl,
      ANTIGRAVITY_CONFIG.cache.maxSize,
      'fis-excel-cache'
);

export function useExcelData() {
      const [data, setData] = useState<Athlete[]>([]);
      const [loading, setLoading] = useState(true);
      const [error, setError] = useState<string | null>(null);
      const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

      const loadData = async () => {
            try {
                  setLoading(true);
                  setError(null);

                  // Try to get from cache first
                  const cacheKey = 'excel-athletes-data';
                  const cached = excelCache.get<{ athletes: Athlete[], timestamp: number }>(cacheKey);

                  if (cached) {
                        console.log('[useExcelData] Loaded from cache');
                        setData(cached.athletes);
                        setLastUpdated(new Date(cached.timestamp));
                        setLoading(false);
                        return;
                  }

                  // Load and parse Excel data
                  console.log('[useExcelData] Loading and parsing Excel data');
                  const excelData = await loadAllAthletesData();
                  const athletes = convertAllExcelToAthletes(excelData);
                  const timestamp = Date.now();

                  setData(athletes);
                  setLastUpdated(new Date(timestamp));

                  // Cache the results
                  excelCache.set(cacheKey, { athletes, timestamp });
            } catch (err) {
                  setError(err instanceof Error ? err.message : 'Failed to load data');
                  console.error('Error loading Excel data:', err);
            } finally {
                  setLoading(false);
            }
      };

      useEffect(() => {
            loadData();

            // Auto-refresh every 5 minutes
            const interval = setInterval(loadData, 5 * 60 * 1000);

            return () => clearInterval(interval);
      }, []);

      return {
            athletes: data,
            loading,
            error,
            lastUpdated,
            reload: loadData
      };
}
