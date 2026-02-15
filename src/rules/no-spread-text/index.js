import isStandardSyntaxRule from 'stylelint/lib/utils/isStandardSyntaxRule.mjs';
import stylelint from 'stylelint';
const {
  utils: { report, ruleMessages, validateOptions },
} = stylelint;

export const ruleName = 'a11y/no-spread-text';

export const messages = ruleMessages(ruleName, {
  expected: (selector) => `Expected max-width to be between 45ch and 80ch in ${selector}`,
});

export const meta = {
  url: 'https://github.com/double-great/stylelint-a11y/blob/main/src/rules/no-spread-text/README.md',
  fixable: false,
  deprecated: false,
};

const textStyles = [
  'text-decoration',
  'text-align',
  'text-transform',
  'text-indent',
  'letter-spacing',
  'line-height',
  'direction',
  'word-spacing',
  'text-shadow',
  'text-overflow',
  'color',
];

const nodesProbablyForText = (nodes) =>
  nodes
    .map((node) => node.prop)
    .filter(Boolean)
    .map((prop) => prop.toLowerCase())
    .some((prop) => textStyles.includes(prop));

export default function noSpreadText(actual, options) {
  return (root, result) => {
    const validOptions = validateOptions(result, ruleName, { actual });

    if (!validOptions || !actual) {
      return;
    }

    const minWidth = (options && options.minWidth) || 45;
    const maxWidth = (options && options.maxWidth) || 80;

    root.walkRules((rule) => {
      if (!isStandardSyntaxRule(rule)) {
        return;
      }

      const selector = rule.selector;

      if (!selector) {
        return;
      }

      const isRejected =
        nodesProbablyForText(rule.nodes) &&
        rule.nodes.some((o) => {
          return (
            o.type === 'decl' &&
            o.prop.toLowerCase() === 'max-width' &&
            o.value.toLowerCase().endsWith('ch') &&
            (parseFloat(o.value) < minWidth || parseFloat(o.value) > maxWidth)
          );
        });

      if (isRejected) {
        report({
          message: messages.expected(selector),
          node: rule,
          ruleName,
          result,
        });
      }
    });
  };
}
