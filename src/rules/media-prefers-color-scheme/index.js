import isCustomSelector from 'stylelint/lib/utils/isCustomSelector.mjs';
import isStandardSyntaxAtRule from 'stylelint/lib/utils/isStandardSyntaxAtRule.mjs';
import isStandardSyntaxRule from 'stylelint/lib/utils/isStandardSyntaxRule.mjs';
import isStandardSyntaxSelector from 'stylelint/lib/utils/isStandardSyntaxSelector.mjs';

import stylelint from 'stylelint';
const {
  utils: { report, ruleMessages, validateOptions },
} = stylelint;

export const ruleName = 'a11y/media-prefers-color-scheme';

export const messages = ruleMessages(ruleName, {
  expected: (selector) => `Expected ${selector} is used with @media (prefers-color-scheme)`,
});

export const meta = {
  url: 'https://github.com/double-great/stylelint-a11y/blob/main/src/rules/media-prefers-color-scheme/README.md',
  fixable: false,
  deprecated: false,
};
const targetProperties = ['background-color', 'color'];

// A color set through a custom property is themed where the property is defined
const usesCustomProperty = (value) => /\bvar\(/i.test(value);

const normalizeSelector = (selector) =>
  selector
    .split(',')
    .map((part) => part.trim().replace(/\s+/g, ' '))
    .join(', ');

function check(selector, node) {
  const declarations = node.nodes;
  const params = node.parent.params;
  const parentNodes = node.parent.nodes;

  if (!declarations) return true;

  if (!isStandardSyntaxSelector(selector)) {
    return true;
  }

  if (isCustomSelector(selector)) {
    return true;
  }

  const noMatchedParams = !params || params.indexOf('prefers-color-scheme') === -1;

  // Every matched property needs its own override, not just the first one found
  const matchedProperties = noMatchedParams
    ? declarations
        .filter(
          (declaration) =>
            targetProperties.indexOf(declaration.prop) >= 0 &&
            !usesCustomProperty(declaration.value)
        )
        .map((declaration) => declaration.prop)
    : [];

  if (matchedProperties.length === 0) return true;

  // A media query nested inside the rule counts as the override
  const hasNestedPrefersColorScheme = declarations.some(
    (childNode) =>
      childNode.type === 'atrule' &&
      childNode.name === 'media' &&
      childNode.params.indexOf('prefers-color-scheme') >= 0
  );

  if (hasNestedPrefersColorScheme) return true;

  return matchedProperties.every((currentSelector) => {
    return parentNodes.some((parentNode) => {
      if (!parentNode || !parentNode.nodes) return false;

      return parentNode.nodes.some((childrenNode) => {
        const childrenNodes = childrenNode.nodes;

        if (
          !parentNode.params ||
          !Array.isArray(childrenNodes) ||
          normalizeSelector(selector) !== normalizeSelector(childrenNode.selector)
        )
          return false;

        const matchedChildrenNodes = childrenNodes.some((declaration) => {
          const index = targetProperties.indexOf(declaration.prop);

          if (currentSelector !== targetProperties[index]) return false;

          return index >= 0 && parentNode.params.indexOf('prefers-color-scheme') >= 0;
        });

        return matchedChildrenNodes;
      });
    });
  });
}

export default function mediaPrefersColorScheme(actual) {
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
        if (!isStandardSyntaxAtRule(node)) {
          return;
        }

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
