# @double-great/stylelint-a11y

## Installation and usage

This plugin requires Stylelint 16.0.0 or higher.

```bash
npm i --save-dev stylelint @double-great/stylelint-a11y
```

Create the `.stylelintrc.json` config file (or open the existing one), add `stylelint-a11y` to the plugins array and the rules you need to the rules list. All rules from stylelint-a11y need to be namespaced with `a11y`.

Please refer to [stylelint docs](https://stylelint.io/user-guide/) for the detailed info on using this linter.

## Rules

| Rule ID                                                                                    | Description                                                             |                      |
| :----------------------------------------------------------------------------------------- | :---------------------------------------------------------------------- | -------------------- |
| [content-property-no-static-value](./src/rules/content-property-no-static-value/README.md) | Disallow unaccessible CSS generated content in pseudo-elements          |                      |
| [font-size-is-readable](./src/rules/font-size-is-readable/README.md)                       | Disallow font sizes less than `15px`                                    |                      |
| [line-height-is-vertical-rhythmed](./src/rules/line-height-is-vertical-rhythmed/README.md) | Disallow not vertical rhythmed `line-height`                            |                      |
| [media-prefers-reduced-motion](./src/rules/media-prefers-reduced-motion/README.md)         | Require certain styles if the animation or transition in media features | Recommended, Fixable |
| [media-prefers-color-scheme](./src/rules/media-prefers-color-scheme/README.md)             | Require implementation of certain styles for selectors with colors.     |                      |
| [no-display-none](./src/rules/no-display-none/README.md)                                   | Disallow content hiding with `display: none` property                   |                      |
| [no-obsolete-attribute](./src/rules/no-obsolete-attribute/README.md)                       | Disallow obsolete attribute using                                       |                      |
| [no-obsolete-element](./src/rules/no-obsolete-element/README.md)                           | Disallow obsolete selectors using                                       |                      |
| [no-spread-text](./src/rules/no-spread-text/README.md)                                     | Require width of text in a comfortable range                            |                      |
| [no-outline-none](./src/rules/no-outline-none/README.md)                                   | Disallow outline clearing                                               | Recommended          |
| [no-text-align-justify](./src/rules/no-text-align-justify/README.md)                       | Disallow content with `text-align: justify`                             |                      |
| [selector-pseudo-class-focus](./src/rules/selector-pseudo-class-focus/README.md)           | Require or disallow a pseudo-element to the selectors with `:hover`     | Recommended, Fixable |

## Recommended config

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

Since it adds stylelint-a11y to `plugins`, you don't have to do this yourself when extending this config.

## Rule Configuration

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

Refer to individual rule documentation for available options.

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

- **Unit tests** - Individual rule functionality
- **Integration tests** - Plugin integration with stylelint
- **E2E tests** - Real-world project testing with intentional violations
- **Performance tests** - Benchmark testing for large codebases

### Other Commands

- `npm run lint` - Run ESLint
- `npm run format:check` - Check code formatting
- `npm run format:fix` - Fix code formatting
- `npm run coverage` - Run tests with coverage report
