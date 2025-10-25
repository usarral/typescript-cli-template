import type { Command } from "commander";
import { createConfig } from "./create";
import { showCurrentConfig } from "./current";
import { deleteConfig } from "./delete";
import { listConfigs } from "./list";
import { useConfig } from "./use";

/**
 * Sets up configuration management commands
 * Provides CRUD operations for application configurations
 */
export function setupConfigCommands(program: Command): void {
	const configCommand = program.command("config").description("Manage application configurations");

	configCommand.command("create").description("Create a new configuration").action(createConfig);

	configCommand
		.command("list")
		.alias("ls")
		.description("List all configurations")
		.action(listConfigs);

	configCommand
		.command("use")
		.argument("<name>", "Configuration name")
		.description("Set a configuration as active")
		.action(useConfig);

	configCommand
		.command("delete")
		.alias("rm")
		.argument("[name]", "Configuration name to delete")
		.description("Delete a configuration")
		.action(deleteConfig);

	configCommand
		.command("current")
		.description("Show the active configuration")
		.action(showCurrentConfig);
}
