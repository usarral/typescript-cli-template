import { appendFileSync } from "node:fs";
import chalk from "chalk";
import { type Logger, LogLevel } from "./Logger";

/**
 * Configuration options for the logger
 */
export interface LoggerOptions {
	/** Whether to show timestamp in log messages */
	showTimestamp?: boolean;
	/** Whether to colorize log output */
	colorize?: boolean;
	/** Optional file path to write logs to */
	logFile?: string;
}

/**
 * Chalk-based implementation of the Logger interface
 * Provides colorful console logging with configurable options
 */
export class ChalkLogger implements Logger {
	private static instance: ChalkLogger;
	private logLevel: LogLevel = LogLevel.INFO;
	private options: LoggerOptions = {
		showTimestamp: true,
		colorize: true,
	};

	private constructor() {}

	/**
	 * Gets the singleton instance of ChalkLogger
	 * @returns The ChalkLogger instance
	 */
	public static getInstance(): ChalkLogger {
		if (!ChalkLogger.instance) {
			ChalkLogger.instance = new ChalkLogger();
		}
		return ChalkLogger.instance;
	}

	/**
	 * Generates an ISO timestamp string
	 * @returns ISO formatted timestamp
	 */
	private timestamp(): string {
		return new Date().toISOString();
	}

	/**
	 * Determines if a message should be logged based on current log level
	 * @param level - The log level to check
	 * @returns True if the message should be logged
	 */
	private shouldLog(level: LogLevel): boolean {
		return level >= this.logLevel;
	}

	/**
	 * Sets the minimum log level
	 * @param level - The minimum log level to display
	 */
	public setLogLevel(level: LogLevel): void {
		this.logLevel = level;
	}

	/**
	 * Updates logger options
	 * @param options - Partial options to merge with current settings
	 */
	public setOptions(options: Partial<LoggerOptions>): void {
		this.options = { ...this.options, ...options };
	}

	private formatMessage(level: string, ...args: unknown[]): string {
		const timestamp = this.options.showTimestamp ? ` ${this.timestamp()}` : "";
		const prefix = `[${level}]${timestamp}`;

		const formattedArgs = args.map((arg) => {
			if (typeof arg === "object" && arg !== null) {
				try {
					return JSON.stringify(arg, null, 2);
				} catch {
					return String(arg);
				}
			}
			return arg;
		});

		return `${prefix} ${formattedArgs.join(" ")}`;
	}

	/**
	 * Writes a log entry to file if logFile option is configured
	 * @param level - Log level name
	 * @param message - Formatted message to write
	 */
	private logToFile(level: string, message: string): void {
		if (this.options.logFile) {
			try {
				const logEntry = `${new Date().toISOString()} [${level}] ${message}\n`;
				appendFileSync(this.options.logFile, logEntry);
			} catch (error) {
				// Silently fail to avoid infinite loops if logger itself fails
				console.error("Failed to write to log file:", error);
			}
		}
	}

	fatal(...args: unknown[]): void {
		if (this.shouldLog(LogLevel.FATAL)) {
			const formattedMessage = this.formatMessage("FATAL", ...args);
			const coloredMessage = this.options.colorize
				? chalk.bgRed.white(formattedMessage)
				: formattedMessage;
			console.error(coloredMessage);
			this.logToFile("FATAL", args.join(" "));
		}
	}

	error(...args: unknown[]): void {
		if (this.shouldLog(LogLevel.ERROR)) {
			const formattedMessage = this.formatMessage("ERROR", ...args);
			const coloredMessage = this.options.colorize ? chalk.red(formattedMessage) : formattedMessage;
			console.error(coloredMessage);
			this.logToFile("ERROR", args.join(" "));
		}
	}

	warn(...args: unknown[]): void {
		if (this.shouldLog(LogLevel.WARN)) {
			const formattedMessage = this.formatMessage("WARN", ...args);
			const coloredMessage = this.options.colorize
				? chalk.yellow(formattedMessage)
				: formattedMessage;
			console.warn(coloredMessage);
			this.logToFile("WARN", args.join(" "));
		}
	}

	info(...args: unknown[]): void {
		if (this.shouldLog(LogLevel.INFO)) {
			const formattedMessage = this.formatMessage("INFO", ...args);
			const coloredMessage = this.options.colorize
				? chalk.blue(formattedMessage)
				: formattedMessage;
			console.info(coloredMessage);
			this.logToFile("INFO", args.join(" "));
		}
	}

	debug(...args: unknown[]): void {
		if (this.shouldLog(LogLevel.DEBUG)) {
			const formattedMessage = this.formatMessage("DEBUG", ...args);
			const coloredMessage = this.options.colorize
				? chalk.gray(formattedMessage)
				: formattedMessage;
			console.log(coloredMessage);
			this.logToFile("DEBUG", args.join(" "));
		}
	}
}
