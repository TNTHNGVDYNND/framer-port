/** @type {import('jest').Config} */
const config = {
  testEnvironment: 'node',
  testTimeout: 60000,
  transform: {},
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
  testMatch: ['**/__tests__/**/*.test.js'],
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/**/*.test.js',
    '!src/**/__tests__/**',
    '!src/config/**',
  ],
  coverageThreshold: {
    global: {
      branches: 75,
      functions: 75,
      lines: 75,
      statements: 75,
    },
  },
  coverageReporters: ['text', 'text-summary', 'lcov'],
  verbose: true,
  setupFilesAfterEnv: ['./jest.setup.js'],
};

export default config;
