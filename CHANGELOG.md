# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [3.7.1] - 2026-10-10

- Update and remove dependencies

## [3.7.0] - 2026-10-10

### Added

- `selector-pseudo-class-focus` finds the focus companion anywhere in the stylesheet, so a hover rule inside `@media (hover: hover)` with its focus rule at the root is no longer reported
- `media-prefers-color-scheme` accepts a nested `prefers-color-scheme` query and skips colors set through `var()`
- `content-property-no-static-value` accepts `none`, `normal`, and values that end with a slash and alternative text
- `no-display-none` skips rules inside a media query that starts with `print`
- `no-obsolete-element` and `no-obsolete-attribute` ignore selectors inside `:not()`

### Changed

- `selector-pseudo-class-focus` collects the stylesheet selectors once per run instead of once per hover rule

### Fixed

- Every rule checks a bare `@page` block, and four rules check `@page` at all, where the branch was previously unreachable
- `selector-pseudo-class-focus` requires a companion for every selector in a `:hover` list, treats `:hover` as case-insensitive, and ignores a `:hover` inside `:not()`
- `no-outline-none` no longer accepts `box-shadow: none`, `border: 0`, or `border: none` as a visible alternative, and treats a transparent `outline` shorthand as removal
- `media-prefers-reduced-motion` no longer accepts an override inside a `prefers-reduced-motion: no-preference` query and compares `none` case-insensitively
- `media-prefers-color-scheme` matches the override selector regardless of whitespace
- `content-property-no-static-value` treats pseudo-element names as case-insensitive
- `thresholdInPixels`, `baselineGrid`, and `minRelativeLineHeight` must be positive numbers

## [3.6.0] - 2026-10-10

### Added

- `no-outline-none` reports `outline-style: none`, `outline-width: 0`, and a transparent `outline-color`, not only the `outline` shorthand
- `no-obsolete-element` and `no-obsolete-attribute` match obsolete selectors inside compound and descendant selectors
- `selector-pseudo-class-focus` accepts `:focus-visible` as the companion to `:hover`
- Secondary options are validated; unknown option names and values of the wrong type are reported as configuration errors
- `postcss-selector-parser` dependency
- README note pointing to stylelint's `declaration-property-unit-disallowed-list` for requiring relative font-size units

### Fixed

- `media-prefers-reduced-motion` and `media-prefers-color-scheme` require a media query override for every matched property instead of only the first one
- `media-prefers-reduced-motion` and `media-prefers-color-scheme` treat the `@page` at-rule name as case-insensitive
- `line-height-is-vertical-rhythmed` keeps decimal pixel values when checking the baseline grid
- Secondary options explicitly set to `0` are honored instead of falling back to the default
- README severity examples use stylelint's `severity` secondary option; the example of an unimplemented `ignore` option is removed
- Tests use the `thresholdInPixels` option name, and Jest enforces the `lines` coverage threshold
- `npm run coverage` reports real numbers; it ran under `jest-light-runner`, which collects no coverage without Babel, so it now uses Jest's default runner with the V8 provider

### Removed

- The `coverage:all` npm script, which duplicated `coverage`

## [3.5.5] - 2026-10-09

### Changed

- Updated indirect dependencies in the lockfile

## [3.5.4] - 2026-09-13

### Changed

- Updated indirect dependency js-yaml

## [3.5.3] - 2026-09-05

### Changed

- Updated NPM dependencies: eslint to 10.10, eslint-plugin-jest to 29.16.6, globals to 17.12, jest to 30.5, postcss to 8.5.28, and stylelint to 17.15

## [3.5.2] - 2026-08-18

### Changed

- Updated NPM dependencies: eslint to 10.8.1, eslint-plugin-jest to 29.16.1, globals to 17.11, and postcss to 8.5.26

## [3.5.1] - 2026-08-02

### Changed

- Updated NPM dependencies: eslint to 10.8, eslint-plugin-jest to 29.16, globals to 17.9, postcss to 8.5.25, prettier to 3.9.6, and stylelint to 17.14.1
- Updated GitHub Actions, including actions/checkout to 7

## [3.5.0] - 2026-06-29

### Changed

- Raised the supported Node.js version to 22 or later, and the CI matrix now tests Node 20, 22, and 24
- Updated NPM dependencies: eslint to 10.6, jest-light-runner to 0.8, postcss to 8.5.16, prettier to 3.9.3, and stylelint to 17.14

Releases 3.4.2 through 3.4.15 contained dependency updates and two fixes to the stylelint documentation links in the README.

## [3.4.1] - 2025-11-19

### Changed

- Updated NPM dependencies:
  - @eslint/js from 9.33.0 to 9.39.1
  - eslint from 9.33.0 to 9.39.1
  - jest from 30.0.5 to 30.2.0
  - prettier from 3.x to 3.6.2
  - stylelint from 16.x to 16.25.0
  - Updated indirect dependencies (js-yaml, glob)
- Updated GitHub Actions workflows:
  - actions/checkout from 4 to 5
  - actions/setup-node from 4 to 6
  - actions/upload-artifact from 4 to 5
  - actions/download-artifact from 4 to 6
- Adjusted GitHub Action workflow schedule and formatting

## [3.4.0] - 2025-08-17

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
