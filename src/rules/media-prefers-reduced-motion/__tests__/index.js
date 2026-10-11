import { messages, ruleName } from '../index.js';

testRule({
  ruleName,
  config: [true],
  fix: true,

  accept: [
    {
      code: 'a { }',
    },
    {
      code: 'div { transition: none; }',
    },
    {
      code: '.foo { transition: none } @media screen and (prefers-reduced-motion: reduce) { .foo { transition: none } }',
    },
    {
      code: '.bar { animation: none } @media screen and (prefers-reduced-motion) { .bar { animation: none } }',
    },
    {
      code: 'a { animation-name: skew; } @media screen and (prefers-reduced-motion) { a { animation: none } }',
    },
    {
      code: '.foo { transition: all; @media (prefers-reduced-motion: reduce) { transition: none; } }',
    },
    {
      code: '.foo { transition: all 0.3s; animation: slide 1s; } @media (prefers-reduced-motion: reduce) { .foo { transition: none; animation: none; } }',
      description: 'accepts when every motion property has an override',
    },
    {
      code: '@media (hover: hover) { &:hover, &:focus { background-color: blue; transition: all 0.15s; } @media screen and (prefers-reduced-motion: reduce) { &:hover, &:focus { background-color: blue; transition: none; } } }',
      description: 'accepts nested media query with prefers-reduced-motion already present',
    },
    {
      code: '@mixin safe-hover { @media (hover: hover) { &:hover { transition: all 0.15s; } @media screen and (prefers-reduced-motion: reduce) { &:hover { transition: none; } } } }',
      description: 'accepts SCSS mixin with nested media query already present',
    },
    {
      code: '@media (hover: hover) { &:hover, &:focus { background-color: blue; transition: all 0.15s; } @media screen and (prefers-reduced-motion: reduce) { &:hover, &:focus { background-color: blue; transition: none; } } }',
      description:
        'accepts exact code from issue #66 - sibling media query with prefers-reduced-motion',
    },
  ],

  reject: [
    {
      code: 'a { animation-name: skew; }',
      fixed:
        '@media screen and (prefers-reduced-motion: reduce) {\na { animation: none;\n}\n}\na { animation-name: skew; }',
      message: messages.expected('a'),
      line: 1,
      column: 1,
    },
    {
      code: 'a { animation-name: skew; } @media screen and (prefers-reduced-motion) { a { transition: none; } }',
      fixed:
        '@media screen and (prefers-reduced-motion: reduce) {\na { animation: none;\n}\n} a { animation-name: skew; } @media screen and (prefers-reduced-motion) { a { transition: none; } }',
      message: messages.expected('a'),
      line: 1,
      column: 1,
    },
    {
      code: '.foo { animation: 1s ease-in; } @media screen and (prefers-reduced-motion) { .foo { animation: 1s ease-in; } }',
      fixed:
        '@media screen and (prefers-reduced-motion: reduce) {\n.foo { animation: none;\n}\n} .foo { animation: 1s ease-in; } @media screen and (prefers-reduced-motion) { .foo { animation: 1s ease-in; } }',
      message: messages.expected('.foo'),
      line: 1,
      column: 1,
    },
    {
      code: '.foo { transition: all 0.3s; animation: slide 1s; } @media (prefers-reduced-motion: reduce) { .foo { transition: none; } }',
      fixed:
        '@media screen and (prefers-reduced-motion: reduce) {\n.foo { transition: none; animation: none;\n}\n} .foo { transition: all 0.3s; animation: slide 1s; } @media (prefers-reduced-motion: reduce) { .foo { transition: none; } }',
      message: messages.expected('.foo'),
      line: 1,
      column: 1,
      description: 'rejects when only the first motion property has an override',
    },
    {
      code: 'b { animation: spin 1s; }\n/* stylelint-disable-next-line a11y/media-prefers-reduced-motion */\na { transition: all 1s; }',
      fixed:
        '@media screen and (prefers-reduced-motion: reduce) {\nb { animation: none;\n}\n}\nb { animation: spin 1s; }\n/* stylelint-disable-next-line a11y/media-prefers-reduced-motion */\na { transition: all 1s; }',
      message: messages.expected('b'),
      line: 1,
      column: 1,
      description: 'leaves a rule covered by a disable comment unfixed and fixes the rest',
    },
    {
      code: '@media (hover: hover) { &:hover { transition: all 0.15s; } }',
      fixed:
        '@media (hover: hover) { &:hover { transition: all 0.15s;@media screen and (prefers-reduced-motion: reduce) {\n&:hover { transition: none;\n}\n} } }',
      message: messages.expected('&:hover'),
      description: 'should add prefers-reduced-motion when not present in nested media query',
    },
  ],
});

