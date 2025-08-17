# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Strict configuration (`@double-great/stylelint-a11y/strict`) that enables all accessibility rules
- CONTRIBUTING.md with comprehensive guide for adding new rules
- Severity levels documentation showing how to configure rules as errors or warnings
- Basic configuration examples in README
- Inline rule disabling documentation
- Badges for npm version and MIT license
- Links to test directories in Testing Infrastructure section
- Test coverage for strict configuration

### Changed

- Enhanced README with better organization and more comprehensive documentation
- Updated Testing Infrastructure section with links instead of bold text

### Fixed

- Corrected `plugin` to `plugins` in recommended.js configuration

## [3.3.0] - 2025-08-17

### Added

- Advanced testing infrastructure with comprehensive CI/CD workflows
- System-level performance regression testing suite
- Cross-platform compatibility testing for Node.js environments
- Integration tests for real-world stylelint plugin functionality
- Enhanced rule configuration options with customizable parameters
- Meta objects for all rules with documentation URLs and fixable status
- Comprehensive rule documentation with examples and configuration options

### Changed

- Enhanced stylelint standards compliance with proper meta objects across all rules
- Standardized rule message formatting for consistent error reporting
- Improved Jest configuration with proper Node.js module support
- Updated all rule implementations to follow modern stylelint plugin patterns
- Enhanced rule functionality with configurable options for better customization
- Improved error messages for better developer experience

### Fixed

- Removed deprecated experimental VM modules flag from Jest scripts for Node.js compatibility
- Resolved CI performance test expectations for consistent build environments
- Cleaned up test infrastructure and removed redundant configuration files
- Fixed rule message clarity and consistency across all accessibility rules

## [3.2.0] - 2025-08-16

### Added

- Comprehensive E2E testing infrastructure with real-world projects
- Integration testing suite for plugin functionality
- Performance benchmarking with regression detection
- Test helper utilities for simplified testing
- Support for SCSS/Sass project testing
- Large codebase performance testing
- CLI integration tests with full stylelint compatibility
- Development documentation in README
- Pull request template for consistent PR descriptions

### Changed

- Standardized import patterns across all rules for better consistency
- Fixed rule order in exports object to maintain alphabetical sorting
- Improved Jest configuration for multiple test types
- Enhanced ESLint configuration for E2E tests
- Updated actions/checkout from v4 to v5 (#77)

### Fixed

- Fixed `media-prefers-reduced-motion` rule incorrectly adding duplicate media queries when `prefers-reduced-motion` is already nested inside another media query (#66)

### Developer Experience

- Added npm scripts for granular test execution (`test:unit`, `test:integration`, `test:e2e`, `test:all`)
- Simplified test utilities for faster development
- Cross-platform compatibility testing
- Performance metrics and scaling tests
- Individual rule benchmarks included

## [3.1.0] - 2025-08-16

### Added

- Added `endIndex` support for better error reporting (#74)
- Added Stylelint v16 minimum version requirement documentation
- Added explicit lint step to GitHub Actions test workflow
- Added push trigger for main branch to test workflow
- Added scheduled runs for dependency management workflow (twice monthly)
- Added concurrency controls and timeout to test workflow

### Changed

- Updated to ESLint v9 (#75)
- Updated all dependencies to latest versions (#73)
- Fixed test column expectations for Stylelint v16 position reporting changes
- Fixed deprecation warnings in `report()` function
- Changed test workflow schedule from Thursday to Sunday at midnight
- Improved dependabot grouping configuration
- Renamed test job for better clarity

### Fixed

- Prevented .coverage folder from being included in npm package (#72)
- Fixed misleading step name in dependency management workflow

## [3.0.4] - 2024

### Fixed

- Fixed recommended export (#71)

## [3.0.3] - 2024

### Fixed

- Fixed import of `isStandardSyntaxRule` from correct module (#69)

## [3.0.2] - 2024

### Fixed

- Removed `menu` from list of obsolete elements (#64)

### Changed

- Removed husky and babel; cleaned up dependencies (#63)
- Updated dependencies (#62)

## [3.0.1] - 2024

### Fixed

- Fixed package configuration (#61)
