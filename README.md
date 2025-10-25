# TypeScript CLI Template

A professional and feature-rich template for building command-line interface (CLI) applications using TypeScript, Commander.js, and modern development tools.

## ✨ Features

- 🎯 **TypeScript** - Full type safety and modern JavaScript features
- 🎨 **Commander.js** - Powerful CLI framework with sub-commands support
- 🎭 **Inquirer.js** - Beautiful interactive prompts
- 🌈 **Chalk** - Colorful terminal output
- 🔧 **Biome** - Fast linter and formatter (Prettier + ESLint alternative)
- 📦 **pnpm** - Fast, disk space efficient package manager
- 🔍 **Structured Logging** - Built-in logger with multiple log levels and file output
- ⚙️ **Configuration Management** - Built-in config system with CRUD operations and validation
- ✅ **Zod Validation** - Runtime schema validation for configurations
- ⏱️ **Timeout Utilities** - Async helpers with timeout, retry, and delay functions
- 🧪 **Vitest** - Fast unit testing with coverage support
- 🛡️ **Graceful Shutdown** - Proper signal handling for clean exits
- 🚀 **Hot Reload** - Development mode with watch support

## 📋 Prerequisites

- Node.js >= 18
- pnpm >= 8 (or use `npm install -g pnpm`)

## 🚀 Quick Start

### Using this template

1. **Clone or use this template:**
   ```bash
   git clone https://github.com/usarral/typescript-cli-template.git my-cli
   cd my-cli
   ```

2. **Install dependencies:**
   ```bash
   pnpm install
   ```

3. **Customize your CLI:**
   - Update `package.json` with your CLI name and details
   - Modify `src/index.ts` to change the CLI name
   - Extend `src/utils/configManager.ts` with your custom config properties
   - Add your commands in `src/commands/`

4. **Run in development:**
   ```bash
   pnpm dev
   ```

5. **Build for production:**
   ```bash
   pnpm build
   pnpm start
   ```

## 📖 Usage

### Built-in Commands

#### Configuration Management

```bash
# Create a new configuration
demo-cli config create

# List all configurations
demo-cli config list

# Set active configuration
demo-cli config use <name>

# Show current configuration
demo-cli config current

# Delete a configuration
demo-cli config delete [name]
```

#### Global Options

```bash
# Enable verbose/debug logging
demo-cli --verbose [command]

# Disable colored output
demo-cli --no-color [command]

# Show version
demo-cli --version

# Show help
demo-cli --help
```

## 🏗️ Project Structure

```
typescript-cli-template/
├── src/
│   ├── index.ts              # CLI entry point
│   ├── commands/             # Command implementations
│   │   └── config/           # Config management commands
│   │       ├── create.ts     # Create new config
│   │       ├── list.ts       # List configs
│   │       ├── use.ts        # Set active config
│   │       ├── current.ts    # Show current config
│   │       ├── delete.ts     # Delete config
│   │       └── index.ts      # Setup config commands
│   └── utils/                # Utility modules
│       ├── Logger.ts         # Logger interface
│       ├── ChalkLogger.ts    # Chalk-based logger implementation
│       ├── config.ts         # App configuration
│       ├── configManager.ts  # Configuration file manager
│       └── version.ts        # Version helper
├── dist/                     # Compiled JavaScript (generated)
├── package.json
├── tsconfig.json
├── biome.json
└── README.md
```

## 🛠️ Development

### Available Scripts

```bash
# Development mode with hot reload
pnpm dev:watch

# Run without building
pnpm dev

# Build TypeScript to JavaScript
pnpm build

# Run built version
pnpm start

# Lint code
pnpm lint

# Lint and fix issues
pnpm lint:fix

# Format code
pnpm format

# Run tests
pnpm test

# Run tests with UI
pnpm test:ui

# Run tests with coverage
pnpm test:coverage

# Type check without emitting
pnpm type-check

# Watch mode for TypeScript compilation
pnpm watch

# Clean build directory
pnpm clean
```

### Adding New Commands

1. Create a new file in `src/commands/`:

```typescript
import { Command } from "commander";
import { Logger } from "../utils/Logger";

export function myCommand(program: Command): void {
  program
    .command("mycommand")
    .description("My awesome command")
    .action(() => {
      Logger.info("Executing my command!");
      // Your logic here
    });
}
```

2. Register it in `src/index.ts`:

```typescript
import { myCommand } from "./commands/myCommand";
// ...
myCommand(program);
```

### Customizing Configuration

To add custom properties to your configuration:

1. **Extend the `AppConfig` interface** in `src/utils/configManager.ts`:

