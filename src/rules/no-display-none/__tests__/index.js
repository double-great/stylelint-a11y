import { messages, ruleName } from '../index.js';

testRule({
  ruleName,
  config: [true],

  accept: [
    {
      code: '.foo { display: flex; }',
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
