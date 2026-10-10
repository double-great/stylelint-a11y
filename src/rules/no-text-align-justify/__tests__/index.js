import { messages, ruleName } from '../index.js';

testRule({
  ruleName,
  config: [true],

  accept: [
    {
      code: 'p { text-align-last: justify; }',
      description: 'ignores text-align-last',
    },
    {
      code: 'p { text-justify: inter-word; }',
      description: 'ignores text-justify',
    },
    {
      code: '.foo { text-align: center; }',
    },
    {
      code: '.foo { text-align: left; }',
    },
    {
      code: '.foo { text-align: right; }',
    },
    {
      code: '.foo { text-align: start; }',
    },
    {
      code: '.foo { text-align: end; }',
    },
    {
      code: '.foo { TEXT-ALIGN: CENTER; }',
    },
  ],

  reject: [
    {
      code: '.foo { text-align: justify; }',
      message: messages.expected('.foo'),
      line: 1,
      column: 1,
    },
    {
      code: '.foo { TEXT-ALIGN: JUSTIFY; }',
      message: messages.expected('.foo'),
      line: 1,
      column: 1,
    },
    {
      code: '@page { text-align: justify; }',
      message: messages.expected('@page'),
      line: 1,
      column: 1,
      description: 'rejects a @page rule that has no page selector',
    },
    {
      code: '@page :first { text-align: justify; }',
      message: messages.expected(':first'),
      line: 1,
      column: 1,
      description: 'rejects a @page rule with a page selector',
    },
  ],
});
