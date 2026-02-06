/**
 * Antigravity Corrector
 * Self-correction with exponential backoff retry logic
 */

export type ErrorPattern =
      | 'NetworkError'
      | 'TimeoutError'
      | 'ParseError'
      | 'NotFoundError'
      | 'RateLimitError'
      | 'UnknownError';

export interface CorrectorOptions {
      maxRetries?: number;
      baseDelay?: number;
      onRetry?: (attempt: number, error: Error) => void;
      onSuccess?: (attempt: number) => void;
      onFailure?: (error: Error) => void;
}

export class AntigravityCorrector {
      private readonly maxRetries: number;
      private readonly baseDelay: number;
      private readonly onRetry?: (attempt: number, error: Error) => void;
      private readonly onSuccess?: (attempt: number) => void;
      private readonly onFailure?: (error: Error) => void;

      constructor(options: CorrectorOptions = {}) {
            this.maxRetries = options.maxRetries ?? 5;
            this.baseDelay = options.baseDelay ?? 1000; // 1 second
            this.onRetry = options.onRetry;
            this.onSuccess = options.onSuccess;
            this.onFailure = options.onFailure;
      }

      /**
       * Identify error pattern
       */
      private identifyError(error: Error): ErrorPattern {
            const message = error.message.toLowerCase();

            if (message.includes('network') || message.includes('fetch')) {
                  return 'NetworkError';
            }
            if (message.includes('timeout')) {
                  return 'TimeoutError';
            }
            if (message.includes('parse') || message.includes('json')) {
                  return 'ParseError';
            }
            if (message.includes('404') || message.includes('not found')) {
                  return 'NotFoundError';
            }
            if (message.includes('429') || message.includes('rate limit')) {
                  return 'RateLimitError';
            }

            return 'UnknownError';
      }

      /**
       * Check if error is retryable
       */
      private isRetryable(pattern: ErrorPattern): boolean {
            // Don't retry parse errors or not found errors
            return pattern !== 'ParseError' && pattern !== 'NotFoundError';
      }

      /**
       * Calculate delay with exponential backoff
       */
      private calculateDelay(attempt: number, pattern: ErrorPattern): number {
            // Rate limit errors get longer delays
            const multiplier = pattern === 'RateLimitError' ? 3 : 1;
            return this.baseDelay * Math.pow(2, attempt) * multiplier;
      }

      /**
       * Sleep for specified milliseconds
       */
      private sleep(ms: number): Promise<void> {
            return new Promise(resolve => setTimeout(resolve, ms));
      }

      /**
       * Execute function with auto-correction
       */
      async run<T>(fn: () => Promise<T>): Promise<T> {
            let lastError: Error | null = null;

            for (let attempt = 0; attempt < this.maxRetries; attempt++) {
                  try {
                        const result = await fn();

                        if (attempt > 0 && this.onSuccess) {
                              this.onSuccess(attempt);
                        }

                        return result;
                  } catch (error) {
                        lastError = error instanceof Error ? error : new Error(String(error));
                        const pattern = this.identifyError(lastError);

                        // Log retry attempt
                        if (this.onRetry) {
                              this.onRetry(attempt + 1, lastError);
                        } else {
                              console.warn(
                                    `[Corrector] Attempt ${attempt + 1}/${this.maxRetries} failed: ${pattern} - ${lastError.message}`
                              );
                        }

                        // Check if we should retry
                        if (!this.isRetryable(pattern)) {
                              console.error(`[Corrector] Non-retryable error: ${pattern}`);
                              break;
                        }

                        // Last attempt - don't wait
                        if (attempt === this.maxRetries - 1) {
                              break;
                        }

                        // Wait with exponential backoff
                        const delay = this.calculateDelay(attempt, pattern);
                        console.log(`[Corrector] Waiting ${delay}ms before retry...`);
                        await this.sleep(delay);
                  }
            }

            // All retries failed
            if (this.onFailure && lastError) {
                  this.onFailure(lastError);
            }

            throw new Error(
                  `Failed after ${this.maxRetries} attempts: ${lastError?.message || 'Unknown error'}`
            );
      }

      /**
       * Execute function with timeout
       */
      async runWithTimeout<T>(
            fn: () => Promise<T>,
            timeoutMs: number
      ): Promise<T> {
            return this.run(() => {
                  return Promise.race([
                        fn(),
                        new Promise<T>((_, reject) =>
                              setTimeout(() => reject(new Error('Timeout')), timeoutMs)
                        )
                  ]);
            });
      }

      /**
       * Batch execute with correction
       */
      async runBatch<T>(
            fns: Array<() => Promise<T>>,
            continueOnError = true
      ): Promise<Array<T | Error>> {
            const results: Array<T | Error> = [];

            for (const fn of fns) {
                  try {
                        const result = await this.run(fn);
                        results.push(result);
                  } catch (error) {
                        const err = error instanceof Error ? error : new Error(String(error));
                        results.push(err);

                        if (!continueOnError) {
                              throw err;
                        }
                  }
            }

            return results;
      }
}

export default AntigravityCorrector;
