import globals from 'globals';
import pluginJs from '@eslint/js';
import stylelintConfig from 'eslint-config-stylelint';
import stylelintJestConfig from 'eslint-config-stylelint/jest';

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    languageOptions: {
      globals: {
        ...globals.node,
        testRule: 'readonly',
      },
    },
  },
  pluginJs.configs.recommended,
  ...stylelintConfig,
  ...stylelintJestConfig,
];
