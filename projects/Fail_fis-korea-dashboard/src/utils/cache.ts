/**
 * Antigravity Cache
 * Persistent cache with TTL and size management
 */

interface CacheEntry<T> {
      data: T;
      timestamp: number;
}

interface CacheData {
      [key: string]: CacheEntry<any>;
}

export interface CacheStats {
      totalEntries: number;
      validEntries: number;
      expiredEntries: number;
      maxSize: number;
      ttlSeconds: number;
      usagePercent: number;
      storageKey: string;
}

export class AntigravityCache {
      private cache: CacheData = {};
      private readonly ttl: number;
      private readonly maxSize: number;
      private readonly storageKey: string;
      private readonly useLocalStorage: boolean;

      constructor(
            ttl = 300000, // 5 minutes in ms
            maxSize = 500,
            storageKey = 'fis-dashboard-cache',
            useLocalStorage = true
      ) {
            this.ttl = ttl;
            this.maxSize = maxSize;
            this.storageKey = storageKey;
            this.useLocalStorage = useLocalStorage && typeof localStorage !== 'undefined';

            this.load();
      }

      /**
       * Load cache from localStorage
       */
      private load(): void {
            if (!this.useLocalStorage) return;

            try {
                  const stored = localStorage.getItem(this.storageKey);
                  if (stored) {
                        this.cache = JSON.parse(stored);
                  }
            } catch (error) {
                  console.warn('Failed to load cache from localStorage:', error);
                  this.cache = {};
            }
      }

      /**
       * Save cache to localStorage
       */
      private save(): void {
            if (!this.useLocalStorage) return;

            try {
                  localStorage.setItem(this.storageKey, JSON.stringify(this.cache));
            } catch (error) {
                  console.warn('Failed to save cache to localStorage:', error);
            }
      }

      /**
       * Clean expired entries and enforce size limit
       */
      private clean(): void {
            const now = Date.now();

            // Remove expired entries
            this.cache = Object.fromEntries(
                  Object.entries(this.cache).filter(
                        ([_, entry]) => now - entry.timestamp < this.ttl
                  )
            );

            // Enforce size limit
            const entries = Object.entries(this.cache);
            if (entries.length > this.maxSize) {
                  const sorted = entries.sort((a, b) => a[1].timestamp - b[1].timestamp);
                  const keep = Math.floor(this.maxSize * 0.8);
                  this.cache = Object.fromEntries(sorted.slice(-keep));
            }
      }

      /**
       * Get value from cache
       */
      get<T>(key: string): T | null {
            this.clean();

            const entry = this.cache[key];
            if (!entry) return null;

            const now = Date.now();
            if (now - entry.timestamp > this.ttl) {
                  delete this.cache[key];
                  this.save();
                  return null;
            }

            return entry.data as T;
      }

      /**
       * Set value in cache
       */
      set<T>(key: string, value: T): void {
            this.cache[key] = {
                  data: value,
                  timestamp: Date.now()
            };

            this.clean();
            this.save();
      }

      /**
       * Delete entry from cache
       */
      delete(key: string): boolean {
            if (key in this.cache) {
                  delete this.cache[key];
                  this.save();
                  return true;
            }
            return false;
      }

      /**
       * Clear all cache entries
       */
      clear(): void {
            this.cache = {};
            this.save();
      }

      /**
       * Check if key exists in cache
       */
      has(key: string): boolean {
            return this.get(key) !== null;
      }

      /**
       * Get all cache keys
       */
      keys(): string[] {
            this.clean();
            return Object.keys(this.cache);
      }

      /**
       * Get cache statistics
       */
      stats(): CacheStats {
            const now = Date.now();
            const entries = Object.values(this.cache);
            const validEntries = entries.filter(
                  entry => now - entry.timestamp < this.ttl
            ).length;

            return {
                  totalEntries: entries.length,
                  validEntries,
                  expiredEntries: entries.length - validEntries,
                  maxSize: this.maxSize,
                  ttlSeconds: this.ttl / 1000,
                  usagePercent: (entries.length / this.maxSize) * 100,
                  storageKey: this.storageKey
            };
      }

      /**
       * Get or set pattern - fetch if not cached
       */
      async getOrSet<T>(
            key: string,
            fetchFn: () => Promise<T>
      ): Promise<T> {
            const cached = this.get<T>(key);
            if (cached !== null) {
                  return cached;
            }

            const value = await fetchFn();
            this.set(key, value);
            return value;
      }
}

export default AntigravityCache;
