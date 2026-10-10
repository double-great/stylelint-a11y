import { messages, ruleName } from '../index.js';

testRule({
  ruleName,
  config: [true],

  accept: [
    {
      code: '.foo { line-height: 72px; }',
      description: 'accepts a larger multiple of the grid',
    },
    {
      code: 'p { line-height: 150%; }',
      description: 'ignores percentage values',
    },
    {
      code: 'p { line-height: 1.2em; }',
      description: 'ignores em and rem values',
    },
    {
      code: 'p { line-height: normal; }',
      description: 'ignores the normal keyword',
    },
    {
      code: 'p { font: 16px/23px sans-serif; }',
      description: 'ignores the font shorthand',
    },
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
    {
      code: '.decimal { line-height: 24.0px; }',
      description: 'accepts a decimal value that is exactly on the baseline grid',
    },
  ],

  reject: [
    {
      code: '.foo { line-height: 1.49; }',
      message: messages.expected('.foo'),
      line: 1,
      column: 1,
      description: 'rejects just below the relative minimum',
    },
    {
      code: '.foo { line-height: 36px; }',
      message: messages.expected('.foo'),
      line: 1,
      column: 1,
      description: 'rejects a value between grid multiples',
    },
    {
      code: '.foo { line-height: 23px !important; }',
      message: messages.expected('.foo'),
      line: 1,
      column: 1,
      description: 'rejects an important declaration',
    },
    {
      code: '.a { line-height: 23px; } .b { line-height: 1; }',
      warnings: [
        { message: messages.expected('.a'), line: 1, column: 1 },
        { message: messages.expected('.b'), line: 1, column: 27 },
      ],
      description: 'reports every rule off the grid',
    },
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
    {
      code: '.decimal { line-height: 24.5px; }',
      message: messages.expected('.decimal'),
      line: 1,
      column: 1,
      description: 'rejects a decimal value that is off the baseline grid',
    },
    {
      code: '@page { line-height: 23px; }',
      message: messages.expected('@page'),
      line: 1,
      column: 1,
      description: 'rejects a @page rule that has no page selector',
    },
    {
      code: '@page :first { line-height: 23px; }',
      message: messages.expected(':first'),
      line: 1,
      column: 1,
      description: 'rejects a @page rule with a page selector',
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

testRuleConfigs({
  ruleName,

  accept: [
    { config: true },
    { config: null },
    { config: [true, {}] },
    { config: [true, { baselineGrid: 20, minRelativeLineHeight: 1.3 }] },
    { config: [true, { severity: 'warning' }] },
  ],

  reject: [
    {
      config: [true, { baselineGrid: '20' }],
      description: 'rejects an option with the wrong type',
    },
    {
      config: [true, { baselineGrid: 0 }],
      description: 'rejects a zero baseline grid',
    },
    {
      config: [true, { minRelativeLineHeight: -1 }],
      description: 'rejects a negative minimum line height',
    },
    {
      config: [true, { grid: 20 }],
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
      code: '#{$sel} { line-height: 23px; }',
      description: 'skips a selector with interpolation',
    },
    {
      code: '.a { line-height: $lh; }',
      description: 'ignores a variable value',
    },
  ],

  reject: [
    {
      code: '.a { .b { line-height: 23px; } }',
      message: messages.expected('.b'),
      line: 1,
      column: 6,
      description: 'rejects a nested rule',
    },
  ],
});
