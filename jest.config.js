/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  globalTeardown: './src/__tests__/test-teardown-globals.js',
  verbose: true,
  // automock: true,
  testMatch: ['**/*.test.ts'],
  setupFiles: ['dotenv/config'] // required for Jest to find env vars
};
