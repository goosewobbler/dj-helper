module.exports = {
  transform: {
    '.(ts|tsx)': 'ts-jest',
  },
  collectCoverageFrom: ['src/**/*'],
  coverageThreshold: {
    global: {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100,
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
