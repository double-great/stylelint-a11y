import isStandardSyntaxRule from 'stylelint/lib/utils/isStandardSyntaxAtRule.mjs';
import stylelint from 'stylelint';
const {
  utils: { report, ruleMessages, validateOptions },
} = stylelint;

export const ruleName = 'a11y/no-display-none';

export const messages = ruleMessages(ruleName, {
  expected: (selector) => `Unexpected using "{ display: none; }" in ${selector}`,
});

function check(selector, node) {
  if (node.type !== 'rule') {
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
      } else if (node.type === 'atrule' && node.name.toLowerCase() === 'page' && node.params) {
        selector = node.params;
      }

      if (!selector) {
        return;
      }

      const isAccepted = check(selector, node);

      if (!isAccepted) {
        report({
          index: node.lastEach,
          message: messages.expected(selector),
          node,
          ruleName,
          result,
        });
      }
    });
  };
}
