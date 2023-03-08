module.exports = {
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
  },
  plugins: ['@builder.io/mitosis'],
  extends: [
    // Use this approach for our recommended rules configuration
    'plugin:@builder.io/mitosis/recommended',
  ],
  rules: {
    // Use this to configure rules individually
    '@builder.io/mitosis/css-no-vars': 'error',
  },
};