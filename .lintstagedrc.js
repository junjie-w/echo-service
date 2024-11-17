export default {
  '(src|tests|scripts)/**/*.{js,ts,json,yml}': 'eslint --cache --fix',
  'src/**/*.{js,ts}': 'jest --bail --passWithNoTests --findRelatedTests',
  'examples/**/*.js': 'eslint --cache --fix'
};
