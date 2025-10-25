/**
 * Example: Custom Command
 *
 * This example shows how to create a custom command with arguments,
 * options, and proper error handling.
 */

import chalk from "chalk";
import type { Command } from "commander";
import { Logger } from "../src/utils/Logger";

interface GreetOptions {
	uppercase?: boolean;
	emoji?: boolean;
}

export function setupGreetCommand(program: Command): void {
	program
		.command("greet")
		.description("Greet a user with a custom message")
		.argument("<name>", "Name of the person to greet")
		.option("-u, --uppercase", "Convert greeting to uppercase")
		.option("-e, --emoji", "Add emoji to greeting")
		.action(async (name: string, options: GreetOptions) => {
			try {
				Logger.debug("Greet command called", { name, options });

				let message = `Hello, ${name}!`;

				if (options.uppercase) {
					message = message.toUpperCase();
				}

				if (options.emoji) {
					message = `👋 ${message} 🎉`;
				}

				console.log(chalk.green(message));
				Logger.info("Greeting sent successfully");
			} catch (error) {
				Logger.error("Failed to greet user:", error);
				console.error(chalk.red("❌ An error occurred while greeting"));
				process.exit(1);
			}
		});
}

// Usage in src/index.ts:
// import { setupGreetCommand } from "./commands/greet";
// setupGreetCommand(program);
