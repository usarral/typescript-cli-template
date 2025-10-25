# Contributing to TypeScript CLI Template

Thank you for your interest in contributing! 🎉

## How to Contribute

### Reporting Bugs

If you find a bug, please create an issue with:

- A clear title and description
- Steps to reproduce the issue
- Expected vs actual behavior
- Your environment (Node version, OS, etc.)

### Suggesting Enhancements

We welcome feature requests! Please:

- Check if the feature has already been suggested
- Provide a clear use case
- Explain why this would be useful to most users

### Pull Requests

1. **Fork the repository** and create your branch from `main`
2. **Install dependencies**: `pnpm install`
3. **Make your changes**
   - Follow the existing code style
   - Add tests if applicable
   - Update documentation as needed
4. **Run linting**: `pnpm lint`
5. **Test your changes**: `pnpm build && pnpm start`
6. **Commit your changes** with a clear commit message
7. **Push to your fork** and submit a pull request

## Development Setup

```bash
# Clone your fork
git clone https://github.com/your-username/typescript-cli-template.git
cd typescript-cli-template

# Install dependencies
pnpm install

# Run in development mode
pnpm dev

# Run with watch mode
pnpm dev:watch

# Build
pnpm build

# Lint
pnpm lint

# Format
pnpm format
```

## Code Style

- Use TypeScript for type safety
- Follow Biome's linting rules
- Use tabs for indentation
- Use double quotes for strings
- Add JSDoc comments for public APIs
- Keep functions small and focused

## Commit Messages

- Use clear and meaningful commit messages
- Start with a verb in present tense (Add, Fix, Update, etc.)
- Keep the first line under 72 characters
- Reference issues when applicable (#123)

Examples:
```
Add user authentication feature
Fix config deletion bug (#42)
Update documentation for API commands
```

## Testing

Before submitting a PR:

1. Test your changes locally
2. Ensure all commands work as expected
3. Check that the build succeeds
4. Run the linter and fix any issues

## Questions?

Feel free to open an issue for any questions or clarifications!

Thank you for contributing! 🚀
