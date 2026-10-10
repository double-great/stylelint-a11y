import isStandardSyntaxRule from 'stylelint/lib/utils/isStandardSyntaxRule.mjs';
import stylelint from 'stylelint';
const {
  utils: { report, ruleMessages, validateOptions },
} = stylelint;

const deepFlatten = (arr) => [].concat(...arr.map((v) => (Array.isArray(v) ? deepFlatten(v) : v)));

export const ruleName = 'a11y/selector-pseudo-class-focus';

export const messages = ruleMessages(ruleName, {
  expected: (value) => `Expected that ${value} is used together with :focus pseudo-class`,
});

export const meta = {
  url: 'https://github.com/double-great/stylelint-a11y/blob/main/src/rules/selector-pseudo-class-focus/README.md',
  fixable: true,
  deprecated: false,
};

// Either :focus or :focus-visible in place of :hover counts as the companion selector
const focusCompanions = (hovered) =>
  [':focus', ':focus-visible'].map((pseudo) => hovered.replace(/:hover/gi, pseudo));

// A :hover inside :not() does not style the hovered element
const hasHover = (selector) => /:hover/i.test(selector.replace(/:not\([^)]*\)/gi, ''));

// Every hovered selector needs a companion somewhere in the stylesheet, except that a nesting selector only means the same thing inside its own parent block
function hasAlready(rule, selector) {
  const nodes = [];

  if (selector.includes('&')) {
    rule.parent.each((node) => {
      if (node.type === 'rule') nodes.push(node.selectors);
    });
  } else {
    rule.root().walkRules((node) => nodes.push(node.selectors));
  }

  const flattened = deepFlatten(nodes);
  const hoveredSelector = selector
    .split(',')
    .map((o) => o.trim())
    .filter(hasHover);

  return hoveredSelector.every((o) => {
    return focusCompanions(o).some((companion) => flattened.indexOf(companion) >= 0);
  });
}

export default function selectorPseudoClassFocus(actual, _, context) {
  return (root, result) => {
    const validOptions = validateOptions(result, ruleName, { actual });

    if (!validOptions || !actual) {
      return;
    }

    root.walkRules((rule) => {
      let selector = null;

      if (!isStandardSyntaxRule(rule)) {
        return;
      }

      selector = rule.selector;

      if (!selector) {
        return;
      }

      if (selector.indexOf(':') === -1) {
        return;
      }

      if (!hasHover(selector)) {
        return;
      }

      if (/:focus/i.test(selector)) {
        return;
      }

      const isAccepted = hasAlready(rule, selector);

      if (context.fix && !isAccepted) {
        rule.parent.nodes.forEach((node) => {
          if (node.type === 'rule' && node.selector === selector) {
            node.selector = `${node.selector}, ${node.selector.replace(/:hover/gi, ':focus')}`;
          }
        });

        return;
      }

      if (!isAccepted) {
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
