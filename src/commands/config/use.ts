import config from "../../utils/config";
import { type AppConfig, configManager } from "../../utils/configManager";
import { Logger } from "../../utils/Logger";

/**
 * Displays a summary of the activated configuration
 * Customize this to show relevant config properties
 */
function displayConfigSummary(configData: AppConfig): void {
	if (configData.description) {
		Logger.debug(`📝 ${configData.description}`);
	}

	// TEMPLATE: Add your custom config properties display here
	// Example:
	// if ('apiUrl' in configData) {
	//   Logger.debug(`🌐 API: ${configData.apiUrl}`);
	// }
}

/**
 * Sets a configuration as the active one
 */
export async function useConfig(name: string): Promise<void> {
	if (!name?.trim()) {
		Logger.error("You must specify a configuration name");
		Logger.info(`Usage: ${config.appName} config use <name>`);
		return;
	}

	const configData = configManager.getConfig(name);

	if (!configData) {
		Logger.error(`Configuration '${name}' not found`);
		Logger.info(`Use '${config.appName} config list' to see available configurations`);
		return;
	}

	const success = configManager.setCurrentConfig(name);

	if (success) {
		Logger.info(`Configuration '${name}' set as active`);
		displayConfigSummary(configData);
		Logger.debug(`Configuration '${name}' activated`);
	} else {
		Logger.error(`Failed to set configuration '${name}' as active`);
	}
}
