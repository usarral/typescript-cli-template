/**
 * Example: Using Timeout and Retry Utilities
 *
 * This example demonstrates how to use the timeout and retry utilities
 * for robust async operations with automatic retries and timeouts.
 */

import axios from "axios";
import type { Command } from "commander";
import { Logger } from "../src/utils/Logger";
import { retry, withTimeout } from "../src/utils/timeout";

interface ApiResponse {
	id: number;
	title: string;
	completed: boolean;
}

/**
 * Simulates an unreliable API call that might fail
 */
async function unreliableApiCall(id: number): Promise<ApiResponse> {
	// Add timeout to the request
	return withTimeout(
		axios
			.get<ApiResponse>(`https://jsonplaceholder.typicode.com/todos/${id}`)
			.then((response) => response.data),
		5000, // 5 second timeout
		new Error("API request timed out"),
	);
}

/**
 * Fetches data with automatic retry on failure
 */
async function fetchWithRetry(id: number): Promise<ApiResponse> {
	return retry(() => unreliableApiCall(id), {
		maxAttempts: 3,
		baseDelay: 1000,
		maxDelay: 5000,
		onRetry: (attempt, error) => {
			const errorMsg = error instanceof Error ? error.message : String(error);
			Logger.warn(`Retry attempt ${attempt} after error: ${errorMsg}`);
			Logger.debug(`Retry details - Attempt: ${attempt}, Error:`, error);
		},
	});
}

export function setupRetryExampleCommand(program: Command): void {
	program
		.command("retry-example")
		.description("Demonstrate timeout and retry utilities")
		.option("-i, --id <number>", "Todo ID to fetch", "1")
		.action(async (options: { id: string }) => {
			const todoId = Number.parseInt(options.id, 10);

			if (Number.isNaN(todoId) || todoId < 1) {
				Logger.error("Invalid ID. Please provide a positive number.");
				process.exit(1);
			}

			try {
				Logger.info("Retry & Timeout Example");
				Logger.info(`Fetching todo #${todoId} with retry logic...`);

				const startTime = Date.now();
				const result = await fetchWithRetry(todoId);
				const duration = Date.now() - startTime;

				Logger.info("Data fetched successfully!");
				console.log("");
				Logger.info("Todo Details:");
				console.log(`  ID: ${result.id}`);
				console.log(`  Title: ${result.title}`);
				console.log(`  Completed: ${result.completed ? "✅" : "❌"}`);
				console.log("");
				Logger.debug(`Completed in ${duration}ms`);
			} catch (error) {
				const errorMsg = error instanceof Error ? error.message : String(error);
				Logger.error(`Failed to fetch data: ${errorMsg}`);
				Logger.debug("Full error details:", error);
				process.exit(1);
			}
		});
}

// Usage in src/index.ts:
// import { setupRetryExampleCommand } from "./commands/retryExample";
// setupRetryExampleCommand(program);
