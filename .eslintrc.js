module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    'airbnb-base',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module',
  },
  plugins: [
    '@typescript-eslint',
  ],
  rules: {
    quotes: 0,
    semi: 0,
    "comma-dangle": 0,
    "no-underscore-dangle": 0,
    "import/prefer-default-export": 0,
    "arrow-parens": 0,
    "no-undef": 0,
  },
};
