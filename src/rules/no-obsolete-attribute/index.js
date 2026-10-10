import isNegatedSelectorNode from '../../utils/isNegatedSelectorNode.js';
import isStandardSyntaxRule from 'stylelint/lib/utils/isStandardSyntaxRule.mjs';

import { obsoleteAttributes } from './obsoleteAttributes.js';
import selectorParser from 'postcss-selector-parser';

import stylelint from 'stylelint';
const {
  utils: { report, ruleMessages, validateOptions },
} = stylelint;

export const ruleName = 'a11y/no-obsolete-attribute';

export const messages = ruleMessages(ruleName, {
  expected: (selector) => `Expected obsolete attribute "${selector}" to not be used`,
});

export const meta = {
  url: 'https://github.com/double-great/stylelint-a11y/blob/main/src/rules/no-obsolete-attribute/README.md',
  fixable: false,
  deprecated: false,
};

// The type selector in the same compound selector as the attribute, if there is one
function compoundTag(attribute) {
  const siblings = attribute.parent.nodes;

  for (let i = siblings.indexOf(attribute) - 1; i >= 0; i--) {
    if (siblings[i].type === 'combinator') return null;

    if (siblings[i].type === 'tag') return siblings[i].value.toLowerCase();
  }

  return null;
}

function check(selector, node) {
  if (node.type !== 'rule') {
    return true;
  }

  let hasObsoleteAttribute = false;

  try {
    selectorParser()
      .astSync(selector)
      .walkAttributes((attribute) => {
        if (isNegatedSelectorNode(attribute)) return;

        const name = `[${attribute.attribute.toLowerCase()}]`;
        const tag = compoundTag(attribute);

        if (obsoleteAttributes.has(name) || (tag && obsoleteAttributes.has(`${tag}${name}`))) {
          hasObsoleteAttribute = true;
        }
      });
  } catch {
    return true;
  }

  return !hasObsoleteAttribute;
}

export default function noObsoleteAttribute(actual) {
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
