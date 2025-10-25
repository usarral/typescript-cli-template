# Utilities Documentation

This document describes the utility functions and classes available in the TypeScript CLI Template.

## Logger

Location: `src/utils/ChalkLogger.ts`

The `ChalkLogger` is a singleton logger that provides colored console output using Chalk. Internally uses `console.log`, `console.info`, `console.warn`, and `console.error`.

### Usage

```typescript
import { Logger } from './utils/Logger';

// Debug messages (gray)
Logger.debug('Debug information');

// Info messages (blue)
Logger.info('Operation completed successfully');

// Warning messages (yellow)
Logger.warn('This is a warning');

// Error messages (red)
Logger.error('An error occurred');

// Fatal errors (red bold, exits process)
Logger.fatal('Critical error, exiting...');
```

### Configuration

```typescript
Logger.setOptions({
  level: 'debug',     // 'debug' | 'info' | 'warn' | 'error' | 'fatal'
  timestamp: true,    // Include timestamps
  logFile: './app.log' // Optional: write to file
});
```

### Internal Implementation

The logger uses the following console methods internally:
- `debug()` → `console.log()` with gray color
- `info()` → `console.info()` with blue color
- `warn()` → `console.warn()` with yellow color
- `error()` → `console.error()` with red color
- `fatal()` → `console.error()` with bold red, then exits

## Timeout Utilities

Location: `src/utils/timeout.ts`

Utilities for handling timeouts and retries in async operations.

### withTimeout

Wraps a promise with a timeout mechanism.

```typescript
import { withTimeout } from './utils/timeout';

try {
  const result = await withTimeout(
    fetchData(),
    5000,
    'Operation timed out after 5 seconds'
  );
  Logger.info('Data fetched successfully');
} catch (error) {
  Logger.error(`Failed: ${error.message}`);
}
```

**Parameters:**
- `promise: Promise<T>` - The promise to wrap
- `timeoutMs: number` - Timeout in milliseconds
- `errorMessage?: string` - Custom error message

### retry

Retries a function multiple times with exponential backoff.

```typescript
import { retry } from './utils/timeout';

try {
  const data = await retry(
    async () => {
      const response = await fetch('https://api.example.com/data');
      if (!response.ok) throw new Error('Failed to fetch');
      return response.json();
    },
    {
      maxAttempts: 3,
      delayMs: 1000,
      backoff: 'exponential' // or 'linear'
    }
  );
  Logger.info('Data retrieved successfully');
} catch (error) {
  Logger.error(`All retry attempts failed: ${error.message}`);
}
```

**Options:**
- `maxAttempts: number` - Maximum number of attempts (default: 3)
- `delayMs: number` - Initial delay between attempts in milliseconds (default: 1000)
- `backoff: 'linear' | 'exponential'` - Backoff strategy (default: 'exponential')

### delay

Simple promise-based delay function.

```typescript
import { delay } from './utils/timeout';

Logger.info('Starting operation...');
await delay(2000);
Logger.info('2 seconds later');
```

## Configuration Manager

Location: `src/utils/configManager.ts`

Manages configuration files with Zod schema validation.

### Schema Validation

The config manager uses Zod for runtime validation:

```typescript
import { z } from 'zod';
import { AppConfigSchema } from './utils/configManager';

// The default schema
const schema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  settings: z.record(z.unknown()).optional(),
});

// Type inference
type AppConfig = z.infer<typeof AppConfigSchema>;
```

### Usage

```typescript
import { ConfigManager } from './utils/configManager';

const manager = ConfigManager.getInstance();

// Create config with validation
try {
  await manager.create('my-config', {
    name: 'My Config',
    description: 'A sample configuration',
    settings: { apiUrl: 'https://api.example.com' }
  });
  Logger.info('Config created successfully');
} catch (error) {
  Logger.error(`Validation failed: ${error.message}`);
}

// List all configs
const configs = await manager.list();
Logger.info(`Found ${configs.length} configurations`);

// Use a config
await manager.use('my-config');
Logger.info('Config activated');

// Get current config
const current = await manager.getCurrent();
if (current) {
  Logger.info(`Current config: ${current.name}`);
}
```

### Extending the Schema

You can extend the base schema for custom validation:

```typescript
import { AppConfigSchema } from './utils/configManager';
import { z } from 'zod';

const ExtendedConfigSchema = AppConfigSchema.extend({
  apiKey: z.string().min(32, 'API key must be at least 32 characters'),
  environment: z.enum(['development', 'staging', 'production']),
  port: z.number().min(1).max(65535),
});

type ExtendedConfig = z.infer<typeof ExtendedConfigSchema>;
```

## Version Utility

Location: `src/utils/version.ts`

Retrieves the package version from `package.json`.

```typescript
import { getVersion } from './utils/version';

const version = getVersion();
Logger.info(`CLI Version: ${version}`);
```

## Testing

All utilities include comprehensive test coverage:

```bash
# Run all tests
pnpm test

# Run tests with UI
pnpm test:ui

# Run with coverage
pnpm test:coverage
```

Test files:
- `src/__tests__/version.test.ts` - Version utility tests
- `src/__tests__/timeout.test.ts` - Timeout utilities tests
- `src/__tests__/configManager.test.ts` - Config manager and Zod validation tests

## Examples

See the `examples/` directory for complete working examples:

- `retry-timeout.example.ts` - Demonstrates retry and timeout patterns
- `zod-validation.example.ts` - Shows extended Zod schema usage
- `api-integration.example.ts` - API integration example
- `custom-command.example.ts` - Custom command example
- `extended-config.example.ts` - Extended configuration example
