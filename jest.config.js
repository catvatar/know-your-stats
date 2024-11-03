module.exports = {
  testEnvironment: 'node', // Use 'node' for server-side tests
  moduleFileExtensions: ['js', 'ts'],
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest',
  },
  testMatch: ['<rootDir>/server/**/*.test.(js|ts)'], // Only match tests in the server directory
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
};