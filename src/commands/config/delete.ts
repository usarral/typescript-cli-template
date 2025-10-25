import inquirer from "inquirer";
import config from "../../utils/config";
import { configManager } from "../../utils/configManager";
import { Logger } from "../../utils/Logger";

/**
 * Prompts user to select a configuration from a list
 */
async function selectConfigToDelete(configs: string[]): Promise<string> {
	const answers = await inquirer.prompt([
		{
			type: "list",
			name: "config",
			message: "Which configuration do you want to delete?",
			choices: configs,
		},
	]);
	return answers.config;
}

/**
 * Confirms deletion with the user
 */
async function confirmDeletion(configName: string): Promise<boolean> {
	const confirmation = await inquirer.prompt([
		{
			type: "confirm",
			name: "confirm",
			message: `Are you sure you want to delete the configuration '${configName}'?`,
			default: false,
		},
	]);
	return confirmation.confirm;
}

/**
 * Deletes a configuration
 * If no name is provided, prompts the user to select one
 */
export async function deleteConfig(name?: string): Promise<void> {
	const configs = configManager.listConfigs();

	if (configs.length === 0) {
		Logger.warn("No configurations to delete");
		return;
	}

	let configToDelete = name?.trim();

	// If no name specified, show list to select from
	if (!configToDelete) {
		try {
			configToDelete = await selectConfigToDelete(configs);
		} catch {
			Logger.debug("Operation cancelled");
			return;
		}
	}

	// Verify configuration exists
	if (!configToDelete) {
		Logger.error("No configuration specified for deletion");
		return;
	}

	const configData = configManager.getConfig(configToDelete);
	if (!configData) {
		Logger.error(`Configuration '${configToDelete}' not found`);
		return;
	}

	// Confirm deletion
	const confirmed = await confirmDeletion(configToDelete);
	if (!confirmed) {
		Logger.debug("Operation cancelled");
		return;
	}

	const success = configManager.deleteConfig(configToDelete);

	if (success) {
		Logger.info(`Configuration '${configToDelete}' deleted successfully`);

		// If it was the active configuration, inform the user
		const currentConfig = configManager.getCurrentConfig();
		if (!currentConfig) {
			Logger.warn("No active configuration now");
			if (configs.length > 1) {
				Logger.info(`Use '${config.appName} config use <name>' to activate another`);
			}
		}
	} else {
		Logger.error(`Failed to delete configuration '${configToDelete}'`);
	}
}
