export default {
  preset: 'ts-jest',
  testEnvironment: 'node',
  globalTeardown: './src/__tests__/test-teardown-globals.js',
  verbose: true,
  automock: true,
  testMatch: ['**/*.test.ts'],
  setupFiles: ['dotenv/config'], // required for Jest to find env vars
  transform: {
    "^.+\\.(ts|tsx|js|jsx|mjs)$": [
      "ts-jest",
      {
        // Note: We shouldn't need to include `isolatedModules` here because it's a deprecated config option in TS 5,
        // but setting it to `true` fixes the `ESM syntax is not allowed in a CommonJS module when
        // 'verbatimModuleSyntax' is enabled` error that we're seeing when running our Jest tests.
        isolatedModules: true,
        useESM: true,
      },
    ],
  },
  transformIgnorePatterns: [
    '<rootDir>/node_modules/(?!(@bad-words)/)',
    // -   '/node_modules/(?!(ag-grid-react|ag-grid-enterprise|ag-grid-community)/)',
    // eslint-disable-next-line @stylistic/max-len
    // +   '/node_modules/(?!(@ag-grid-community|@ag-grid-enterprise|ag-grid-react|ag-grid-enterprise|ag-grid-community)/)',
  ],
  moduleNameMapper: {
    // eslint-disable-next-line @stylistic/max-len
    // Force module uuid to resolve with the CJS entry point, because Jest does not support package.json.exports. See https://github.com/uuidjs/uuid/issues/451
    "bad-words": import.meta.resolve('bad-words'),
  }
};