import { useState, useEffect } from 'react';
import { AntigravityCache } from '../utils/cache';
import ANTIGRAVITY_CONFIG from '../config/antigravity.config';

export interface FisResult {
      date: string;
      location: string;
      event: string;
      discipline: string;
      rank: number | string;
      fisPoints?: number;
      wcPoints?: number;
}

export interface AthleteResults {
      name: string;
      nameEn: string;
      fisCode: string;
      latestResults: FisResult[];
      currentRanking?: number;
      totalPoints?: number;
      lastUpdated: string;
}

export interface FisResults {
      results: { [fisCode: string]: AthleteResults };
      lastUpdated: string;
}

// Initialize cache with config
const fisCache = new AntigravityCache(
      ANTIGRAVITY_CONFIG.cache.ttl,
      ANTIGRAVITY_CONFIG.cache.maxSize,
      ANTIGRAVITY_CONFIG.cache.storageKey
);

export function useFisData() {
      const [fisResults, setFisResults] = useState<FisResults | null>(null);
      const [loading, setLoading] = useState(true);

      useEffect(() => {
            const loadFisData = async () => {
                  try {
                        // Try to get from cache first
                        const cacheKey = 'fis-results';
                        const cached = fisCache.get<FisResults>(cacheKey);

                        if (cached) {
                              console.log('[useFisData] Loaded from cache');
                              setFisResults(cached);
                              setLoading(false);
                              return;
                        }

                        // Fetch from server
                        console.log('[useFisData] Fetching from server');
                        const response = await fetch('/fis-results.json');

                        if (response.ok) {
                              const data = await response.json();
                              setFisResults(data);

                              // Cache the results
                              fisCache.set(cacheKey, data);
                        } else {
                              // If file doesn't exist yet, that's okay
                              const emptyData = {
                                    results: {},
                                    lastUpdated: new Date().toISOString()
                              };
                              setFisResults(emptyData);
                        }
                  } catch (err) {
                        console.warn('FIS results not available yet:', err);
                        setFisResults({ results: {}, lastUpdated: new Date().toISOString() });
                  } finally {
                        setLoading(false);
                  }
            };

            loadFisData();

            // Auto-refresh every 5 minutes
            const interval = setInterval(loadFisData, 5 * 60 * 1000);
            return () => clearInterval(interval);
      }, []);

      return { fisResults, loading };
}

