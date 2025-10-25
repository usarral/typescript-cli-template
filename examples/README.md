# Examples

This directory contains example implementations showing how to use various features of the TypeScript CLI Template.

## Available Examples

### 1. API Integration (`api-integration.example.ts`)

Demonstrates how to:
- Integrate with external REST APIs using axios
- Handle API responses and errors
- Display data in a user-friendly format
- Use interactive prompts with inquirer

### 2. Custom Commands (`custom-command.example.ts`)

Shows how to create custom CLI commands with options and arguments.

### 3. Extended Configuration (`extended-config.example.ts`)

Illustrates how to extend the base configuration schema with custom properties.

### 4. Retry & Timeout (`retry-timeout.example.ts`) 🆕

Demonstrates:
- Using `withTimeout` for async operations
- Implementing retry logic with exponential backoff
- Handling API failures gracefully
- Combining timeout and retry utilities

### 5. Zod Validation (`zod-validation.example.ts`) 🆕

Shows how to:
- Extend configuration with Zod schemas
- Add complex validation rules
- Handle validation errors
- Create type-safe configurations

## Using These Examples

Each example file contains detailed comments and usage instructions at the bottom.

### To use an example:

1. Copy the relevant code to your `src/commands/` directory
2. Import the setup function in `src/index.ts`:
   ```typescript
   import { setupRetryExampleCommand } from "./commands/retryExample";
   ```

3. Register the command before `program.parse()`:
   ```typescript
   setupRetryExampleCommand(program);
   program.parse(process.argv);
   ```

4. Build and test:
   ```bash
   pnpm build
   pnpm start retry-example
   ```

## Additional Resources

- [Utilities Documentation](../docs/UTILITIES.md) - Detailed docs for all utilities
- [Commander.js Docs](https://github.com/tj/commander.js#readme)
- [Inquirer.js Docs](https://github.com/SBoudrias/Inquirer.js#readme)
- [Zod Docs](https://zod.dev/)
- [Axios Docs](https://axios-http.com/docs/intro)
