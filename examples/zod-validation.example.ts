/**
 * Example: Configuration with Zod Validation
 *
 * This example shows how to extend the base config schema
 * and add custom validation for your CLI application.
 */

import type { Command } from "commander";
import inquirer from "inquirer";
import { z } from "zod";
import { AppConfigSchema, configManager } from "../src/utils/configManager";
import { Logger } from "../src/utils/Logger";

/**
 * Extended configuration schema with custom fields
 */
const ExtendedConfigSchema = AppConfigSchema.extend({
	apiUrl: z.string().url("Must be a valid URL"),
	apiKey: z.string().min(8, "API key must be at least 8 characters"),
	timeout: z.number().positive().max(30000).default(5000),
	retries: z.number().int().min(0).max(10).default(3),
	environment: z.enum(["development", "staging", "production"]),
	features: z
		.object({
			logging: z.boolean(),
			analytics: z.boolean(),
			cache: z.boolean(),
		})
		.optional(),
});

type ExtendedConfig = z.infer<typeof ExtendedConfigSchema>;

/**
 * Prompts user for extended configuration details
 */
async function promptExtendedConfig(): Promise<ExtendedConfig> {
	const answers = await inquirer.prompt([
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
			validate: (input) => {
				const result = z.string().url().safeParse(input);
				return result.success || "Must be a valid URL";
			},
		},
		{
			type: "password",
			name: "apiKey",
			message: "API Key (min 8 chars):",
			validate: (input) => {
				const result = z.string().min(8).safeParse(input);
				return result.success || "API key must be at least 8 characters";
			},
		},
		{
			type: "number",
			name: "timeout",
			message: "Request timeout (ms):",
			default: 5000,
		},
		{
			type: "number",
			name: "retries",
			message: "Max retry attempts:",
			default: 3,
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
			name: "enableLogging",
			message: "Enable logging?",
			default: true,
		},
		{
			type: "confirm",
			name: "enableAnalytics",
			message: "Enable analytics?",
			default: false,
		},
		{
			type: "confirm",
			name: "enableCache",
			message: "Enable cache?",
			default: true,
		},
	]);

	// Transform answers to match schema
	return {
		name: answers.name,
		description: answers.description || undefined,
		apiUrl: answers.apiUrl,
		apiKey: answers.apiKey,
		timeout: Number(answers.timeout),
		retries: Number(answers.retries),
		environment: answers.environment,
		features: {
			logging: answers.enableLogging,
			analytics: answers.enableAnalytics,
			cache: answers.enableCache,
		},
	};
}

/**
 * Creates an extended configuration with validation
 */
async function createExtendedConfig(): Promise<void> {
	Logger.info("🔧 Create Extended Configuration");

	try {
		const config = await promptExtendedConfig();

		// Validate with Zod schema
		const validationResult = ExtendedConfigSchema.safeParse(config);

		if (!validationResult.success) {
			Logger.error("Configuration validation failed:");
			for (const issue of validationResult.error.issues) {
				console.log(`  • ${issue.path.join(".")}: ${issue.message}`);
			}
			return;
		}

		const validatedConfig = validationResult.data;

		// Save the config
		const saved = configManager.saveConfig(validatedConfig);

		if (saved) {
			Logger.info(`Configuration '${config.name}' created successfully!`);
			console.log("");
			Logger.info("Configuration Details:");
			console.log(`  API URL: ${validatedConfig.apiUrl}`);
			console.log(`  Timeout: ${validatedConfig.timeout}ms`);
			console.log(`  Retries: ${validatedConfig.retries}`);
			console.log(`  Environment: ${validatedConfig.environment}`);
			if (validatedConfig.features) {
				console.log("  Features:");
				console.log(`    - Logging: ${validatedConfig.features.logging ? "✅" : "❌"}`);
				console.log(`    - Analytics: ${validatedConfig.features.analytics ? "✅" : "❌"}`);
				console.log(`    - Cache: ${validatedConfig.features.cache ? "✅" : "❌"}`);
			}
			console.log("");
			Logger.debug(`📁 Saved in: ${configManager.getConfigDir()}`);
		} else {
			Logger.error("Failed to save configuration");
		}
	} catch (error) {
		const errorMsg = error instanceof Error ? error.message : String(error);
		Logger.error(`Error creating configuration: ${errorMsg}`);
		Logger.debug("Full error:", error);
	}
}

export function setupValidationExampleCommand(program: Command): void {
	program
		.command("validation-example")
		.description("Create a configuration with Zod validation")
		.action(createExtendedConfig);
}

// Usage in src/index.ts:
// import { setupValidationExampleCommand } from "./commands/validationExample";
// setupValidationExampleCommand(program);
