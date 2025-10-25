import inquirer from "inquirer";
import { type AppConfig, configManager } from "../../utils/configManager";
import { Logger } from "../../utils/Logger";

/**
 * Validates that the configuration name is not empty and doesn't already exist
 */
function validateConfigName(input: string): string | boolean {
	const trimmedInput = input.trim();

	if (!trimmedInput) {
		return "Configuration name is required";
	}

	if (configManager.listConfigs().includes(trimmedInput)) {
		return "A configuration with that name already exists";
	}

	return true;
}

/**
 * Prompts the user for configuration details
 * Customize these prompts for your application needs
 */
async function promptConfigDetails(): Promise<AppConfig & { setAsCurrent: boolean }> {
	return inquirer.prompt([
		{
			type: "input",
			name: "name",
			message: "Configuration name:",
			validate: validateConfigName,
		},
		{
			type: "input",
			name: "description",
			message: "Description (optional):",
		},
		// TEMPLATE: Add your custom configuration fields here
		// Example:
		// {
		//   type: "input",
		//   name: "apiUrl",
		//   message: "API URL:",
		//   validate: (input) => input.trim() ? true : "API URL is required",
		// },
		// {
		//   type: "password",
		//   name: "apiKey",
		//   message: "API Key:",
		//   validate: (input) => input.trim() ? true : "API Key is required",
		// },
		{
			type: "confirm",
			name: "setAsCurrent",
			message: "Set as active configuration?",
			default: true,
		},
	]);
}

/**
 * Creates a new configuration interactively
 */
export async function createConfig(): Promise<void> {
	Logger.info("🔧 Create new configuration\n");

	try {
		const answers = await promptConfigDetails();

		const config: AppConfig = {
			name: answers.name.trim(),
			description: answers.description?.trim(),
			// TEMPLATE: Add your custom config properties here
			// Example:
			// apiUrl: answers.apiUrl.trim(),
			// apiKey: answers.apiKey.trim(),
		};

		const saved = configManager.saveConfig(config);

		if (!saved) {
			Logger.error("Failed to save configuration");
			return;
		}

		Logger.info(`Configuration '${config.name}' created successfully`);

		if (answers.setAsCurrent) {
			const activated = configManager.setCurrentConfig(config.name);

			if (activated) {
				Logger.info(`Configuration '${config.name}' set as active`);
			} else {
				Logger.warn("Configuration created but failed to set as active");
			}
		}

		Logger.debug(`📁 Saved in: ${configManager.getConfigDir()}`);
	} catch (error) {
		Logger.error("Error creating configuration");
		const errorMessage = error instanceof Error ? error.message : String(error);
		Logger.debug("Error details:", errorMessage);
	}
}
