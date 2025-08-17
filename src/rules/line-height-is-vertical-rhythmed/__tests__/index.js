import { messages, ruleName } from '../index.js';

testRule({
  ruleName,
  config: [true],

  accept: [
    {
      code: 'a { }',
    },
    {
      code: '.smallText { line-height: 24px; }',
    },
    {
      code: '.largeText { line-height: 48px; }',
    },
    {
      code: '.relText { line-height: 1.5; }',
    },
    {
      code: '.smallTextU { LINE-HEIGHT: 24PX; }',
    },
    {
      code: 'body { font-size: 15px; line-height: 48px; }',
    },
    {
      code: 'a { font-size: 15px; line-height: 1.6; }',
    },
  ],

  reject: [
    {
      code: '.foo { line-height: 12px; }',
      message: messages.expected('.foo'),
      line: 1,
      column: 1,
    },
    {
      code: '.foo { line-height: 50px; }',
      message: messages.expected('.foo'),
      line: 1,
      column: 1,
    },
    {
      code: '.foo { line-height: 1.2; }',
      message: messages.expected('.foo'),
      line: 1,
      column: 1,
    },
    {
      code: '.foo { line-height: 12px; }',
      message: messages.expected('.foo'),
      line: 1,
      column: 1,
    },
    {
      code: '.foo { LINE-HEIGHT: 23PX; }',
      message: messages.expected('.foo'),
      line: 1,
      column: 1,
    },
    {
      code: 'p { font-size: 23px; line-height: 23px; }',
      message: messages.expected('p'),
      line: 1,
      column: 1,
    },
    {
      code: 'a { font-size: 23px; line-height: 1; }',
      message: messages.expected('a'),
      line: 1,
      column: 1,
    },
  ],
});

// Test enhanced options
testRule({
  ruleName,
  config: [true, { baselineGrid: 20, minRelativeLineHeight: 1.3 }],

  accept: [
    {
      code: '.custom { line-height: 20px; }',
      description: 'accepts 20px with custom baselineGrid: 20',
    },
    {
      code: '.custom { line-height: 40px; }',
      description: 'accepts 40px (20px multiple) with custom baselineGrid: 20',
    },
    {
      code: '.custom { line-height: 1.4; }',
      description: 'accepts 1.4 with custom minRelativeLineHeight: 1.3',
    },
  ],

  reject: [
    {
      code: '.custom { line-height: 24px; }',
      message: messages.expected('.custom'),
      line: 1,
      column: 1,
      description: 'rejects 24px with custom baselineGrid: 20 (not multiple)',
    },
    {
      code: '.custom { line-height: 1.2; }',
      message: messages.expected('.custom'),
      line: 1,
      column: 1,
      description: 'rejects 1.2 with custom minRelativeLineHeight: 1.3',
    },
  ],
});
