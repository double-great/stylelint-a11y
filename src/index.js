import stylelint from 'stylelint';
const { createPlugin } = stylelint;

import rules from './rules/index.js';

// Each rule function carries its own meta, which stylelint reads from the function
const rulesPlugins = Object.keys(rules).map((ruleName) =>
  createPlugin(`a11y/${ruleName}`, rules[ruleName])
);

export default rulesPlugins;
