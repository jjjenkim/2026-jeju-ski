/**
 * Antigravity Orchestrator
 * Parallel task execution with intelligent caching and concurrency control
 */

interface Task<T> {
      fn: () => Promise<T>;
      key: string;
}

interface CacheEntry<T> {
      data: T;
      timestamp: number;
}

export interface OrchestratorStats {
      cacheHits: number;
      cacheMisses: number;
      totalTasks: number;
      cacheSize: number;
      cacheUsagePercent: number;
}

export class AntigravityOrchestrator {
      private cache: Map<string, CacheEntry<any>> = new Map();
      private readonly maxConcurrent: number;
      private readonly cacheTTL: number;
      private readonly cacheMaxSize: number;
      private stats = {
            cacheHits: 0,
            cacheMisses: 0,
            totalTasks: 0
      };

      constructor(
            maxConcurrent = 5,
            cacheTTL = 3600000, // 1 hour in ms
            cacheMaxSize = 1000
      ) {
            this.maxConcurrent = maxConcurrent;
            this.cacheTTL = cacheTTL;
            this.cacheMaxSize = cacheMaxSize;
      }

      /**
   * Clean expired cache entries and enforce size limit
   */
      private clean(): void {
            const now = Date.now();

            // Remove expired entries
            const entries = Array.from(this.cache.entries());
            this.cache.clear();

            for (const [key, entry] of entries) {
                  if (now - entry.timestamp < this.cacheTTL) {
                        this.cache.set(key, entry);
                  }
            }

            // Enforce size limit
            if (this.cache.size > this.cacheMaxSize) {
                  const sortedEntries = Array.from(this.cache.entries())
                        .sort((a, b) => a[1].timestamp - b[1].timestamp);
                  const keep = Math.floor(this.cacheMaxSize * 0.8);
                  this.cache = new Map(sortedEntries.slice(-keep));
            }
      }

      /**
       * Execute tasks in parallel with caching and concurrency control
       */
      async run<T>(tasks: Task<T>[]): Promise<T[]> {
            this.clean();
            this.stats.totalTasks += tasks.length;

            const execute = async (task: Task<T>): Promise<T> => {
                  // Check cache
                  const cached = this.cache.get(task.key);
                  if (cached && Date.now() - cached.timestamp < this.cacheTTL) {
                        this.stats.cacheHits++;
                        return cached.data as T;
                  }

                  // Execute task
                  this.stats.cacheMisses++;
                  const result = await task.fn();

                  // Cache result
                  this.cache.set(task.key, {
                        data: result,
                        timestamp: Date.now()
                  });

                  return result;
            };

            // Execute with concurrency limit
            const results: T[] = [];
            for (let i = 0; i < tasks.length; i += this.maxConcurrent) {
                  const batch = tasks.slice(i, i + this.maxConcurrent);
                  const batchResults = await Promise.all(batch.map(execute));
                  results.push(...batchResults);
            }

            return results;
      }

      /**
       * Get cache statistics
       */
      getStats(): OrchestratorStats {
            return {
                  cacheHits: this.stats.cacheHits,
                  cacheMisses: this.stats.cacheMisses,
                  totalTasks: this.stats.totalTasks,
                  cacheSize: this.cache.size,
                  cacheUsagePercent: (this.cache.size / this.cacheMaxSize) * 100
            };
      }

      /**
       * Clear cache
       */
      clearCache(): void {
            this.cache.clear();
            this.stats = {
                  cacheHits: 0,
                  cacheMisses: 0,
                  totalTasks: 0
            };
      }

      /**
       * Get cached value
       */
      getCached<T>(key: string): T | null {
            const cached = this.cache.get(key);
            if (cached && Date.now() - cached.timestamp < this.cacheTTL) {
                  return cached.data as T;
            }
            return null;
      }

      /**
       * Set cached value
       */
      setCached<T>(key: string, value: T): void {
            this.cache.set(key, {
                  data: value,
                  timestamp: Date.now()
            });
            this.clean();
      }
}

export default AntigravityOrchestrator;
