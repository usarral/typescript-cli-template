/**
 * Example: API Integration
 *
 * This example shows how to integrate with an external API,
 * handle responses, and display data beautifully.
 */

import axios from "axios";
import chalk from "chalk";
import type { Command } from "commander";
import inquirer from "inquirer";
import { Logger } from "../src/utils/Logger";

interface User {
	id: number;
	name: string;
	email: string;
	username: string;
}

async function fetchUsers(): Promise<User[]> {
	try {
		Logger.debug("Fetching users from API...");
		const response = await axios.get<User[]>("https://jsonplaceholder.typicode.com/users");
		Logger.debug(`Received ${response.data.length} users`);
		return response.data;
	} catch (error) {
		Logger.error("API request failed:", error);
		throw new Error("Failed to fetch users from API");
	}
}

function displayUser(user: User): void {
	console.log(chalk.cyan(`\n👤 ${user.name}`));
	console.log(chalk.gray(`   ID: ${user.id}`));
	console.log(chalk.gray(`   Username: ${user.username}`));
	console.log(chalk.gray(`   Email: ${user.email}`));
}

export function setupApiCommand(program: Command): void {
	program
		.command("fetch-users")
		.description("Fetch and display users from JSONPlaceholder API")
		.option("-l, --limit <number>", "Limit number of users to display", "5")
		.option("-i, --interactive", "Select a user interactively")
		.action(async (options: { limit: string; interactive?: boolean }) => {
			try {
				console.log(chalk.blue("📡 Fetching users...\n"));

				const users = await fetchUsers();
				const limit = Number.parseInt(options.limit, 10);
				const displayUsers = users.slice(0, limit);

				if (options.interactive) {
					const { selectedUser } = await inquirer.prompt([
						{
							type: "list",
							name: "selectedUser",
							message: "Select a user:",
							choices: displayUsers.map((user) => ({
								name: `${user.name} (${user.email})`,
								value: user,
							})),
						},
					]);

					displayUser(selectedUser);
				} else {
					console.log(chalk.green(`✅ Found ${users.length} users\n`));

					for (const user of displayUsers) {
						displayUser(user);
					}

					if (users.length > limit) {
						console.log(chalk.yellow(`\n... and ${users.length - limit} more users`));
					}
				}
			} catch (error) {
				Logger.error("Command failed:", error);
				console.error(chalk.red("❌ Failed to fetch users"));
				process.exit(1);
			}
		});
}

// Usage in src/index.ts:
// import { setupApiCommand } from "./commands/api";
// setupApiCommand(program);
