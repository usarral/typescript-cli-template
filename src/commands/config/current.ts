import chalk from "chalk";
import config from "../../utils/config";
import { type AppConfig, configManager } from "../../utils/configManager";
import { Logger } from "../../utils/Logger";

/**
 * Displays current configuration details
 * Customize this to show your application's config properties
 */
function displayCurrentConfigDetails(configData: AppConfig): void {
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
 * Shows the currently active configuration
 */
export async function showCurrentConfig(): Promise<void> {
	const currentConfigName = configManager.getCurrentConfig();

	if (!currentConfigName) {
		Logger.warn("No active configuration");
		Logger.info(`Use '${config.appName} config list' to see available configurations`);
		Logger.info(`Use '${config.appName} config use <name>' to activate one`);
		return;
	}

	const configData = configManager.getConfig(currentConfigName);

	if (!configData) {
		Logger.error(`Error: active configuration '${currentConfigName}' not found`);
		Logger.debug(`Current config '${currentConfigName}' exists in current.json but file not found`);
		return;
	}

	Logger.info("🎯 Active configuration\n");
	console.log(`${chalk.green("●")} ${chalk.cyan(configData.name)}`);
	displayCurrentConfigDetails(configData);

	Logger.debug(`\n📁 Location: ${configManager.getConfigDir()}`);
}
