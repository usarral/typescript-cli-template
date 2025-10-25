# Configuration Management Template

This directory contains a complete configuration management system for CLI applications. It provides CRUD operations for managing multiple named configurations with the ability to switch between them.

## Features

- ✅ Create, list, use, delete configurations
- ✅ Active configuration tracking
- ✅ Interactive prompts with validation
- ✅ Type-safe configuration management
- ✅ File-based storage in user's home directory
- ✅ Logging integration
- ✅ Clean error handling

## Architecture

### Core Components

- **`configManager.ts`**: File-based configuration storage and retrieval
- **`index.ts`**: Command setup and registration
- **`create.ts`**: Interactive configuration creation
- **`list.ts`**: Display all configurations
- **`current.ts`**: Show active configuration
- **`use.ts`**: Switch between configurations
- **`delete.ts`**: Remove configurations with confirmation

### Configuration Storage

Configurations are stored in `~/.{app-name}/configs/` as individual JSON files:
- Each configuration: `{name}.json`
- Active config pointer: `current.json`

## Customization Guide

### 1. Define Your Configuration Properties

Edit `src/utils/configManager.ts`:

```typescript
export interface AppConfig {
  name: string;
  description?: string;
  // Add your custom properties
  apiUrl?: string;
  apiKey?: string;
  timeout?: number;
  environment?: "development" | "staging" | "production";
}
```

### 2. Add Input Prompts

Edit `src/commands/config/create.ts` in the `promptConfigDetails` function:

```typescript
{
  type: "input",
  name: "apiUrl",
  message: "API URL:",
  validate: (input) => {
    if (!input.trim()) return "API URL is required";
    try {
      new URL(input.trim());
      return true;
    } catch {
      return "Please enter a valid URL";
    }
  },
},
{
  type: "password",
  name: "apiKey",
  message: "API Key:",
  validate: (input) => input.trim() ? true : "API Key is required",
},
{
  type: "list",
  name: "environment",
  message: "Environment:",
  choices: ["development", "staging", "production"],
  default: "development",
},
```

### 3. Map Prompts to Configuration

In the same `create.ts` file, update the config object:

```typescript
const config: AppConfig = {
  name: answers.name.trim(),
  description: answers.description?.trim() || undefined,
  apiUrl: answers.apiUrl.trim(),
  apiKey: answers.apiKey.trim(),
  timeout: answers.timeout,
  environment: answers.environment,
};
```

### 4. Customize Display Functions

Update display functions in:

**`list.ts`**:
```typescript
function displayConfigDetails(configData: AppConfig): void {
  if (configData.description) {
    console.log(`   📝 ${configData.description}`);
  }
  if ('apiUrl' in configData) {
    console.log(`   🌐 API: ${configData.apiUrl}`);
  }
  if ('environment' in configData) {
    console.log(`   🏷️  Env: ${configData.environment}`);
  }
}
```

**`current.ts`** and **`use.ts`**: Update `displayCurrentConfigDetails` and `displayConfigSummary` similarly.

## Usage Examples

```bash
# Create a new configuration
my-cli config create

# List all configurations
my-cli config list
my-cli config ls

# Show active configuration
my-cli config current

# Switch to a different configuration
my-cli config use production

# Delete a configuration
my-cli config delete dev
my-cli config rm staging
```

## Using Configurations in Your Code

Access the active configuration from anywhere in your application:

```typescript
import { configManager } from "../utils/configManager";

// Get current config name
const currentName = configManager.getCurrentConfig();

// Get full config data
const config = configManager.getCurrentConfigData();

if (!config) {
  console.error("No active configuration. Run 'my-cli config create' first.");
  process.exit(1);
}

// Use config properties
fetch(config.apiUrl, {
  headers: {
    'Authorization': `Bearer ${config.apiKey}`
  }
});
```

## Best Practices

1. **Validation**: Always validate user input in prompts
2. **Sensitive Data**: Use `type: "password"` for API keys and tokens
3. **Required Fields**: Mark essential fields as required in validation
4. **User Feedback**: Provide clear messages for all operations
5. **Error Handling**: Use try-catch blocks and log errors properly
6. **Type Safety**: Extend `AppConfig` with strict types for your properties

## Security Considerations

- Configuration files are stored in plain text in the user's home directory
- For production use, consider encrypting sensitive data (API keys, passwords)
- Never commit configuration files to version control
- Consider using environment-specific configs (dev/staging/prod)

## Testing

When testing configuration management:

```typescript
import { FileConfigManager } from "../utils/configManager";

// Use a test directory
const testConfigManager = new FileConfigManager("test-app", "/tmp/test-configs");
```

## Migration from Your Old Code

This template has been adapted from your Jenkins CLI to be generic:

- ❌ Removed: Jenkins-specific fields (url, username, token)
- ❌ Removed: Butler-cli references
- ✅ Added: Generic AppConfig interface
- ✅ Added: Logger integration
- ✅ Added: Better error handling
- ✅ Added: TypeScript type safety
- ✅ Added: Extensive documentation

## Next Steps

1. Define your `AppConfig` properties in `configManager.ts`
2. Add input prompts in `create.ts`
3. Update display functions in `list.ts`, `current.ts`, and `use.ts`
4. Test the configuration flow
5. Document your specific configuration properties for your users
