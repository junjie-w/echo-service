export default {
  '**/*.{js,ts,json,yml}': 'eslint --cache --fix',
  "src/**/*.{js,ts}": "jest --bail --findRelatedTests"
};
