/**
 * Antigravity Configuration
 * Centralized configuration for orchestrator, cache, and corrector utilities
 */

export const ANTIGRAVITY_CONFIG = {
      orchestrator: {
            maxConcurrent: 5,
            cacheTTL: 3600000, // 1 hour in ms
            cacheMaxSize: 1000
      },
      cache: {
            ttl: 300000, // 5 minutes for FIS data
            maxSize: 500,
            storageKey: 'fis-dashboard-cache'
      },
      corrector: {
            maxRetries: 5,
            baseDelay: 1000 // 1 second
      },
      scraper: {
            batchSize: 5,
            delayBetweenRequests: 2000, // 2 seconds
            timeout: 30000 // 30 seconds
      }
} as const;

export default ANTIGRAVITY_CONFIG;
