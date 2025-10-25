/** @type {import('@commitlint/types').UserConfig} */
export default {
	extends: ["@commitlint/config-conventional"],
	rules: {
		"type-enum": [
			2,
			"always",
			[
				"feat", // New feature
				"fix", // Bug fix
				"docs", // Documentation changes
				"style", // Formatting changes (no code change)
				"refactor", // Refactoring
				"perf", // Performance improvements
				"test", // Add or modify tests
				"build", // Build system changes
				"ci", // CI changes
				"chore", // Other tasks
				"revert", // Revert a commit
			],
		],
		"subject-case": [2, "never", ["start-case", "pascal-case", "upper-case"]],
	},
};
