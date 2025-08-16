# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [3.1.0] - 2025-08-16

### Added
- Added `endIndex` support for better error reporting (#74)
- Added Stylelint v16 minimum version requirement documentation

### Changed
- Updated to ESLint v9 (#75)
- Updated all dependencies to latest versions (#73)
- Fixed test column expectations for Stylelint v16 position reporting changes
- Fixed deprecation warnings in `report()` function

### Fixed
- Prevented .coverage folder from being included in npm package (#72)

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