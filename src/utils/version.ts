import { readFileSync } from "node:fs";
import { join } from "node:path";
import { Logger } from "./Logger";

/**
 * Retrieves the application version from package.json
 * @returns The version string or "unknown" if it cannot be read
 */
export function getVersion(): string {
	try {
		const packageJsonPath = join(__dirname, "../../package.json");
		const packageJson = JSON.parse(readFileSync(packageJsonPath, "utf-8"));
		return packageJson.version || "unknown";
	} catch (error) {
		const errorMessage = error instanceof Error ? error.message : String(error);
		Logger.error("Failed to read version from package.json:", errorMessage);
		return "unknown";
	}
}
