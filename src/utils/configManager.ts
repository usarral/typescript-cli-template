import {
	existsSync,
	mkdirSync,
	readdirSync,
	readFileSync,
	unlinkSync,
	writeFileSync,
} from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";
import { z } from "zod";
import config from "./config";
import { Logger } from "./Logger";

/**
 * Zod schema for base configuration validation
 * Extend this schema when adding custom properties to your config
 */
export const AppConfigSchema = z.object({
	name: z.string().min(1, "Configuration name is required").max(50, "Name too long"),
	description: z.string().optional(),
	// TEMPLATE: Add your custom config property validations here
	// Example:
	// apiUrl: z.string().url().optional(),
	// apiKey: z.string().min(1).optional(),
	// timeout: z.number().positive().optional(),
});

/**
 * Base configuration interface that all configs must extend
 * Add your custom properties when implementing your CLI
 * @property {string} name - Unique configuration name (required)
 * @property {string} [description] - Optional description of the configuration
 */
export type AppConfig = z.infer<typeof AppConfigSchema>;

/**
 * Configuration manager interface for handling CLI configurations
 * @template T - Configuration type that extends AppConfig
 */
export interface ConfigManager<T extends AppConfig = AppConfig> {
	/**
	 * Lists all available configuration names
	 * @returns Array of configuration names
	 */
	listConfigs(): string[];

	/**
	 * Retrieves a configuration by name
	 * @param name - Configuration name
	 * @returns Configuration object or null if not found
	 */
	getConfig(name: string): T | null;

	/**
	 * Saves a configuration
	 * @param config - Configuration object to save
	 * @returns True if saved successfully
	 */
	saveConfig(config: T): boolean;

	/**
	 * Deletes a configuration by name
	 * @param name - Configuration name to delete
	 * @returns True if deleted successfully
	 */
	deleteConfig(name: string): boolean;

	/**
	 * Gets the name of the currently active configuration
	 * @returns Current configuration name or null if none is active
	 */
	getCurrentConfig(): string | null;

	/**
	 * Gets the data of the currently active configuration
	 * @returns Current configuration object or null if none is active
	 */
	getCurrentConfigData(): T | null;

	/**
	 * Sets a configuration as the currently active one
	 * @param name - Configuration name to set as current
	 * @returns True if set successfully
	 */
	setCurrentConfig(name: string): boolean;

	/**
	 * Gets the configuration directory path
	 * @returns Absolute path to configuration directory
	 */
	getConfigDir(): string;

	/**
	 * Checks if a configuration exists
	 * @param name - Configuration name to check
	 * @returns True if configuration exists
	 */
	configExists(name: string): boolean;
}

class FileConfigManager<T extends AppConfig = AppConfig> implements ConfigManager<T> {
	private readonly configDir: string;
	private readonly currentConfigFile: string;
	private readonly appName: string;

	constructor(appName?: string, configDir?: string) {
		this.appName = appName || config.appName;
		const configDirName = this.appName.toLowerCase().replace(/\s+/g, "-");
		this.configDir = configDir || join(homedir(), `.${configDirName}`, "configs");
		this.currentConfigFile = join(this.configDir, "current.json");
		this.ensureConfigDirExists();
		this.ensureCurrentConfigFileExists();
	}

	private ensureConfigDirExists(): void {
		if (!existsSync(this.configDir)) {
			mkdirSync(this.configDir, { recursive: true });
			Logger.debug(`Config directory created: ${this.configDir}`);
		}
	}

	private ensureCurrentConfigFileExists(): void {
		if (!existsSync(this.currentConfigFile)) {
			writeFileSync(this.currentConfigFile, JSON.stringify({ name: "" }), "utf-8");
			Logger.debug(`Current config file created: ${this.currentConfigFile}`);
		}
	}

	private getConfigFilePath(name: string): string {
		return join(this.configDir, `${name}.json`);
	}

	getConfigDir(): string {
		return this.configDir;
	}

	configExists(name: string): boolean {
		return existsSync(this.getConfigFilePath(name));
	}

	listConfigs(): string[] {
		try {
			return readdirSync(this.configDir)
				.filter((file) => file.endsWith(".json") && file !== "current.json")
				.map((file) => file.replace(".json", ""));
		} catch (error) {
			Logger.error("Error listing configs:", error);
			return [];
		}
	}

	getConfig(name: string): T | null {
		try {
			const filePath = this.getConfigFilePath(name);

			if (!existsSync(filePath)) {
				Logger.debug(`Config not found: ${name}`);
				return null;
			}

			const content = readFileSync(filePath, "utf-8");
			const parsed = JSON.parse(content);

			// Validate config structure with Zod
			const validationResult = AppConfigSchema.safeParse(parsed);

			if (!validationResult.success) {
				Logger.error(`Invalid config format for '${name}':`, validationResult.error.issues);
				return null;
			}

			return parsed as T;
		} catch (error) {
			const errorMessage = error instanceof Error ? error.message : String(error);
			Logger.error(`Error getting config '${name}':`, errorMessage);
			return null;
		}
	}

	saveConfig(config: T): boolean {
		try {
			// Validate config before saving
			const validationResult = AppConfigSchema.safeParse(config);

			if (!validationResult.success) {
				Logger.error("Invalid config data:", validationResult.error.issues);
				return false;
			}

			const filePath = this.getConfigFilePath(config.name);
			writeFileSync(filePath, JSON.stringify(config, null, 2), "utf-8");
			Logger.debug(`Config saved: ${config.name}`);
			return true;
		} catch (error) {
			const errorMessage = error instanceof Error ? error.message : String(error);
			Logger.error(`Error saving config '${config.name}':`, errorMessage);
			return false;
		}
	}

	deleteConfig(name: string): boolean {
		try {
			const filePath = this.getConfigFilePath(name);

			if (!existsSync(filePath)) {
				Logger.warn(`Config not found: ${name}`);
				return false;
			}

			unlinkSync(filePath);
			Logger.debug(`Config deleted: ${name}`);

			// If deleted config was the current one, clear current config
			const currentConfig = this.getCurrentConfig();
			if (currentConfig === name) {
				this.clearCurrentConfig();
			}

			return true;
		} catch (error) {
			Logger.error(`Error deleting config '${name}':`, error);
			return false;
		}
	}

	getCurrentConfig(): string | null {
		try {
			const content = readFileSync(this.currentConfigFile, "utf-8");
			const current = JSON.parse(content);
			return current.name || null;
		} catch (error) {
			Logger.error("Error getting current config:", error);
			return null;
		}
	}

	getCurrentConfigData(): T | null {
		const currentName = this.getCurrentConfig();
		if (!currentName) {
			return null;
		}
		return this.getConfig(currentName);
	}

	setCurrentConfig(name: string): boolean {
		try {
			if (!this.configExists(name)) {
				Logger.warn(`Config not found: ${name}`);
				return false;
			}

			writeFileSync(this.currentConfigFile, JSON.stringify({ name }), "utf-8");
			Logger.debug(`Current config set: ${name}`);
			return true;
		} catch (error) {
			Logger.error(`Error setting current config '${name}':`, error);
			return false;
		}
	}

	private clearCurrentConfig(): void {
		try {
			writeFileSync(this.currentConfigFile, JSON.stringify({ name: "" }), "utf-8");
			Logger.debug("Current config cleared");
		} catch (error) {
			Logger.error("Error clearing current config:", error);
		}
	}
}

export const configManager = new FileConfigManager();
