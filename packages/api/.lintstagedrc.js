module.exports = {
  '**/*.{js,ts,json}': (filenames) => `yarn eslint --fix ${filenames.join(' --fix ')}`,
  '**/*.{js,ts,json}': (filenames) => `yarn prettier --check ${filenames.join(' --check ')} --write ${filenames.join(' --write ')}`,
};
