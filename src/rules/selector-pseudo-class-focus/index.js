import isStandardSyntaxRule from 'stylelint/lib/utils/isStandardSyntaxRule.mjs';
import stylelint from 'stylelint';
const {
  utils: { report, ruleMessages, validateOptions },
} = stylelint;

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

// The selectors of a container's direct child rules
const childSelectors = (container) => {
  const selectors = new Set();

  container.each((node) => {
    if (node.type === 'rule') node.selectors.forEach((o) => selectors.add(o));
  });

  return selectors;
};

// Every hovered selector needs a companion somewhere in the stylesheet, except that a nesting selector only means the same thing inside its own parent block
function hasAlready(rule, selector, stylesheetSelectors) {
  const candidates = selector.includes('&') ? childSelectors(rule.parent) : stylesheetSelectors();
  const hoveredSelector = selector
    .split(',')
    .map((o) => o.trim())
    .filter(hasHover);

  return hoveredSelector.every((o) => {
    return focusCompanions(o).some((companion) => candidates.has(companion));
  });
}

export default function selectorPseudoClassFocus(actual) {
  return (root, result) => {
    const validOptions = validateOptions(result, ruleName, { actual });

    if (!validOptions || !actual) {
      return;
    }

    // Collected once per stylesheet so the companion lookup stays linear
    let allSelectors = null;
    const stylesheetSelectors = () => {
      if (!allSelectors) {
        allSelectors = new Set();
        root.walkRules((node) => node.selectors.forEach((o) => allSelectors.add(o)));
      }

      return allSelectors;
    };

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

      const isAccepted = hasAlready(rule, selector, stylesheetSelectors);

      if (!isAccepted) {
        const fix = () => {
          rule.parent.nodes.forEach((node) => {
            if (node.type === 'rule' && node.selector === selector) {
              node.selector = `${node.selector}, ${node.selector.replace(/:hover/gi, ':focus')}`;
            }
          });
        };

        report({
          message: messages.expected(selector),
          node: rule,
          ruleName,
          result,
          fix,
        });
      }
    });
  };
}
