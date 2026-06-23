import { logger } from './logger';

export interface RetryOptions {
  maxRetries?: number;
  initialDelayMs?: number;
  factor?: number;
  retryOn?: (error: unknown) => boolean;
}

/**
 * Executes an asynchronous function with exponential backoff retry logic.
 */
export async function withRetry<T>(
  fn: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const maxRetries = options.maxRetries ?? 3;
  const initialDelayMs = options.initialDelayMs ?? 500;
  const factor = options.factor ?? 2;
  const retryOn = options.retryOn ?? (() => true);

  let attempt = 0;
  let delay = initialDelayMs;

  while (true) {
    try {
      return await fn();
    } catch (error) {
      attempt++;
      if (attempt > maxRetries || !retryOn(error)) {
        logger.error(`Operation failed after ${attempt} attempts. Propagating error.`, error);
        throw error;
      }

      logger.warn(
        `Operation failed (attempt ${attempt}/${maxRetries}). Retrying in ${delay}ms...`,
        { error: error instanceof Error ? error.message : String(error) }
      );

      await new Promise((resolve) => setTimeout(resolve, delay));
      delay *= factor;
    }
  }
}
