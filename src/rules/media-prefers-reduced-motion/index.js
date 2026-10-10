import isCustomSelector from 'stylelint/lib/utils/isCustomSelector.mjs';
import isStandardSyntaxAtRule from 'stylelint/lib/utils/isStandardSyntaxAtRule.mjs';
import isStandardSyntaxRule from 'stylelint/lib/utils/isStandardSyntaxRule.mjs';
import isStandardSyntaxSelector from 'stylelint/lib/utils/isStandardSyntaxSelector.mjs';

import { parse } from 'postcss';

import stylelint from 'stylelint';
const {
  utils: { report, ruleMessages, validateOptions },
} = stylelint;

export const ruleName = 'a11y/media-prefers-reduced-motion';

export const messages = ruleMessages(ruleName, {
  expected: (selector) => `Expected ${selector} is used with @media (prefers-reduced-motion)`,
});

export const meta = {
  url: 'https://github.com/double-great/stylelint-a11y/blob/main/src/rules/media-prefers-reduced-motion/README.md',
  fixable: true,
  deprecated: false,
};
const targetProperties = ['transition', 'animation', 'animation-name'];

// Any mention of the feature means the author is handling motion preference for that block
const mentionsReducedMotion = (params) => /prefers-reduced-motion/i.test(params || '');

// Only a query for people who asked for less motion can hold the override
const isReduceQuery = (params) => mentionsReducedMotion(params) && !/no-preference/i.test(params);

const isNone = (value) => value.toLowerCase() === 'none';

function checkChildrenNodes(childrenNodes, currentSelector, parentNode) {
  return childrenNodes.some((declaration) => {
    const index = targetProperties.indexOf(declaration.prop);

    if (currentSelector === 'animation-name' && targetProperties[index] === 'animation')
      return true;

    if (currentSelector !== targetProperties[index]) return false;

    if (!isNone(declaration.value)) return false;

    return index >= 0 && isReduceQuery(parentNode.params);
  });
}

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

  const noMatchedParams = !mentionsReducedMotion(params);

  // Every matched property needs its own override, not just the first one found
  const matchedProperties = noMatchedParams
    ? declarations
        .filter(
          (declaration) =>
            targetProperties.indexOf(declaration.prop) >= 0 && !isNone(declaration.value)
        )
        .map((declaration) => declaration.prop)
    : [];

  if (matchedProperties.length === 0) return true;

  // Check if there's a nested media query with prefers-reduced-motion inside the current rule
  const hasNestedPrefersReducedMotion = declarations.some((childNode) => {
    if (childNode.type === 'atrule' && childNode.name === 'media') {
      return isReduceQuery(childNode.params);
    }

    return false;
  });

  if (hasNestedPrefersReducedMotion) return true;

  // Check if there's a sibling media query with prefers-reduced-motion at the same level
  if (node.parent && node.parent.type === 'atrule' && node.parent.name === 'media') {
    const siblingHasPrefersReducedMotion = node.parent.nodes.some((siblingNode) => {
      if (siblingNode.type === 'atrule' && siblingNode.name === 'media') {
        return isReduceQuery(siblingNode.params);
      }

      return false;
    });

    if (siblingHasPrefersReducedMotion) return true;
  }

  return matchedProperties.every((currentSelector) => {
    return parentNodes.some((parentNode) => {
      if (!parentNode || !parentNode.nodes) return false;

      return parentNode.nodes.some((childrenNode) => {
        const childrenNodes = childrenNode.nodes;

        if (childrenNode.type === 'atrule' && isReduceQuery(childrenNode.params)) {
          return childrenNodes.some((declaration) => {
            const index = targetProperties.indexOf(declaration.prop);

            if (currentSelector === 'animation-name' && targetProperties[index] === 'animation')
              return true;

            if (currentSelector !== targetProperties[index]) return false;

            if (!isNone(declaration.value)) return false;

            return index >= 0;
          });
        }

        if (
          !parentNode.params ||
          !Array.isArray(childrenNodes) ||
          selector !== childrenNode.selector
        )
          return false;

        return checkChildrenNodes(childrenNodes, currentSelector, parentNode);
      });
    });
  });
}

export default function mediaPrefersReducedMotion(actual) {
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
        const fix = () => {
          const media = parse('@media screen and (prefers-reduced-motion: reduce) {}');

          media.nodes.forEach((o) => {
            o.raws.after = '\n';
          });

          // Check if we're already inside a media query
          if (node.parent && node.parent.type === 'atrule' && node.parent.name === 'media') {
            // Create a clone with only the animation/transition properties set to none
            const cloneRule = node.clone();

            cloneRule.nodes = cloneRule.nodes.filter((o) => {
              if (o.prop === 'animation-name') {
                o.prop = 'animation';
                o.value = 'none';

                return true;
              }

              if (targetProperties.indexOf(o.prop) >= 0) {
                o.value = 'none';

                return true;
              }

              return false;
            });

            cloneRule.raws = {
              ...cloneRule.raws,
              before: '\n',
              after: '\n',
              semicolon: true,
            };

            media.first.append(cloneRule);
            // Insert the nested media query inside the current rule
            node.append(media.first);
          } else {
            // Original logic for non-nested case
            const cloneRule = node.clone();

            cloneRule.raws = {
              ...cloneRule.raws,
              before: '\n',
              after: '\n',
              semicolon: true,
            };
            cloneRule.nodes.forEach((o) => {
              if (o.prop === 'animation-name') {
                o.prop = 'animation';
              }

              if (targetProperties.indexOf(o.prop) >= 0) {
                o.value = 'none';
              }
            });
            media.first.append(cloneRule);
            // Insert the media query before the current node
            node.before(media);
          }
        };

        report({
          message: messages.expected(selector),
          node,
          ruleName,
          result,
          fix,
        });
      }
    });
  };
}
