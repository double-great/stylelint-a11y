import { messages, ruleName } from '../index.js';

testRule({
  ruleName,
  config: [true],

  accept: [
    {
      code: ".foo::after { content: ''; }",
    },
    {
      code: 'a { }',
    },
    {
      code: ".foo:after { content: ''; }",
    },
    {
      code: '.foo::after { content: ""; }',
    },
    {
      code: '.bar::before { content: attr(aria-label); }',
    },
    {
      code: ".foo { font-size: '12px'; width: '200px'; }",
    },
  ],

  reject: [
    {
      code: '.foo::before { content: "bar"; }',
      message: messages.expected('.foo::before'),
      line: 1,
      column: 1,
    },
    {
      code: '.bar::before { content: 23; }',
      message: messages.expected('.bar::before'),
      line: 1,
      column: 1,
    },
    {
      code: ".foo:before, .bar { content: ''; }",
      message: messages.expected('.foo:before, .bar'),
      line: 1,
      column: 1,
    },
  ],
});

// Test enhanced options
testRule({
  ruleName,
  config: [true, { allowedValues: ["''", '""', 'attr(title)', 'counter(section)'] }],

  accept: [
    {
      code: ".foo::after { content: ''; }",
      description: 'accepts empty string with custom allowedValues',
    },
    {
      code: '.bar::before { content: attr(title); }',
      description: 'accepts attr(title) with custom allowedValues',
    },
    {
      code: '.baz::after { content: counter(section); }',
      description: 'accepts counter(section) with custom allowedValues',
    },
  ],

  reject: [
    {
      code: '.foo::before { content: attr(aria-label); }',
      message: messages.expected('.foo::before'),
      line: 1,
      column: 1,
      description: 'rejects attr(aria-label) when not in custom allowedValues',
    },
    {
      code: '.bar::after { content: "static text"; }',
      message: messages.expected('.bar::after'),
      line: 1,
      column: 1,
      description: 'rejects static text with custom allowedValues',
    },
  ],
});
