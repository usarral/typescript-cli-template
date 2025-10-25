import { describe, expect, it } from "vitest";
import { delay, retry, withTimeout } from "../utils/timeout";

// Helper function to create a delayed promise
const createDelayedResolve = (value: string, ms: number): Promise<string> => {
	return new Promise((resolve) => {
		setTimeout(() => resolve(value), ms);
	});
};

describe("timeout utilities", () => {
	describe("withTimeout", () => {
		it("should resolve if promise completes before timeout", async () => {
			const promise = Promise.resolve("success");
			const result = await withTimeout(promise, 1000);
			expect(result).toBe("success");
		});

		it("should reject if promise takes longer than timeout", async () => {
			const promise = createDelayedResolve("too late", 100);
			await expect(withTimeout(promise, 50)).rejects.toThrow("Operation timed out");
		});

		it("should reject with custom error message", async () => {
			const promise = createDelayedResolve("too late", 100);
			const customError = new Error("Custom timeout");
			await expect(withTimeout(promise, 50, customError)).rejects.toThrow("Custom timeout");
		});
	});

	describe("delay", () => {
		it("should wait for specified duration", async () => {
			const start = Date.now();
			await delay(100);
			const end = Date.now();
			const elapsed = end - start;
			expect(elapsed).toBeGreaterThanOrEqual(90); // Allow some margin
			expect(elapsed).toBeLessThan(150);
		});
	});

	describe("retry", () => {
		it("should succeed on first attempt if function succeeds", async () => {
			const fn = async () => "success";
			const result = await retry(fn);
			expect(result).toBe("success");
		});

		it("should retry on failure and eventually succeed", async () => {
			let attempts = 0;
			const fn = async () => {
				attempts++;
				if (attempts < 3) {
					throw new Error("Not yet");
				}
				return "success";
			};

			const result = await retry(fn, { maxAttempts: 3, baseDelay: 10 });
			expect(result).toBe("success");
			expect(attempts).toBe(3);
		});

		it("should fail after max attempts", async () => {
			const fn = async () => {
				throw new Error("Always fails");
			};

			await expect(retry(fn, { maxAttempts: 2, baseDelay: 10 })).rejects.toThrow("Always fails");
		});

		it("should call onRetry callback", async () => {
			const retryAttempts: number[] = [];
			const fn = async () => {
				throw new Error("Fail");
			};

			await expect(
				retry(fn, {
					maxAttempts: 3,
					baseDelay: 10,
					onRetry: (attempt) => retryAttempts.push(attempt),
				}),
			).rejects.toThrow();

			expect(retryAttempts).toEqual([1, 2]);
		});
	});
});
