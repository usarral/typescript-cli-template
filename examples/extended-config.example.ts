/**
 * Example: Extended Configuration
 *
 * This example shows how to extend the configuration system
 * with custom fields specific to your application needs.
 */

import chalk from "chalk";
import inquirer from "inquirer";
import { configManager } from "../src/utils/configManager";
import { Logger } from "../src/utils/Logger";

/**
 * Extended configuration with custom fields
 */
export interface ExtendedAppConfig {
	name: string;
	description?: string;
	// Custom fields for your application
	apiUrl: string;
	apiKey: string;
	timeout: number;
	retryAttempts: number;
	environment: "development" | "staging" | "production";
	features: {
		enableCache: boolean;
		enableMetrics: boolean;
		enableDebugMode: boolean;
	};
}

/**
 * Validates API URL format
 */
function validateUrl(input: string): string | boolean {
	try {
		new URL(input);
		return true;
	} catch {
		return "Please enter a valid URL";
	}
}

/**
 * Validates API key is not empty
 */
function validateApiKey(input: string): string | boolean {
	const trimmed = input.trim();
	if (!trimmed) {
		return "API key is required";
	}
	if (trimmed.length < 10) {
		return "API key must be at least 10 characters";
	}
	return true;
}

/**
 * Validates timeout is a positive number
 */
function validateTimeout(input: string): string | boolean {
	const num = Number.parseInt(input, 10);
	if (Number.isNaN(num) || num <= 0) {
		return "Timeout must be a positive number";
	}
	return true;
}

/**
 * Prompts for extended configuration
 */
async function promptExtendedConfig(): Promise<ExtendedAppConfig & { setAsCurrent: boolean }> {
	return inquirer.prompt([
		{
			type: "input",
			name: "name",
			message: "Configuration name:",
			validate: (input) => (input.trim() ? true : "Name is required"),
		},
		{
			type: "input",
			name: "description",
			message: "Description (optional):",
		},
		{
			type: "input",
			name: "apiUrl",
			message: "API URL:",
			default: "https://api.example.com",
			validate: validateUrl,
		},
		{
			type: "password",
			name: "apiKey",
			message: "API Key:",
			validate: validateApiKey,
			mask: "*",
		},
		{
			type: "input",
			name: "timeout",
			message: "Request timeout (ms):",
			default: "5000",
			validate: validateTimeout,
			filter: (input) => Number.parseInt(input, 10),
		},
		{
			type: "input",
			name: "retryAttempts",
			message: "Retry attempts:",
			default: "3",
			validate: (input) => {
				const num = Number.parseInt(input, 10);
				return !Number.isNaN(num) && num >= 0 ? true : "Must be a non-negative number";
			},
			filter: (input) => Number.parseInt(input, 10),
		},
		{
			type: "list",
			name: "environment",
			message: "Environment:",
			choices: ["development", "staging", "production"],
			default: "development",
		},
		{
			type: "confirm",
			name: "features.enableCache",
			message: "Enable caching?",
			default: true,
		},
		{
			type: "confirm",
			name: "features.enableMetrics",
			message: "Enable metrics collection?",
			default: false,
		},
		{
			type: "confirm",
			name: "features.enableDebugMode",
			message: "Enable debug mode?",
			default: false,
		},
		{
			type: "confirm",
			name: "setAsCurrent",
			message: "Set as active configuration?",
			default: true,
		},
	]);
}

/**
 * Creates an extended configuration
 */
export async function createExtendedConfig(): Promise<void> {
	console.log(chalk.blue("🔧 Create new extended configuration\n"));

	try {
		const answers = await promptExtendedConfig();

		const config: ExtendedAppConfig = {
			name: answers.name.trim(),
			description: answers.description?.trim() || undefined,
			apiUrl: answers.apiUrl.trim(),
			apiKey: answers.apiKey.trim(),
			timeout: answers.timeout,
			retryAttempts: answers.retryAttempts,
			environment: answers.environment,
			features: {
				enableCache: answers.features.enableCache,
				enableMetrics: answers.features.enableMetrics,
				enableDebugMode: answers.features.enableDebugMode,
			},
		};

		const saved = configManager.saveConfig(config);

		if (!saved) {
			console.error(chalk.red("❌ Failed to save configuration"));
			return;
		}

		console.log(chalk.green(`✅ Configuration '${config.name}' created successfully`));

		if (answers.setAsCurrent) {
			const activated = configManager.setCurrentConfig(config.name);

			if (activated) {
				console.log(chalk.green(`✅ Configuration '${config.name}' set as active`));
			}
		}

		// Display summary
		console.log(chalk.blue("\n📋 Configuration Summary:"));
		console.log(chalk.gray(`   Environment: ${config.environment}`));
		console.log(chalk.gray(`   API URL: ${config.apiUrl}`));
		console.log(chalk.gray(`   Timeout: ${config.timeout}ms`));
		console.log(chalk.gray(`   Retry Attempts: ${config.retryAttempts}`));
		console.log(chalk.gray(`   Cache: ${config.features.enableCache ? "✓" : "✗"}`));
		console.log(chalk.gray(`   Metrics: ${config.features.enableMetrics ? "✓" : "✗"}`));
		console.log(chalk.gray(`   Debug: ${config.features.enableDebugMode ? "✓" : "✗"}`));
	} catch (error) {
		Logger.error("Error creating configuration:", error);
		console.error(chalk.red("❌ Error creating configuration"));
	}
}

/**
 * Gets the current extended configuration
 */
export function getCurrentExtendedConfig(): ExtendedAppConfig | null {
	const config = configManager.getCurrentConfigData();
	return config as ExtendedAppConfig | null;
}

// Usage example:
// const config = getCurrentExtendedConfig();
// if (config) {
//   console.log(`Using API: ${config.apiUrl}`);
//   console.log(`Timeout: ${config.timeout}ms`);
// }
