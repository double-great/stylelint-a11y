import { messages, ruleName } from '../index.js';

testRule({
  ruleName,
  config: [true],

  accept: [
    {
      code: '.foo { display: flex; }',
    },
    {
      code: '@media print { .nav { display: none; } }',
      description: 'accepts hiding content only when printing',
    },
    {
      code: '@media only print and (orientation: portrait) { .nav { display: none; } }',
      description: 'accepts a print query with extra conditions',
    },
  ],

  reject: [
    {
      code: '.foo { display: none; }',
      message: messages.expected('.foo'),
      line: 1,
      column: 1,
    },
    {
      code: '@media screen, print { .nav { display: none; } }',
      message: messages.expected('.nav'),
      line: 1,
      column: 24,
      description: 'rejects a query that also targets screens',
    },
    {
      code: '@media screen { .nav { display: none; } }',
      message: messages.expected('.nav'),
      line: 1,
      column: 17,
      description: 'rejects a screen query',
    },
    {
      code: '@page { display: none; }',
      message: messages.expected('@page'),
      line: 1,
      column: 1,
      description: 'rejects a @page rule that has no page selector',
    },
    {
      code: '@page :first { display: none; }',
      message: messages.expected(':first'),
      line: 1,
      column: 1,
      description: 'rejects a @page rule with a page selector',
    },
  ],
});
