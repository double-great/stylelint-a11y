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
  ],

  reject: [
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
      code: '@page { color: red; }',
      message: messages.expected('@page'),
      line: 1,
      column: 1,
      description: 'rejects a @page rule that has no page selector',
    },
  ],
});
