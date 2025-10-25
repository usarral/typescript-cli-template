#!/usr/bin/env node
import { Command } from "commander";
import { setupConfigCommands } from "./commands/config";
import { Logger, LogLevel } from "./utils/Logger";
import { getVersion } from "./utils/version";

const program = new Command();
// Importing `config` above ensures the logger is started with the default level from config

program
	.name("demo-cli")
	.description("A simple CLI application built with TypeScript and Commander.js")
	.version(getVersion())
	.option("-v, --verbose", "Enable verbose logging (debug level)")
	.option("--no-color", "Disable colored output")
	.hook("preAction", (thisCommand) => {
		const opts = thisCommand.opts();
		if (opts.verbose) {
			Logger.setLogLevel(LogLevel.DEBUG);
			Logger.debug("Verbose mode enabled");
		}
		if (opts.color === false) {
			Logger.setOptions({ colorize: false });
			Logger.debug("Color output disabled");
		}
	});

setupConfigCommands(program);

program.parse(process.argv);

// Graceful shutdown on signals
process.on("SIGINT", () => {
	Logger.info("Received SIGINT, shutting down gracefully...");
	process.exit(0);
});

process.on("SIGTERM", () => {
	Logger.info("Received SIGTERM, shutting down gracefully...");
	process.exit(0);
});

// Handle uncaught errors
process.on("uncaughtException", (error) => {
	Logger.fatal("Uncaught exception:", error instanceof Error ? error.message : String(error));
	process.exit(1);
});

process.on("unhandledRejection", (reason) => {
	Logger.fatal("Unhandled rejection:", reason instanceof Error ? reason.message : String(reason));
	process.exit(1);
});
