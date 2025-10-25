import { ChalkLogger, type LoggerOptions } from "./ChalkLogger";

/**
 * Log levels in ascending order of severity
 */
export enum LogLevel {
	DEBUG = 0,
	INFO = 1,
	WARN = 2,
	ERROR = 3,
	FATAL = 4,
}

/**
 * Logger interface defining the contract for all logger implementations
 */
export interface Logger {
	/**
	 * Sets the minimum log level that will be displayed
	 * @param level - The minimum log level to display
	 */
	setLogLevel(level: LogLevel): void;

	/**
	 * Updates logger configuration options
	 * @param options - Partial logger options to merge with current settings
	 */
	setOptions?(options: Partial<LoggerOptions>): void;

	/**
	 * Logs a fatal error message (highest severity)
	 * @param args - Message and optional additional data to log
	 */
	fatal(...args: unknown[]): void;

	/**
	 * Logs an error message
	 * @param args - Message and optional additional data to log
	 */
	error(...args: unknown[]): void;

	/**
	 * Logs a warning message
	 * @param args - Message and optional additional data to log
	 */
	warn(...args: unknown[]): void;

	/**
	 * Logs an informational message
	 * @param args - Message and optional additional data to log
	 */
	info(...args: unknown[]): void;

	/**
	 * Logs a debug message (lowest severity)
	 * @param args - Message and optional additional data to log
	 */
	debug(...args: unknown[]): void;
}

// Proxy to the concrete logger implementation (ChalkLogger singleton)
const instance = ChalkLogger.getInstance();

export const Logger: Logger & {
	setLogLevel(level: LogLevel): void;
	setOptions(options: Partial<LoggerOptions>): void;
} = {
	setLogLevel: (level: LogLevel) => instance.setLogLevel(level),
	setOptions: (options: Partial<LoggerOptions>) => instance.setOptions(options),
	fatal: (...args: unknown[]) => instance.fatal(...args),
	error: (...args: unknown[]) => instance.error(...args),
	warn: (...args: unknown[]) => instance.warn(...args),
	info: (...args: unknown[]) => instance.info(...args),
	debug: (...args: unknown[]) => instance.debug(...args),
};
