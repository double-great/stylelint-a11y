import isStandardSyntaxRule from 'stylelint/lib/utils/isStandardSyntaxRule.mjs';
import stylelint from 'stylelint';
const {
  utils: { report, ruleMessages, validateOptions },
} = stylelint;

export const ruleName = 'a11y/no-display-none';

export const messages = ruleMessages(ruleName, {
  expected: (selector) => `Expected "display: none" to not be used in ${selector}`,
});

export const meta = {
  url: 'https://github.com/double-great/stylelint-a11y/blob/main/src/rules/no-display-none/README.md',
  fixable: false,
  deprecated: false,
};

// Hiding content only when printing does not affect people using a screen or assistive technology
function isPrintOnly(node) {
  let current = node.parent;

  while (current) {
    if (
      current.type === 'atrule' &&
      current.name.toLowerCase() === 'media' &&
      /^\s*(?:only\s+)?print\b/i.test(current.params)
    ) {
      return true;
    }

    current = current.parent;
  }

  return false;
}

function check(selector, node) {
  if (!node.nodes || isPrintOnly(node)) {
    return true;
  }

  return !node.nodes.some(
    (o) =>
      o.type === 'decl' && o.prop.toLowerCase() === 'display' && o.value.toLowerCase() === 'none'
  );
}

export default function noDisplayNone(actual) {
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
      } else if (node.type === 'atrule' && node.name.toLowerCase() === 'page') {
        selector = node.params || '@page';
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

noDisplayNone.meta = meta;
