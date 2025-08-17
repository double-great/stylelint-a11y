/** @type {import('jest').Config} */
const config = {
  preset: 'jest-preset-stylelint',
  setupFiles: ['<rootDir>/jest.setup.js'],
  runner: 'jest-light-runner',
  clearMocks: true,
  collectCoverage: false,
  collectCoverageFrom: ['src/**/*.js'],
  coverageDirectory: './.coverage/',
  coverageReporters: ['lcov', 'text'],
  coverageThreshold: {
    global: {
      branches: 75,
      functions: 75,
      line: 75,
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
