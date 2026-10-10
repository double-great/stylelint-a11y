import { messages, ruleName } from '../index.js';

testRule({
  ruleName,
  config: [true],

  accept: [
    {
      code: '.foo { color: pink; }',
    },
    {
      code: '.center { color: pink; }',
      description: 'ignores a class that shares a name with an obsolete element',
    },
    {
      code: '#center { color: pink; }',
      description: 'ignores an id that shares a name with an obsolete element',
    },
    {
      code: '[data-center] { color: pink; }',
      description: 'ignores an attribute that shares a name with an obsolete element',
    },
    {
      code: 'div:not(center) { color: pink; }',
      description: 'ignores an obsolete element inside :not()',
    },
    {
      code: 'div:NOT(center, font) { color: pink; }',
      description: 'ignores a selector list inside an uppercase :not()',
    },
  ],

  reject: [
    {
      code: 'center { color: pink; } font { color: pink; }',
      warnings: [
        { message: messages.expected('center'), line: 1, column: 1 },
        { message: messages.expected('font'), line: 1, column: 25 },
      ],
      description: 'reports every obsolete element',
    },
    {
      code: 'blink { color: pink; }',
      message: messages.expected('blink'),
      line: 1,
      column: 1,
    },
    {
      code: 'applet, a { color: pink; }',
      message: messages.expected('applet, a'),
      line: 1,
      column: 1,
    },
    {
      code: 'applet, blink { color: pink; }',
      message: messages.expected('applet, blink'),
      line: 1,
      column: 1,
    },
    {
      code: 'div center { color: pink; }',
      message: messages.expected('div center'),
      line: 1,
      column: 1,
      description: 'rejects an obsolete element inside a descendant selector',
    },
    {
      code: 'center.active { color: pink; }',
      message: messages.expected('center.active'),
      line: 1,
      column: 1,
      description: 'rejects an obsolete element with a class',
    },
    {
      code: 'center:hover { color: pink; }',
      message: messages.expected('center:hover'),
      line: 1,
      column: 1,
      description: 'rejects an obsolete element with a pseudo-class',
    },
    {
      code: ':is(center, .x) { color: pink; }',
      message: messages.expected(':is(center, .x)'),
      line: 1,
      column: 1,
      description: 'rejects an obsolete element inside :is() because it does match the element',
    },
    {
      code: 'nav > CENTER, a { color: pink; }',
      message: messages.expected('nav > CENTER, a'),
      line: 1,
      column: 1,
      description: 'rejects an uppercase obsolete element in a selector list',
    },
  ],
});

testRule({
  ruleName,
  config: [true],
  customSyntax: 'postcss-scss',

  accept: [
    {
      code: '#{$sel} center { color: pink; }',
      description: 'skips a selector with interpolation',
    },
  ],

  reject: [
    {
      code: '.a { center { color: pink; } }',
      message: messages.expected('center'),
      line: 1,
      column: 6,
      description: 'rejects a nested obsolete element',
    },
  ],
});

testRuleConfigs({
  ruleName,

  accept: [{ config: true }, { config: null }, { config: [true, { severity: 'warning' }] }],
});
