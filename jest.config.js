module.exports = {
  transform: {
    '.(ts|tsx)': '<rootDir>/node_modules/ts-jest/preprocessor.js'
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
  testURL: 'https://bbc.co.uk/',
};
