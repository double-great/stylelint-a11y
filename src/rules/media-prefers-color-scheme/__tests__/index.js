import { messages, ruleName } from '../index.js';

testRule({
  ruleName,
  config: [true],

  accept: [
    {
      code: 'a { }',
    },
    {
      code: '.foo { color: red } @media screen and (prefers-color-scheme: dark) { .foo { color: blue } }',
    },
    {
      code: '.bar { background-color: red } @media screen and (prefers-color-scheme: dark) { .bar { background-color: blue } }',
    },
    {
      code: '.baz { color: red; background-color: blue } @media (prefers-color-scheme: dark) { .baz { color: white; background-color: black } }',
      description: 'accepts when every color property has an override',
    },
    {
      code: 'a,b { color: red; } @media (prefers-color-scheme: dark) { a, b { color: blue; } }',
      description: 'matches the override selector regardless of whitespace',
    },
    {
      code: 'a { color: var(--fg); }',
      description: 'accepts a color set through a custom property',
    },
    {
      code: 'a { color: var(--fg, #000); background-color: VAR(--bg); }',
      description: 'accepts custom properties with fallbacks and uppercase var()',
    },
  ],

  reject: [
    {
      code: 'a { color: red !important; }',
      message: messages.expected('a'),
      line: 1,
      column: 1,
      description: 'rejects an important declaration',
    },
    {
      code: 'a { color: red; }',
      message: messages.expected('a'),
      line: 1,
      column: 1,
    },
    {
      code: 'a { color: red; } @media screen and (prefers-color-scheme: dark) { a { background-color: red; } }',
      message: messages.expected('a'),
      line: 1,
      column: 1,
    },
    {
      code: '.foo { background-color: red;}',
      message: messages.expected('.foo'),
      line: 1,
      column: 1,
    },
    {
      code: '.bar { color: red; } .baz { background-color: red; } @media screen and (prefers-color-scheme: dark) { .baz { color: blue; } }',
      warnings: [
        {
          message: messages.expected('.bar'),
          line: 1,
          column: 1,
        },
        {
          message: messages.expected('.baz'),
          line: 1,
          column: 22,
        },
      ],
    },
    {
      code: '.foo { background-color: red; } @media screen and (prefers-color-scheme) { .foo { color: red; } }',
      message: messages.expected('.foo'),
      line: 1,
      column: 1,
    },
    {
      code: '.baz { color: red; background-color: blue } @media (prefers-color-scheme: dark) { .baz { color: white } }',
      message: messages.expected('.baz'),
      line: 1,
      column: 1,
      description: 'rejects when only the first color property has an override',
    },
    {
      code: '@page :first { color: red; }',
      message: messages.expected(':first'),
      line: 1,
      column: 1,
      description: 'rejects a @page rule without a color scheme override',
    },
    {
      code: '@PAGE :first { color: red; }',
      message: messages.expected(':first'),
      line: 1,
      column: 1,
      description: 'treats the @page at-rule name as case-insensitive',
    },
    {
      code: 'a { color: var(--fg); background-color: red; }',
      message: messages.expected('a'),
      line: 1,
      column: 1,
      description: 'still rejects a literal color next to a custom property',
    },
    {
      code: '@page { color: red; }',
      message: messages.expected('@page'),
      line: 1,
      column: 1,
      description: 'rejects a @page rule that has no page selector',
    },
  ],
});

testRule({
  ruleName,
  config: [true],
  customSyntax: 'postcss-scss',

  accept: [
    {
      code: '#{$sel} { color: red; }',
      description: 'skips a selector with interpolation',
    },
    {
      code: 'a { color: red; @media (prefers-color-scheme: dark) { color: blue; } }',
      description: 'accepts a media query nested inside the rule',
    },
    {
      code: '.card { background-color: #fff; @media (prefers-color-scheme: dark) { background-color: #000; } }',
      description: 'accepts a nested override for background-color',
    },
  ],

  reject: [
    {
      code: '.card { color: red; .inner { color: blue; } }',
      warnings: [
        { message: messages.expected('.card'), line: 1, column: 1 },
        { message: messages.expected('.inner'), line: 1, column: 21 },
      ],
      description: 'rejects both the outer and the nested rule without a color scheme query',
    },
  ],
});

testRuleConfigs({
  ruleName,

  accept: [{ config: true }, { config: null }, { config: [true, { severity: 'warning' }] }],
});
