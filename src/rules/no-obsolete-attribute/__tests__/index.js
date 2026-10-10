import { messages, ruleName } from '../index.js';

testRule({
  ruleName,
  config: [true],

  accept: [
    {
      code: 'a { color: pink; }',
    },
    {
      code: 'a[href] { color: pink; }',
    },
    {
      code: '[data-link] { color: pink; }',
    },
    {
      code: '.body[link] { color: pink; }',
      description: 'ignores an attribute that is only obsolete on a specific element',
    },
    {
      code: 'li:not([type]) { color: pink; }',
      description: 'ignores an obsolete attribute inside :not()',
    },
    {
      code: 'a:not(body[link]) { color: pink; }',
      description: 'ignores an element-specific obsolete attribute inside :not()',
    },
  ],

  reject: [
    {
      code: 'body[link] { color: pink; } img[align] { color: pink; }',
      warnings: [
        { message: messages.expected('body[link]'), line: 1, column: 1 },
        { message: messages.expected('img[align]'), line: 1, column: 29 },
      ],
      description: 'reports every obsolete attribute',
    },
    {
      code: 'body[link] { color: pink; }',
      message: messages.expected('body[link]'),
      line: 1,
      column: 1,
    },
    {
      code: 'a, img[datasrc] { color: pink; }',
      message: messages.expected('a, img[datasrc]'),
      line: 1,
      column: 1,
    },
    {
      code: 'img[align], a[name] { color: pink; }',
      message: messages.expected('img[align], a[name]'),
      line: 1,
      column: 1,
    },
    {
      code: 'body[link].old { color: pink; }',
      message: messages.expected('body[link].old'),
      line: 1,
      column: 1,
      description: 'rejects an obsolete attribute in a compound selector',
    },
    {
      code: 'div body[link] { color: pink; }',
      message: messages.expected('div body[link]'),
      line: 1,
      column: 1,
      description: 'rejects an obsolete attribute inside a descendant selector',
    },
    {
      code: '.drop[dropzone]:hover { color: pink; }',
      message: messages.expected('.drop[dropzone]:hover'),
      line: 1,
      column: 1,
      description: 'rejects an attribute that is obsolete on any element',
    },
    {
      code: 'div [dropzone] { color: pink; }',
      message: messages.expected('div [dropzone]'),
      line: 1,
      column: 1,
      description: 'rejects a bare obsolete attribute after a combinator',
    },
    {
      code: 'img[align="left"], a[name^="x"] { color: pink; }',
      message: messages.expected('img[align="left"], a[name^="x"]'),
      line: 1,
      column: 1,
      description: 'rejects obsolete attributes that have a value or an operator',
    },
    {
      code: ':is(body[link]) { color: pink; }',
      message: messages.expected(':is(body[link])'),
      line: 1,
      column: 1,
      description: 'rejects an obsolete attribute inside :is() because it does match the element',
    },
    {
      code: 'a[href] IMG[DATASRC] { color: pink; }',
      message: messages.expected('a[href] IMG[DATASRC]'),
      line: 1,
      column: 1,
      description: 'rejects an uppercase obsolete attribute',
    },
  ],
});

testRule({
  ruleName,
  config: [true],
  customSyntax: 'postcss-scss',

  accept: [
    {
      code: '#{$sel}[link] { color: pink; }',
      description: 'skips a selector with interpolation',
    },
  ],

  reject: [
    {
      code: '.a { body[link] { color: pink; } }',
      message: messages.expected('body[link]'),
      line: 1,
      column: 6,
      description: 'rejects a nested obsolete attribute',
    },
  ],
});

testRuleConfigs({
  ruleName,

  accept: [{ config: true }, { config: null }, { config: [true, { severity: 'warning' }] }],
});
