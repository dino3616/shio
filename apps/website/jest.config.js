/** @type {import('jest').Config} */
module.exports = require('@shio/jest/jest.nextjs')({
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
});
