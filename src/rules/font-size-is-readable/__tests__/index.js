import { messages, ruleName } from '../index.js';

testRule({
  ruleName,
  config: [true],

  accept: [
    {
      code: '.foo { font-size: 11.25pt; }',
      description: 'accepts the point boundary',
    },
    {
      code: 'p { font: 10px/1.2 sans-serif; }',
      description: 'ignores the font shorthand',
    },
    {
      code: 'p { font-size: 0.5rem; }',
      description: 'ignores relative units',
    },
    {
      code: 'p { font-size: xx-small; }',
      description: 'ignores keyword sizes',
    },
    {
      code: 'p { font-size: $small; }',
      description: 'ignores a preprocessor variable',
    },
    {
      code: '.foo { }',
    },
    {
      code: '.foo { font-size: 15px; }',
    },
    {
      code: '.foo { font-size: 12pt; }',
    },
    {
      code: '.bar { FONT-SIZE: 15PX; }',
    },
    {
      code: '.baz { font-size: 1em; }',
    },
  ],

  reject: [
    {
      code: '.foo { font-size: 14.99px; }',
      message: messages.expected('.foo'),
      line: 1,
      column: 1,
      description: 'rejects just below the pixel threshold',
    },
    {
      code: '.foo { font-size: 11pt; }',
      message: messages.expected('.foo'),
      line: 1,
      column: 1,
      description: 'rejects just below the point threshold',
    },
    {
      code: '.foo { font-size: 10px !important; }',
      message: messages.expected('.foo'),
      line: 1,
      column: 1,
      description: 'rejects an important declaration',
    },
    {
      code: '.a { font-size: 10px; } .b { font-size: 9px; }',
      warnings: [
        { message: messages.expected('.a'), line: 1, column: 1 },
        { message: messages.expected('.b'), line: 1, column: 25 },
      ],
      description: 'reports every rule that is too small',
    },
    {
      code: '.foo { font-size: 10px; }',
      message: messages.expected('.foo'),
      line: 1,
      column: 1,
    },
    {
      code: '.foo { font-size: 3pt; }',
      message: messages.expected('.foo'),
      line: 1,
      column: 1,
    },
    {
      code: '.bar { FONT-SIZE: 8PX; }',
      message: messages.expected('.bar'),
      line: 1,
      column: 1,
    },
  ],
});

testRule({
  ruleName,
  config: [true, { thresholdInPixels: 16 }],

  accept: [
    {
      code: '.foo { }',
    },
    {
      code: '.foo { font-size: 16px; }',
    },
    {
      code: '.foo { font-size: 12pt; }',
    },
    {
      code: '.bar { FONT-SIZE: 16PX; }',
    },
    {
      code: '.baz { font-size: 1em; }',
    },
  ],

  reject: [
    {
      code: '.foo { font-size: 15px; }',
      message: messages.expected('.foo'),
      line: 1,
      column: 1,
    },
    {
      code: '.foo { font-size: 3pt; }',
      message: messages.expected('.foo'),
      line: 1,
      column: 1,
    },
    {
      code: '.bar { FONT-SIZE: 8PX; }',
      message: messages.expected('.bar'),
      line: 1,
      column: 1,
    },
  ],
});

testRuleConfigs({
  ruleName,

  accept: [
    { config: true },
    { config: null },
    { config: [true, {}] },
    { config: [true, { thresholdInPixels: 16 }] },
    { config: [true, { severity: 'warning' }] },
  ],

  reject: [
    {
      config: [true, { thresholdInPixels: 'invalid' }],
      description: 'rejects an option with the wrong type',
    },
    {
      config: [true, { thresholdInPixels: 0 }],
      description: 'rejects a zero threshold',
    },
    {
      config: [true, { minSize: 12 }],
      description: 'rejects an unknown option name',
    },
    {
      config: [true, 'not-an-object'],
      description: 'rejects a secondary option that is not an object',
    },
  ],
});

testRule({
  ruleName,
  config: [true],
  customSyntax: 'postcss-scss',

  accept: [
    {
      code: '#{$sel} { font-size: 10px; }',
      description: 'skips a selector with interpolation',
    },
    {
      code: '.a { font-size: $small; }',
      description: 'ignores a variable value',
    },
  ],

  reject: [
    {
      code: '.a { .b { font-size: 10px; } }',
      message: messages.expected('.b'),
      line: 1,
      column: 6,
      description: 'rejects a nested rule',
    },
  ],
});
