/** @type {import('eslint').Linter.Config} */
module.exports = {
  extends: ['shio-esm'],
  rules: {
    'no-restricted-imports': [
      'error',
      {
        patterns: ['../'],
      },
    ],
  },
};