// @page at-rules are checked like rules; the at-rule name is case-insensitive
testRule({
  ruleName,
  config: [true],

  accept: [
    {
      code: '@page :first { transition: none; }',
    },
  ],

  reject: [
    {
      code: '@page :first { transition: all 1s; }',
      message: messages.expected(':first'),
      line: 1,
      column: 1,
    },
    {
      code: '@PAGE :first { transition: all 1s; }',
      message: messages.expected(':first'),
      line: 1,
      column: 1,
      description: 'treats the @page at-rule name as case-insensitive',
    },
    {
      code: '@page { transition: all 1s; }',
      message: messages.expected('@page'),
      line: 1,
      column: 1,
      description: 'rejects a @page rule that has no page selector',
    },
  ],
});

// Only a query for people who asked for less motion can hold the override, and keywords are case-insensitive
testRule({
  ruleName,
  config: [true],

  accept: [
    {
      code: 'a { transition: none !important; }',
      description: 'accepts an important none',
    },
    {
      code: 'a { transition-duration: 0.3s; }',
      description: 'ignores transition longhands other than the shorthand',
    },
    {
      code: 'a { animation-duration: 1s; }',
      description: 'ignores animation longhands other than animation-name',
    },
    {
      code: 'html { scroll-behavior: smooth; }',
      description: 'ignores scroll-behavior',
    },
    {
      code: 'a { transition: NONE; }',
      description: 'treats the none keyword as case-insensitive',
    },
    {
      code: '.foo { animation: x 1s; } @media (prefers-reduced-motion: reduce) { .foo { animation: None; } }',
      description: 'accepts an override written with a capitalized none',
    },
    {
      code: '@media (prefers-reduced-motion: no-preference) { a { animation: x 1s; } }',
      description: 'accepts motion declared only for people who have not asked for less motion',
    },
  ],

  reject: [
    {
      code: 'a { animation: x 1s !important; }',
      message: messages.expected('a'),
      line: 1,
      column: 1,
      description: 'rejects an important declaration',
    },
    {
      code: '.a { animation: x 1s; } .b { transition: all 1s; }',
      warnings: [
        { message: messages.expected('.a'), line: 1, column: 1 },
        { message: messages.expected('.b'), line: 1, column: 25 },
      ],
      description: 'reports every rule without an override',
    },
    {
      code: 'a { animation: x 1s; } @media (prefers-reduced-motion: no-preference) { a { animation: none; } }',
      message: messages.expected('a'),
      line: 1,
      column: 1,
      description: 'rejects an override placed in a no-preference query',
    },
  ],
});

testRule({
  ruleName,
  config: [true],
  customSyntax: 'postcss-scss',

  accept: [
    {
      code: '#{$sel} { animation: x 1s; }',
      description: 'skips a selector with interpolation',
    },
    {
      code: '.a { animation: $anim; @media (prefers-reduced-motion: reduce) { animation: none; } }',
      description: 'accepts a nested override for a variable value',
    },
  ],

  reject: [
    {
      code: '.a { .b { animation: x 1s; } }',
      message: messages.expected('.b'),
      line: 1,
      column: 6,
      description: 'rejects a nested rule',
    },
  ],
});

testRuleConfigs({
  ruleName,

  accept: [{ config: true }, { config: null }, { config: [true, { severity: 'warning' }] }],
});
