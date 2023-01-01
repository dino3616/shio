module.exports = {
  '**/*.{js,ts,json}': (/** @type {string[]} */ filenames) => `yarn eslint --fix ${filenames.join(' --fix ')}`,
  '**/*.{js,ts,json}': (/** @type {string[]} */ filenames) =>
    `yarn prettier --check ${filenames.join(' --check ')} --write ${filenames.join(' --write ')}`,
};
