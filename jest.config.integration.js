/** @type {import('jest').Config} */
const config = {
  preset: 'jest-preset-stylelint',
  setupFiles: ['<rootDir>/test/integration/setup.js'],
  runner: 'jest-light-runner',
  clearMocks: true,
  collectCoverage: false,
  testEnvironment: 'node',
  testMatch: ['**/test/integration/**/*.test.js'],
  transform: {},
};

export default config;
