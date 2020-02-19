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
  testPathIgnorePatterns: ['.node_modules_production'],
  modulePathIgnorePatterns: ['.node_modules_production'],
  testMatch: ['**/test/**/*.spec.(ts|tsx)'],
  setupFiles: ['./test/setup.ts'],
  testURL: 'https://bbc.co.uk/',
};
