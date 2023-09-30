/** @type {(overrideConfig: import('jest').Config) => Promise<import('jest').Config>} */
const createConfig = require('@shio/jest/jest.nextjs.cjs');

module.exports = createConfig({
  moduleNameMapper: {
    '^#website-v2/(.*)$': '<rootDir>/src/$1',
    '^#core/(.*)$': '<rootDir>/../../packages/core/$1',
  },
});
