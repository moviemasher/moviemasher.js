module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
    jest: true,
  },
  extends: ['plugin:@typescript-eslint/recommended'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 12,
    ecmaFeatures: { jsx: true },
    sourceType: 'module',
  },
  plugins: [
    '@typescript-eslint/eslint-plugin',
    'eslint-plugin-tsdoc'
  ],
  rules: {
    "tsdoc/syntax": "warn",
    "quotes": 0,
    "semi": 0,
    "no-console": 0,
    "comma-dangle": 0,
    "no-underscore-dangle": 0,
    "import/prefer-default-export": 0,
    "arrow-parens": 0,
    "no-undef": 0,
    "class-methods-use-this": 0,
    "object-curly-newline": 0,
    "no-unused-vars": "on",
    "radix": 0,
    "@typescript-eslint/no-empty-interface": 0,
    "@typescript-eslint/no-unused-vars": 0,
    "@typescript-eslint/no-empty-function": 0,
  },
  settings: {
    "import/resolver": {
      node: { extensions: [".js", ".jsx", ".ts", ".tsx"] }
    }
  },
  ignorePatterns: ['.eslintrc.js', "rollup/*.config.js", "dev/test/jest.*.js"],
};
