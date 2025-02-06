import globals from 'globals';
import pluginJs from '@eslint/js';
import stylelintConfig from 'eslint-config-stylelint';

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
];