```typescript
export interface AppConfig {
  name: string;
  description?: string;
  // Add your custom properties:
  apiUrl?: string;
  apiKey?: string;
  timeout?: number;
}
```

2. **Update the create command** in `src/commands/config/create.ts`:

```typescript
// Add prompts for your fields
{
  type: "input",
  name: "apiUrl",
  message: "API URL:",
  validate: (input) => input.trim() ? true : "API URL is required",
},
```

3. **Update the list command** in `src/commands/config/list.ts` to display your fields.

## 🎨 Logger Configuration

The built-in logger supports multiple log levels, customization, and file output. The logger uses `console.log/info/warn/error` internally with colors via Chalk:

```typescript
import { Logger, LogLevel } from "./utils/Logger";

// Set log level
Logger.setLogLevel(LogLevel.DEBUG);

// Configure logger options (including file output)
Logger.setOptions({
  showTimestamp: false,  // Disable timestamps
  colorize: false,       // Disable colors
  logFile: "/path/to/app.log",  // Enable file logging
});

// Use different log levels
Logger.debug("Debug information");
Logger.info("General information");
Logger.warn("Warning message");
Logger.error("Error occurred");
Logger.fatal("Critical error");

// Log objects (auto-formatted as JSON)
Logger.info("User data:", { id: 1, name: "John" });
```

### Using Logger in Commands

Always use `Logger` for all output in your commands:

```typescript
import { Logger } from "./utils/Logger";

export async function myCommand(): Promise<void> {
  Logger.info("Starting operation...");
  
  try {
    // Your logic
    Logger.info("Operation completed successfully");
  } catch (error) {
    Logger.error("Operation failed");
    Logger.debug("Error details:", error);
  }
}
```

## ⏱️ Async Utilities

The template includes powerful utilities for async operations:

```typescript
import { withTimeout, retry, delay } from "./utils/timeout";

// Add timeout to any promise
const result = await withTimeout(
  fetch('https://api.example.com'),
  5000,  // 5 second timeout
  new Error('API request timed out')
);

// Retry failed operations with exponential backoff
const data = await retry(
  () => fetchData(),
  {
    maxAttempts: 3,
    baseDelay: 1000,
    maxDelay: 10000,
    onRetry: (attempt, error) => {
      console.log(`Retry attempt ${attempt}:`, error);
    }
  }
);

// Simple delay
await delay(1000); // Wait 1 second
```

## ✅ Configuration Validation

Configurations are validated using Zod schemas:

```typescript
import { z } from "zod";
import { AppConfigSchema } from "./utils/configManager";

// Extend the base schema for your custom config
const MyConfigSchema = AppConfigSchema.extend({
  apiUrl: z.string().url(),
  apiKey: z.string().min(1),
  timeout: z.number().positive().optional(),
});

// Type-safe config
type MyConfig = z.infer<typeof MyConfigSchema>;
```

## 📦 Publishing Your CLI

1. **Update package.json:**

```json
{
  "name": "your-cli-name",
  "bin": {
    "your-cli": "./dist/index.js"
  }
}
```

2. **Add shebang to `src/index.ts`:**

```typescript
#!/usr/bin/env node
```

3. **Build and test locally:**

```bash
pnpm build
npm link
your-cli --help
```

4. **Publish to npm:**

```bash
npm publish
```

## 🔧 Configuration Files

### TypeScript (`tsconfig.json`)

- Target: ES2021
- Module: ES2022 with bundler resolution
- Strict mode enabled
- Source maps and declarations included

### Biome (`biome.json`)

- Linting and formatting combined
- Git integration enabled
- Auto-organize imports
- Tab indentation, double quotes

## 🤝 Contributing

Contributions are welcome! Feel free to:

- Report bugs
- Suggest new features
- Submit pull requests

## 📄 License

MIT © [usarral](https://github.com/usarral)

## 🙏 Acknowledgments

This template uses the following excellent projects:

- [Commander.js](https://github.com/tj/commander.js) - CLI framework
- [Inquirer.js](https://github.com/SBoudrias/Inquirer.js) - Interactive prompts
- [Chalk](https://github.com/chalk/chalk) - Terminal styling
- [Biome](https://biomejs.dev/) - Linter and formatter
- [TypeScript](https://www.typescriptlang.org/) - Type safety

## 📚 Resources

- [Commander.js Documentation](https://github.com/tj/commander.js#readme)
- [Inquirer.js Documentation](https://github.com/SBoudrias/Inquirer.js#readme)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- [Biome Documentation](https://biomejs.dev/guides/getting-started/)

---

**Happy coding! 🚀**
