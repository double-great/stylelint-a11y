# @double-great/stylelint-a11y

[![npm version](https://img.shields.io/npm/v/@double-great/stylelint-a11y.svg)](https://www.npmjs.com/package/@double-great/stylelint-a11y)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Stylelint plugin for CSS accessibility rules.

## Installation and usage

This plugin requires Stylelint 16.7.0 or higher.

```bash
npm i --save-dev stylelint @double-great/stylelint-a11y
```

Create the `.stylelintrc.json` config file (or open the existing one), add `stylelint-a11y` to the plugins array and the rules you need to the rules list. All rules from stylelint-a11y need to be namespaced with `a11y`.

Please refer to [stylelint docs](https://stylelint.io/user-guide/get-started/) for the detailed info on using this linter.

## Basic Configuration

Here's a basic `.stylelintrc.json` configuration:

```json
{
  "plugins": ["@double-great/stylelint-a11y"],
  "rules": {
    "a11y/no-outline-none": true,
    "a11y/font-size-is-readable": true,
    "a11y/media-prefers-reduced-motion": true,
    "a11y/selector-pseudo-class-focus": true
  }
}
```

Or extend one of the provided configs:

```json
{
  "extends": ["@double-great/stylelint-a11y/recommended"],
  "rules": {
    // Add any additional rules or overrides here
  }
}
```

For stricter accessibility checks:

```json
{
  "extends": ["@double-great/stylelint-a11y/strict"],
  "rules": {
    // Override any rules if needed
  }
}
```

## Rules

| Rule ID                                                                                    | Description                                                                |                      |
| :----------------------------------------------------------------------------------------- | :------------------------------------------------------------------------- | -------------------- |
| [content-property-no-static-value](./src/rules/content-property-no-static-value/README.md) | Disallow static text in the `content` property                             |                      |
| [font-size-is-readable](./src/rules/font-size-is-readable/README.md)                       | Disallow font sizes smaller than 15px                                      |                      |
| [line-height-is-vertical-rhythmed](./src/rules/line-height-is-vertical-rhythmed/README.md) | Require line heights that fit a baseline grid                              |                      |
| [media-prefers-color-scheme](./src/rules/media-prefers-color-scheme/README.md)             | Require a `prefers-color-scheme` override for colors                       |                      |
| [media-prefers-reduced-motion](./src/rules/media-prefers-reduced-motion/README.md)         | Require a `prefers-reduced-motion` override for transitions and animations | Recommended, Fixable |
| [no-display-none](./src/rules/no-display-none/README.md)                                   | Disallow hiding content with `display: none`                               |                      |
| [no-obsolete-attribute](./src/rules/no-obsolete-attribute/README.md)                       | Disallow selectors that target obsolete HTML attributes                    |                      |
| [no-obsolete-element](./src/rules/no-obsolete-element/README.md)                           | Disallow selectors that target obsolete HTML elements                      |                      |
| [no-outline-none](./src/rules/no-outline-none/README.md)                                   | Disallow removing the focus outline without an alternative                 | Recommended          |
| [no-spread-text](./src/rules/no-spread-text/README.md)                                     | Require text `max-width` between 45ch and 80ch                             |                      |
| [no-text-align-justify](./src/rules/no-text-align-justify/README.md)                       | Disallow `text-align: justify`                                             |                      |
| [selector-pseudo-class-focus](./src/rules/selector-pseudo-class-focus/README.md)           | Require a `:focus` or `:focus-visible` companion for `:hover` selectors    | Recommended, Fixable |

## Configurations

### Recommended config

Add recommended configuration by adding the following to `extends` in your stylelint configuration:

```
@double-great/stylelint-a11y/recommended
```

This shareable config contains the following:

```json
{
  "plugins": ["@double-great/stylelint-a11y"],
  "rules": {
    "a11y/media-prefers-reduced-motion": true,
    "a11y/no-outline-none": true,
    "a11y/selector-pseudo-class-focus": true
  }
}
```

### Strict config

For a more comprehensive accessibility check, use the strict configuration:

```
@double-great/stylelint-a11y/strict
```

This config enables ALL accessibility rules:

```json
{
  "plugins": ["@double-great/stylelint-a11y"],
  "rules": {
    "a11y/content-property-no-static-value": true,
    "a11y/font-size-is-readable": true,
    "a11y/line-height-is-vertical-rhythmed": true,
    "a11y/media-prefers-color-scheme": true,
    "a11y/media-prefers-reduced-motion": true,
    "a11y/no-display-none": true,
    "a11y/no-obsolete-attribute": true,
    "a11y/no-obsolete-element": true,
    "a11y/no-outline-none": true,
    "a11y/no-spread-text": true,
    "a11y/no-text-align-justify": true,
    "a11y/selector-pseudo-class-focus": true
  }
}
```

Since both configs add stylelint-a11y to `plugins`, you don't have to do this yourself when extending these configs.

## Rule Configuration

### Severity Levels

Every rule reports an error by default. To report a warning instead, set `severity` in the rule's secondary options object:

```json
{
  "rules": {
    "a11y/no-outline-none": true,
    "a11y/font-size-is-readable": [true, { "severity": "warning" }],
    "a11y/media-prefers-reduced-motion": [true, { "severity": "warning" }]
  }
}
```

Rule options and `severity` share the same object:

```json
{
  "rules": {
    "a11y/font-size-is-readable": [true, { "thresholdInPixels": 14, "severity": "warning" }]
  }
}
```

To report every rule as a warning, set `defaultSeverity` at the top level of the configuration:

```json
{
  "defaultSeverity": "warning",
  "extends": ["@double-great/stylelint-a11y/recommended"]
}
```

- **"error"** - The rule will report an error (exit code 2 when running stylelint)
- **"warning"** - The rule will report a warning (exit code 0 unless there are errors)

### Rule Options

Many rules support additional configuration options for customization. For example:

```json
{
  "rules": {
    "a11y/font-size-is-readable": [true, { "thresholdInPixels": 16 }],
    "a11y/no-spread-text": [true, { "minWidth": 30, "maxWidth": 60 }],
    "a11y/line-height-is-vertical-rhythmed": [true, { "baselineGrid": 20 }]
  }
}
```

Refer to individual rule documentation for available options. Unknown option names and values of the wrong type are reported as configuration errors.

### Related Core Rules

Some accessibility checks are already covered by stylelint's built-in rules. For example, to require relative units for font sizes, use [`declaration-property-unit-disallowed-list`](https://stylelint.io/user-guide/rules/declaration-property-unit-disallowed-list/):

```json
{
  "rules": {
    "declaration-property-unit-disallowed-list": { "font-size": ["px", "pt"] }
  }
}
```

## Disabling Rules

You can disable rules inline using stylelint's comment syntax:

```css
/* stylelint-disable a11y/no-outline-none */
.button:focus {
  outline: none;
}
/* stylelint-enable a11y/no-outline-none */
```

Or for a single line:

```css
.button:focus {
  outline: none; /* stylelint-disable-line a11y/no-outline-none */
}
```

## Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for detailed information on:

- How to add new rules
- Code style guidelines
- Testing requirements
- Pull request process

For quick links:

- [Issue reporting](https://github.com/double-great/stylelint-a11y/issues)
- [Pull requests](https://github.com/double-great/stylelint-a11y/pulls)
- [Changelog](https://github.com/double-great/stylelint-a11y/blob/main/CHANGELOG.md)

## Development

### Testing

Run tests with the following commands:

- `npm run test` - Run unit tests for all rules
- `npm run test:unit` - Run unit tests only
- `npm run test:integration` - Run integration tests
- `npm run test:e2e` - Run end-to-end tests with real projects
- `npm run test:performance` - Run performance benchmarks
- `npm run test:all` - Run complete test suite

### Testing Infrastructure

This project includes testing at a few levels:

- [Unit tests](./src/rules) - Individual rule functionality
- [Integration tests](./test/integration) - Plugin integration with stylelint
- [E2E tests](./test/e2e) - Real-world project testing with intentional violations
- [Performance tests](./test/e2e/performance.test.js) - Benchmark testing for large codebases

### Other Commands

- `npm run lint` - Run ESLint
- `npm run format:check` - Check code formatting
- `npm run format:fix` - Fix code formatting
- `npm run coverage` - Run tests with coverage report

## License

This project is licensed under the [MIT License](LICENSE).
