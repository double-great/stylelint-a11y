import isStandardSyntaxRule from 'stylelint/lib/utils/isStandardSyntaxRule.mjs';
import stylelint from 'stylelint';
const {
  utils: { report, ruleMessages, validateOptions },
} = stylelint;

export const ruleName = 'a11y/no-outline-none';

export const messages = ruleMessages(ruleName, {
  expected: (selector) => `Expected "outline" to not be removed without alternative in ${selector}`,
});

export const meta = {
  url: 'https://github.com/double-great/stylelint-a11y/blob/main/src/rules/no-outline-none/README.md',
  fixable: false,
  deprecated: false,
};

// transparent keyword, rgba()/hsla() with a zero alpha channel, or an 8-digit hex ending in 00
const isTransparentColor = (value) =>
  /transparent|(?:rgba?|hsla?)\([^)]*[,/]\s*0(?:\.0+)?%?\s*\)|#[0-9a-f]{6}00\b/.test(value);

// The shorthand and each longhand that removes the visible outline on its own
const removesOutline = (prop, value) => {
  switch (prop) {
    case 'outline':
      return value === '0' || value === 'none';
    case 'outline-style':
      return value === 'none';
    case 'outline-width':
      return /^0[a-z%]*$/.test(value);
    case 'outline-color':
      return isTransparentColor(value);
    default:
      return false;
  }
};

function check(selector, node) {
  if (node.type !== 'rule') {
    return true;
  }

  if (!selector.match(/:focus/gi)) {
    return true;
  }

  const hasEmptyOutline = node.nodes.some(
    (o) => o.type === 'decl' && removesOutline(o.prop.toLowerCase(), o.value.toLowerCase())
  );

  if (hasEmptyOutline) {
    return node.nodes.some(
      (o) =>
        o.type === 'decl' &&
        ['border', 'border-color', 'box-shadow'].indexOf(o.prop.toLowerCase()) >= 0 &&
        !o.value.toLowerCase().match(/transparent/gi)
    );
  }

  return true;
}

export default function noOutlineNone(actual) {
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
