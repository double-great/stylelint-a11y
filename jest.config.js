/** @type {import('jest').Config} */
const config = {
  preset: 'jest-preset-stylelint',
  setupFiles: ['<rootDir>/jest.setup.js'],
  runner: 'jest-light-runner',
  clearMocks: true,
  collectCoverage: false,
  // Barrel and data files hold only top-level code, which V8 attributes to setup rather than to a test
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/index.js',
    '!src/rules/index.js',
    '!src/rules/*/obsolete*.js',
  ],
  // The coverage script swaps in Jest's default runner because jest-light-runner cannot instrument code without Babel
  coverageProvider: 'v8',
  coverageDirectory: './.coverage/',
  coverageReporters: ['lcov', 'text'],
  coverageThreshold: {
    global: {
      branches: 75,
      functions: 75,
      lines: 75,
      statements: 75,
    },
  },
  testEnvironment: 'node',
  roots: ['src', 'test'],
  testRegex: '.*\\.test\\.js$|src/.*/__tests__/.*\\.js$|test/.*/.*\\.test\\.js$',
  transform: {},
  // Run tests sequentially to avoid race conditions
  maxWorkers: 1,
  // Reduce timeouts for faster feedback
  testTimeout: 10000,
};

export default config;
