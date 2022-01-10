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
  testEnvironment: 'jest-environment-jsdom',
  testPathIgnorePatterns: ['.node_modules_production'],
  modulePathIgnorePatterns: ['.node_modules_production'],
  testMatch: ['**/test/features/**/*.spec.(ts|tsx)'],
  setupFilesAfterEnv: ['<rootDir>/test/setup.ts'],
  testURL: 'https://github.com/goosewobbler/',
  globals: {
    'ts-jest': {
      packageJson: './package.json',
    },
  },
};
