import { Logger, LogLevel } from "./Logger";
import { getVersion } from "./version";

interface CliConfig {
	readonly appName: string;
	readonly logLevel: LogLevel;
	readonly version: string;
}
const config: CliConfig = {
	appName: "Test CLI",
	logLevel: LogLevel.INFO,
	version: getVersion() || "1.0.0",
} as const;

Logger.setLogLevel(config.logLevel);
export default config;
