# E2E Test Information

## About E2E Test "Failures"

The E2E tests in this directory are designed to test stylelint-a11y against real CSS files that **intentionally contain rule violations**.

### Expected Behavior

- Tests **expect** stylelint to exit with error codes when violations are found
- The tests catch these "failures" and parse the JSON output to verify:
  - Correct number of violations detected
  - Specific rules are triggered
  - Line numbers and error messages are accurate

### Test Output

The console output may show:

- JSON arrays of violations (this is expected)
- Some error messages during test runs (also expected)
- Performance metrics from the performance tests

### In CI/GitHub Actions

These tests will pass in CI because:

- Jest catches the expected exceptions
- Tests verify the violations are correctly detected
- The test suite itself passes even though stylelint "fails" on the test CSS

## Test Projects

- `basic-css/`: Tests core CSS functionality
- `scss-project/`: Tests SCSS/Sass compatibility
- `large-codebase/`: Tests performance with larger files

All test projects contain intentional accessibility violations for testing purposes.
