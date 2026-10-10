import { messages, ruleName } from '../index.js';

testRule({
  ruleName,
  config: [true],

  accept: [
    {
      code: '.foo { font-size: 16px; max-width: 100ch; }',
      description: 'ignores a rule whose only text property is font-size',
    },
    {
      code: '.foo { color: red; width: 100ch; }',
      description: 'ignores width',
    },
    {
      code: '.foo { color: red; max-inline-size: 100ch; }',
      description: 'ignores max-inline-size',
    },
    {
      code: '.foo { }',
    },
    {
      code: '.foo { display: flex; max-width: 82ch; }',
    },
    {
      code: '.foo { height: 100%; max-width: 82ch; }',
    },
    {
      code: '.foo { text-transform: lowercase; max-width: 65ch; }',
    },
    {
      code: '.bar { word-spacing: -5px; max-width: 100px; }',
    },
    {
      code: '.baz { MAX-WIDTH: 63CH; }',
    },
  ],

  reject: [
    {
      code: '.foo { text-transform: lowercase; max-width: 40ch; }',
      message: messages.expected('.foo'),
      line: 1,
      column: 1,
    },
    {
      code: '.bar { LINE-HEIGHT: 1.8; MAX-WIDTH: 81CH; }',
      message: messages.expected('.bar'),
      line: 1,
      column: 1,
    },
  ],
});

// Test enhanced options
testRule({
  ruleName,
  config: [true, { minWidth: 30, maxWidth: 60 }],

  accept: [
    {
      code: '.foo { text-transform: lowercase; max-width: 40ch; }',
      description: 'accepts 40ch with custom minWidth: 30',
    },
    {
      code: '.bar { color: red; max-width: 55ch; }',
      description: 'accepts 55ch with custom maxWidth: 60',
    },
  ],

  reject: [
    {
      code: '.foo { text-transform: lowercase; max-width: 25ch; }',
      message: messages.expected('.foo'),
      line: 1,
      column: 1,
      description: 'rejects 25ch with custom minWidth: 30',
    },
    {
      code: '.bar { color: red; max-width: 65ch; }',
      message: messages.expected('.bar'),
      line: 1,
      column: 1,
      description: 'rejects 65ch with custom maxWidth: 60',
    },
  ],
});

testRuleConfigs({
  ruleName,

  accept: [
    { config: true },
    { config: [true, {}] },
    { config: [true, { minWidth: 30, maxWidth: 60 }] },
    { config: [true, { severity: 'warning' }] },
  ],

  reject: [
    {
      config: [true, { maxWidth: '60ch' }],
      description: 'rejects an option with the wrong type',
    },
    {
      config: [true, { max: 60 }],
      description: 'rejects an unknown option name',
    },
    {
      config: [true, 'not-an-object'],
      description: 'rejects a secondary option that is not an object',
    },
  ],
});
