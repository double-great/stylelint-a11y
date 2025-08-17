import isStandardSyntaxRule from 'stylelint/lib/utils/isStandardSyntaxRule.mjs';
import stylelint from 'stylelint';
const {
  utils: { report, ruleMessages, validateOptions },
} = stylelint;

export const ruleName = 'a11y/line-height-is-vertical-rhythmed';

export const messages = ruleMessages(ruleName, {
  expected: (selector) => `Expected a vertical rhythmed line-height in ${selector}`,
});

export const meta = {
  url: 'https://github.com/double-great/stylelint-a11y/blob/main/src/rules/line-height-is-vertical-rhythmed/README.md',
  fixable: false,
  deprecated: false,
};

function check(node, options = {}) {
  if (node.type !== 'rule') {
    return true;
  }

  const baselineGrid = options.baselineGrid || 24;
  const minRelativeLineHeight = options.minRelativeLineHeight || 1.5;

  const checkInPx = (o) =>
    o.value.toLowerCase().endsWith('px') && parseInt(o.value) % baselineGrid !== 0;
  const checkInRel = (o) => !isNaN(o.value) && parseFloat(o.value) < minRelativeLineHeight;

  return !node.nodes.some(
    (o) =>
      o.type === 'decl' && o.prop.toLowerCase() === 'line-height' && (checkInPx(o) || checkInRel(o))
  );
}

export default function lineHeightIsVerticalRhythmed(actual, options) {
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

      const isAccepted = check(node, options);

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
