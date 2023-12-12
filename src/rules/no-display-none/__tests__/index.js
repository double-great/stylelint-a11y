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
      column: 3,
    },
  ],
});
