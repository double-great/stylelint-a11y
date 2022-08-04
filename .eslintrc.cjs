module.exports = {
  extends: ['eslint:recommended', 'stylelint', 'prettier'],
  parser: '@babel/eslint-parser',
  parserOptions: {
    sourceType: 'module',
    ecmaVersion: 6,
  },
  env: {
    es6: true,
    jest: true,
    node: true,
  },
  plugins: ['prettier', 'import'],
  globals: {
    testRule: true,
  },
};
