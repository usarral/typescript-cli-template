/**
 * Wraps a promise with a timeout, rejecting if the promise doesn't resolve in time
 * @template T - The type of the promise result
 * @param promise - The promise to wrap with timeout
 * @param ms - Timeout duration in milliseconds
 * @param timeoutError - Optional custom error to throw on timeout
 * @returns Promise that resolves with the original promise result or rejects on timeout
 * @example
 * ```typescript
 * const result = await withTimeout(
 *   fetch('https://api.example.com'),
 *   5000,
 *   new Error('API request timed out')
 * );
 * ```
 */
export async function withTimeout<T>(
	promise: Promise<T>,
	ms: number,
	timeoutError = new Error("Operation timed out"),
): Promise<T> {
	let timeoutId: NodeJS.Timeout;

	const timeoutPromise = new Promise<T>((_, reject) => {
		timeoutId = setTimeout(() => reject(timeoutError), ms);
	});

	return Promise.race([promise, timeoutPromise]).finally(() => {
		clearTimeout(timeoutId);
	});
}

/**
 * Creates a promise that resolves after a specified delay
 * @param ms - Delay duration in milliseconds
 * @returns Promise that resolves after the delay
 * @example
 * ```typescript
 * await delay(1000); // Wait 1 second
 * ```
 */
export function delay(ms: number): Promise<void> {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Retries a function multiple times with exponential backoff
 * @template T - The type of the function result
 * @param fn - The async function to retry
 * @param options - Retry configuration options
 * @returns Promise that resolves with the function result or rejects after all retries
 * @example
 * ```typescript
 * const data = await retry(
 *   () => fetchData(),
 *   { maxAttempts: 3, baseDelay: 1000 }
 * );
 * ```
 */
export async function retry<T>(
	fn: () => Promise<T>,
	options: {
		maxAttempts?: number;
		baseDelay?: number;
		maxDelay?: number;
		onRetry?: (attempt: number, error: unknown) => void;
	} = {},
): Promise<T> {
	const { maxAttempts = 3, baseDelay = 1000, maxDelay = 10000, onRetry } = options;

	let lastError: unknown;

	for (let attempt = 1; attempt <= maxAttempts; attempt++) {
		try {
			return await fn();
		} catch (error) {
			lastError = error;

			if (attempt === maxAttempts) {
				break;
			}

			if (onRetry) {
				onRetry(attempt, error);
			}

			// Calculate exponential backoff delay
			const delayMs = Math.min(baseDelay * 2 ** (attempt - 1), maxDelay);
			await delay(delayMs);
		}
	}

	throw lastError;
}
