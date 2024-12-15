/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
export const preset = 'ts-jest';
export const testEnvironment = 'node';
export const globalTeardown = './src/__tests__/test-teardown-globals.js';
export const verbose = true;
//export const automock: true;
export const testMatch = ['**/*.test.ts'];
export const setupFiles = ['dotenv/config'] // required for Jest to find env vars
