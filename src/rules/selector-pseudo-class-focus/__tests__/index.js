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
      code: 'a:focus { }',
    },
    {
      code: 'a:hover, a:focus { }',
    },
    {
      code: 'a:hover { } a:focus { }',
    },
    {
      code: 'a:focus { outline: thin dotted; } a:active, a:hover { outline: 0; }',
    },
    {
      code: 'a:hover { } a:focus-visible { }',
      description: 'accepts a separate :focus-visible rule as the companion',
    },
    {
      code: 'a:hover, a:focus-visible { }',
      description: 'accepts :focus-visible in the same selector list',
    },
    {
      code: 'a:hover, b:hover { } a:focus, b:focus { }',
      description: 'accepts a selector list when every member has a companion',
    },
    {
      code: 'a:hover, b:hover { } a:focus { } b:focus-visible { }',
      description: 'accepts companions split across rules and pseudo-classes',
    },
    {
      code: 'a:not(:hover) { }',
      description: 'ignores :hover inside :not()',
    },
    {
      code: '@media (hover: hover) { a:hover { } } a:focus { }',
      description: 'accepts a companion outside the media query that holds the hover rule',
    },
    {
      code: 'a:focus { } @media (hover: hover) { a:hover { } }',
      description: 'accepts a companion declared before the hover rule',
    },
  ],

  reject: [
    {
      code: 'a:hover { }',
      fixed: 'a:hover, a:focus { }',
      message: messages.expected('a:hover'),
    },
    {
      code: 'a:hover { } b:hover { }',
      fixed: 'a:hover, a:focus { } b:hover, b:focus { }',
      warnings: [
        { message: messages.expected('a:hover'), column: 1, line: 1 },
        { message: messages.expected('b:hover'), column: 13, line: 1 },
      ],
    },
    {
      code: 'a:hover { } a:focus { } b:hover { } b { }',
      fixed: 'a:hover { } a:focus { } b:hover, b:focus { } b { }',
      message: messages.expected('b:hover'),
    },
    {
      code: 'a:hover, a:focus { } b:hover { } b { }',
      fixed: 'a:hover, a:focus { } b:hover, b:focus { } b { }',
      message: messages.expected('b:hover'),
    },
    {
      code: 'a:hover { } a:focus-within { }',
      fixed: 'a:hover, a:focus { } a:focus-within { }',
      message: messages.expected('a:hover'),
      description: 'does not treat :focus-within as a companion',
    },
    {
      code: 'a:hover, b:hover { } a:focus { }',
      fixed: 'a:hover, b:hover, a:focus, b:focus { } a:focus { }',
      message: messages.expected('a:hover, b:hover'),
      description: 'rejects a selector list when only one member has a companion',
    },
    {
      code: 'a:HOVER { }',
      fixed: 'a:HOVER, a:focus { }',
      message: messages.expected('a:HOVER'),
      description: 'treats :hover as case-insensitive',
    },
    {
      code: 'a:hover:not(.x) { }',
      fixed: 'a:hover:not(.x), a:focus:not(.x) { }',
      message: messages.expected('a:hover:not(.x)'),
      description: 'still checks a hover selector that also uses :not()',
    },
  ],
});

testRule({
  ruleName,
  config: [true],
  customSyntax: 'postcss-scss',
  fix: true,

  accept: [
    {
      code: '.a { &:hover { } &:focus { } }',
      description: 'accepts a nested companion',
    },
  ],

  reject: [
    {
      code: '.a { &:hover { } }',
      fixed: '.a { &:hover, &:focus { } }',
      message: messages.expected('&:hover'),
      description: 'fixes a nested hover selector',
    },
    {
      code: '.a { &:focus { } } .b { &:hover { } }',
      fixed: '.a { &:focus { } } .b { &:hover, &:focus { } }',
      message: messages.expected('&:hover'),
      description: 'does not accept a nested companion from a different parent block',
    },
  ],
});
