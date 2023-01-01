module.exports = {
  '**/*.{js,ts,tsx,json}': (/** @type {string[]} */ filenames) => `yarn eslint --fix ${filenames.join(' --fix ')}`,
  '**/*.{js,ts,tsx,json}': (/** @type {string[]} */ filenames) =>
    `yarn prettier --check ${filenames.join(' --check ')} --write ${filenames.join(' --write ')}`,
  '**/*.{css,scss}': (/** @type {string[]} */ filenames) => `yarn stylelint --fix ${filenames.join(' --fix ')}`,
};
