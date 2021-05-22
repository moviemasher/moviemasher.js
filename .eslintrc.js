module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
    jest: true,
  },
  extends: ['airbnb-base'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 12,
    ecmaFeatures: { jsx: true },
    sourceType: 'module',
    project: ["tsconfig.json"]
  },
  plugins: [
    '@typescript-eslint',
  ],
  rules: {
    "import/extensions": [
      "error",
      "ignorePackages",
      {
        js: "never",
        jsx: "never",
        ts: "never",
        tsx: "never"
      }
    ],
    quotes: 0,
    semi: 0,
    "no-console": 0,
    "comma-dangle": 0,
    "no-underscore-dangle": 0,
    "import/prefer-default-export": 0,
    "arrow-parens": 0,
    "no-undef": 0,
    "class-methods-use-this": 0,
    "object-curly-newline": 0,
    "no-unused-vars": "off"
  },
  settings: {
    "import/resolver": {
      node: {
        extensions: [".js", ".jsx", ".ts", ".tsx"],
      }
    }
  },
  ignorePatterns: ['.eslintrc.js', "rollup.config.js", "jest.config.js"],
};
