import isStandardSyntaxRule from 'stylelint/lib/utils/isStandardSyntaxRule';
import { utils } from 'stylelint';

const deepFlatten = (arr) => [].concat(...arr.map((v) => (Array.isArray(v) ? deepFlatten(v) : v)));

export const ruleName = 'a11y/selector-pseudo-class-focus';

export const messages = utils.ruleMessages(ruleName, {
  expected: (value) => `Expected that ${value} is used together with :focus pseudo-class`,
});

function hasAlready(parent, replacedSelector, selector) {
  const nodes = parent.nodes.reduce((arr, i) => {
    if (i.type === 'rule') arr.push(i.selectors);

    return arr;
  }, []);

  const hoveredSelector = selector
    .split(',')
    .filter((o) => o.match(/:hover/gi))
    .map((o) => o.trim());
  const returned = hoveredSelector.some((o) => {
    return deepFlatten(nodes).indexOf(o.replace(/:hover/gi, ':focus')) >= 0;
  });

  if (returned) return true;

  return parent.nodes.some((i) => {
    return i.type === 'rule' && i.selectors.indexOf(replacedSelector) !== -1;
  });
}

export default function (actual, _, context) {
  return (root, result) => {
    const validOptions = utils.validateOptions(result, ruleName, { actual });

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

      if (selector.indexOf(':hover') === -1) {
        return;
      }

      if (selector.indexOf(':hover') >= 0 && selector.indexOf(':focus') >= 0) {
        return;
      }

      const isAccepted = hasAlready(rule.parent, selector.replace(/:hover/g, ':focus'), selector);

      if (context.fix && !isAccepted) {
        rule.parent.nodes.forEach((node) => {
          if (node.type === 'rule' && node.selector === selector) {
            node.selector = `${node.selector}, ${node.selector.replace(/:hover/g, ':focus')}`;
          }
        });

        return;
      }

      if (!isAccepted) {
        utils.report({
          index: rule.lastEach,
          message: messages.expected(selector),
          node: rule,
          ruleName,
          result,
        });
      }
    });
  };
}
