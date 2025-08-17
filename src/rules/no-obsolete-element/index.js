import isStandardSyntaxRule from 'stylelint/lib/utils/isStandardSyntaxRule.mjs';

import { obsoleteElements } from './obsoleteElements.js';

import stylelint from 'stylelint';
const {
  utils: { report, ruleMessages, validateOptions },
} = stylelint;

export const ruleName = 'a11y/no-obsolete-element';

export const messages = ruleMessages(ruleName, {
  expected: (selector) => `Expected obsolete selector "${selector}" to not be used`,
});

export const meta = {
  url: 'https://github.com/double-great/stylelint-a11y/blob/main/src/rules/no-obsolete-element/README.md',
  fixable: false,
  deprecated: false,
};

function check(selector, node) {
  if (node.type !== 'rule') {
    return true;
  }

  return !node.selectors.some((sel) => {
    return obsoleteElements.has(sel);
  });
}

export default function noObsoleteElement(actual) {
  return (root, result) => {
    const validOptions = validateOptions(result, ruleName, { actual });

    if (!validOptions || !actual) {
      return;
    }

    root.walk((node) => {
      let selector = null;

      if (node.type === 'rule') {
        if (!isStandardSyntaxRule(node)) {
          return;
        }

        selector = node.selector;
      } else if (node.type === 'atrule' && node.name.toLowerCase() === 'page' && node.params) {
        selector = node.params;
      }

      if (!selector) {
        return;
      }

      const isAccepted = check(selector, node);

      if (!isAccepted) {
        report({
          message: messages.expected(selector),
          node,
          ruleName,
          result,
        });
      }
    });
  };
}
