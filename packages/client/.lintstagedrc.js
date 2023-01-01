module.exports = {
  '**/*.{js,ts,tsx,json}': (filenames) => `yarn eslint --fix ${filenames.join(' --fix ')}`,
  '**/*.{js,ts,tsx,json}': (filenames) => `yarn prettier --check ${filenames.join(' --check ')} --write ${filenames.join(' --write ')}`,
  '**/*.{css,scss}': `yarn stylelint --fix ${filenames.join(' --fix ')}`,
};
