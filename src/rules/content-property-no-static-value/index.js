import isStandardSyntaxRule from 'stylelint/lib/utils/isStandardSyntaxRule.mjs';
import stylelint from 'stylelint';
const {
  utils: { report, ruleMessages, validateOptions },
} = stylelint;

export const ruleName = 'a11y/content-property-no-static-value';

export const messages = ruleMessages(ruleName, {
  expected: (selector) => `Expected "content" property to not be used in ${selector}`,
});

export const meta = {
  url: 'https://github.com/double-great/stylelint-a11y/blob/main/src/rules/content-property-no-static-value/README.md',
  fixable: false,
  deprecated: false,
};

const isContentPropertyUsedCorrectly = (selectors) =>
  selectors.every((selector) => {
    return /:before|:after/.test(selector);
  });

const checkNodesForContentProperty = (node) =>
  node.nodes.filter((n) => n.prop).some((n) => n.prop.toLowerCase() === 'content');

function check(node, options = {}) {
  if (node.type !== 'rule' || !checkNodesForContentProperty(node) || !node.first) {
    return true;
  }

  const allowedValues = options.allowedValues || ["''", '""', 'attr(aria-label)'];

  return node.nodes.some((o) => {
    return (
      o.type === 'decl' &&
      o.prop.toLowerCase() === 'content' &&
      isContentPropertyUsedCorrectly(o.parent.selectors) &&
      allowedValues.some((allowed) => o.value.toLowerCase() === allowed.toLowerCase())
    );
  });
}

export default function contentPropertyNoStaticValue(actual, options) {
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
