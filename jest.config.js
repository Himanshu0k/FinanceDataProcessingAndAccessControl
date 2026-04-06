module.exports = {
  testEnvironment: 'node',
  coveragePathIgnorePatterns: ['/node_modules/'],
  testTimeout: 30000,
  verbose: true,
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/**/*.test.js',
    '!src/config/**'
  ],
  maxWorkers: 1, // Run tests sequentially
  globalSetup: './tests/global.setup.js',
  globalTeardown: './tests/global.teardown.js'
};