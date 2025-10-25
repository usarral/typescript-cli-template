# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).


## 1.1.0 (2025-10-25)

* chore: add module type to package.json ([396b195](https://github.com/usarral/typescript-cli-template/commit/396b195))
* feat: initial release with complete CLI template ([eefa3d0](https://github.com/usarral/typescript-cli-template/commit/eefa3d0))
* build: add sonar analysis ([0f35974](https://github.com/usarral/typescript-cli-template/commit/0f35974))

## [Unreleased]

### Added
- **Commitlint**: Conventional commits validation with husky hooks
- **Release-it**: Automated versioning and changelog generation
- **Lint-staged**: Pre-commit linting for staged files
- **Testing Infrastructure**: Complete Vitest setup with coverage reporting
- **Timeout Utilities**: `withTimeout()`, `retry()`, and `delay()` for robust async operations
- **Zod Validation**: Runtime schema validation for configurations
- **File Logging**: Optional file output for logger with configurable path
- **Signal Handling**: Graceful shutdown on SIGINT/SIGTERM and error handling
- **JSDoc Documentation**: Comprehensive documentation for all utilities and interfaces
- **Test Suites**: 15 tests covering version, timeout, and configManager
- **Utility Documentation**: New `docs/UTILITIES.md` with complete API reference
- **Examples**: New examples for retry/timeout and Zod validation
- Enhanced logger with configurable options (timestamps, colors, file output)
- Global `--verbose` flag for debug logging
- Global `--no-color` flag to disable colored output
- Comprehensive README with usage examples
- Example files for custom commands, API integration, and config extension
- TypeScript strict mode and improved type safety
- Source maps and declaration files
- Error handling in version.ts
- VSCode settings and recommended extensions
- Contributing guidelines
- LICENSE file
- .gitignore with comprehensive patterns
- TypeScript CLI template with Commander.js
- Configuration management system (CRUD operations)
- Chalk-based logging system with multiple log levels
- Inquirer.js integration for interactive prompts
- Biome for linting and formatting
- pnpm package manager support

### Changed
- **Logger Enhancement**: Verified Logger internally uses `console.log/info/warn/error` with Chalk colors
- **All Config Commands**: Consistent usage of Logger throughout the codebase
- **Error Handling**: Consistent error typing throughout the codebase
- **ConfigManager**: Now uses Zod schemas for validation
- **AppConfig Type**: Changed from interface to Zod-inferred type
- **package.json**: Added new scripts (test, test:ui, test:coverage, clean, type-check, watch, release)
- Improved tsconfig.json with bundler module resolution
- Updated package.json scripts with dev:watch, lint:fix, format
- Replaced problematic prepare/postinstall hooks with prepublishOnly
- Enhanced logger to support JSON formatting for objects

### Fixed
- Fixed import type in config/index.ts
- Fixed version.ts error handling with proper error typing
- Fixed irregular whitespace in test files
- Auto-organized imports in all files

### Dependencies
- Added `vitest` - Fast unit testing framework
- Added `@vitest/coverage-v8` - Coverage reporting for Vitest
- Added `zod` - Runtime schema validation
- Added `@commitlint/cli` - Commit message linting
- Added `@commitlint/config-conventional` - Conventional commits config
- Added `husky` - Git hooks manager
- Added `lint-staged` - Run linters on staged files
- Added `release-it` - Automated versioning and publishing
- Added `@release-it/conventional-changelog` - Changelog generator

## [1.0.0] - 2025-10-26

### Added
- Initial release

[Unreleased]: https://github.com/usarral/typescript-cli-template/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/usarral/typescript-cli-template/releases/tag/v1.0.0
