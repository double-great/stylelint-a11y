# Contributing to stylelint-a11y

Thank you for your interest in contributing to stylelint-a11y! This guide will help you get started with contributing to the project.

## Getting Started

1. Fork the repository
2. Clone your fork locally
3. Install dependencies with `npm install`
4. Create a new branch for your feature or fix
5. Make your changes
6. Run tests with `npm test`
7. Submit a pull request

## Adding a New Rule

When adding a new accessibility rule to this plugin, please follow this checklist:

### Rule Implementation Checklist

- [ ] **Create rule directory structure**
  - [ ] Create new directory under `src/rules/[rule-name]/`
  - [ ] Rule name should be kebab-case and descriptive

- [ ] **Implement the rule** (`src/rules/[rule-name]/index.js`)
  - [ ] Export a function that follows stylelint's rule API
  - [ ] Include proper rule metadata (ruleName, messages)
  - [ ] Implement the rule logic
  - [ ] Use stylelint's built-in utilities where appropriate
  - [ ] Handle edge cases and nested selectors

- [ ] **Write comprehensive tests** (`src/rules/[rule-name]/__tests__/index.js`)
  - [ ] Test valid cases (code that should pass)
  - [ ] Test invalid cases (code that should fail)
  - [ ] Test edge cases and complex selectors
  - [ ] Test with SCSS syntax if applicable
  - [ ] Test auto-fix functionality if the rule is fixable
  - [ ] Ensure good test coverage

- [ ] **Create rule documentation** (`src/rules/[rule-name]/README.md`)
  - [ ] Provide clear description of what the rule does
  - [ ] Explain why this accessibility rule is important
  - [ ] Include links to WCAG guidelines or other authoritative sources
  - [ ] Show examples of violations
  - [ ] Show examples of valid code
  - [ ] Document any options the rule accepts
  - [ ] Note if the rule is auto-fixable

- [ ] **Register the rule**
  - [ ] Add the rule to `src/rules/index.js`
  - [ ] Export it from the main rules index

- [ ] **Update plugin configuration**
  - [ ] Add the rule to `src/index.js` in the rules export
  - [ ] Consider if it should be in `recommended.js` config

- [ ] **Update main README**
  - [ ] Add the rule to the rules table in `README.md`
  - [ ] Include description and any badges (Recommended, Fixable)
  - [ ] Keep alphabetical order

- [ ] **Test the rule thoroughly**
  - [ ] Run unit tests: `npm run test:unit`
  - [ ] Run integration tests: `npm run test:integration`
  - [ ] Run all tests: `npm test`
  - [ ] Ensure no performance regressions: `npm run test:performance`

- [ ] **Code quality checks**
  - [ ] Run linting: `npm run lint`
  - [ ] Check formatting: `npm run format:check`
  - [ ] Fix formatting if needed: `npm run format:fix`

- [ ] **Manual testing**
  - [ ] Test the rule in a real project
  - [ ] Verify error messages are clear and helpful
  - [ ] Check that line numbers are accurate
  - [ ] Test with different stylelint configurations

### Example Rule Structure

Here's what a typical rule implementation looks like:

```javascript
// src/rules/my-new-rule/index.js
import stylelint from 'stylelint';

const ruleName = 'a11y/my-new-rule';
const messages = stylelint.utils.ruleMessages(ruleName, {
  expected: 'Expected ...',
});

const meta = {
  url: 'https://github.com/double-great/stylelint-a11y/tree/main/src/rules/my-new-rule',
};

const ruleFunction = (primaryOption, secondaryOptions) => {
  return (root, result) => {
    // Rule implementation
  };
};

ruleFunction.ruleName = ruleName;
ruleFunction.messages = messages;
ruleFunction.meta = meta;

export default ruleFunction;
```

## Code Style

- Use ES6+ features
- Follow the existing code style (enforced by ESLint and Prettier)
- Write clear, self-documenting code
- Add JSDoc comments for complex functions

## Testing

We maintain high test coverage. Please ensure your changes include appropriate tests:

- Unit tests for individual rules
- Integration tests for plugin functionality
- E2E tests for real-world scenarios
- Performance tests for efficiency

Run the test suite with:

```bash
npm test           # Run all tests
npm run test:unit  # Run unit tests only
npm run coverage   # Run tests with coverage report
```

## Commit Messages

- Use clear, descriptive commit messages
- Follow conventional commit format when possible
- Reference issue numbers when applicable

## Pull Request Process

1. Ensure all tests pass
2. Update documentation as needed
3. Add a description of your changes
4. Link any related issues
5. Wait for code review
6. Address any feedback

## Reporting Issues

When reporting issues, please include:

- Stylelint version
- Plugin version
- Node.js version
- Minimal reproduction case
- Expected vs actual behavior

## Questions?

Feel free to open an issue for any questions about contributing.

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
