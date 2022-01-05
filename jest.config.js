module.exports = {
  transform: {
    '.(ts|tsx)': 'ts-jest',
  },
  collectCoverageFrom: ['src/**/*'],
  coverageThreshold: {
    global: {
      branches: 10,
      functions: 10,
      lines: 10,
      statements: 10,
    },
  },
  clearMocks: true,
  testPathIgnorePatterns: ['.node_modules_production', 'e2e'],
  modulePathIgnorePatterns: ['.node_modules_production'],
  testMatch: ['**/test/**/*.spec.(ts|tsx)'],
  setupFilesAfterEnv: ['./test/setup.ts'],
  testURL: 'https://github.com/goosewobbler/',
  testEnvironment: 'jsdom',
  globals: {
    'ts-jest': {
      packageJson: './package.json',
    },
  },
};
