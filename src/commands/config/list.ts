import chalk from "chalk";
import config from "../../utils/config";
import { type AppConfig, configManager } from "../../utils/configManager";
import { Logger } from "../../utils/Logger";

/**
 * Displays configuration details
 * Customize this to show your application's config properties
 */
function displayConfigDetails(configData: AppConfig): void {
	if (configData.description) {
		console.log(`   📝 ${configData.description}`);
	}

	// TEMPLATE: Add your custom config properties display here
	// Example:
	// if ('apiUrl' in configData) {
	//   console.log(`   🌐 API: ${configData.apiUrl}`);
	// }
	// if ('apiKey' in configData) {
	//   console.log(`   🔑 Key: ${"*".repeat(Math.min(configData.apiKey.length, 20))}`);
	// }
}

/**
 * Lists all available configurations
 */
export async function listConfigs(): Promise<void> {
	Logger.info("📋 Available configurations\n");

	const configs = configManager.listConfigs();
	const currentConfigName = configManager.getCurrentConfig();

	if (configs.length === 0) {
		Logger.warn("No configurations found");
		Logger.info(`Use '${config.appName} config create' to create one`);
		return;
	}

	for (const configName of configs) {
		const configData = configManager.getConfig(configName);
		const isActive = configName === currentConfigName;

		if (configData) {
			const status = isActive ? chalk.green("● ACTIVE") : chalk.gray("○");
			console.log(`${status} ${chalk.cyan(configName)}`);
			displayConfigDetails(configData);
			console.log();
		} else {
			Logger.warn(`Failed to load config: ${configName}`);
		}
	}

	if (!currentConfigName) {
		Logger.warn("No active configuration");
		Logger.info(`Use '${config.appName} config use <name>' to activate one`);
	}

	Logger.debug(`📁 Location: ${configManager.getConfigDir()}`);
}
