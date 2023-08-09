/** @type {import('eslint').Linter.Config} */
module.exports = {
  extends: ['shio-nextjs'],
  rules: {
    'no-restricted-imports': [
      'error',
      {
        patterns: ['../'],
      },
    ],
  },
  settings: {
    tailwindcss: {
      callees: ['cn'],
    },
  },
};
