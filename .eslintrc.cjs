module.exports = {
  extends: ['eslint:recommended', 'stylelint', 'prettier'],
  env: {
    es2021: true,
    node: true,
    jest: true,
  },
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: ['prettier', 'import'],
  globals: {
    testRule: true,
  },
};
