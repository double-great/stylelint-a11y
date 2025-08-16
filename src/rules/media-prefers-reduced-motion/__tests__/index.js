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
      code: '@media (hover: hover) { &:hover, &:focus { background-color: blue; transition: all 0.15s; } @media screen and (prefers-reduced-motion: reduce) { &:hover, &:focus { background-color: blue; transition: none; } } }',
      description: 'accepts nested media query with prefers-reduced-motion already present',
    },
    {
      code: '@mixin safe-hover { @media (hover: hover) { &:hover { transition: all 0.15s; } @media screen and (prefers-reduced-motion: reduce) { &:hover { transition: none; } } } }',
      description: 'accepts SCSS mixin with nested media query already present',
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
      code: '@media (hover: hover) { &:hover { transition: all 0.15s; } }',
      fixed:
        '@media (hover: hover) { &:hover { transition: all 0.15s;@media screen and (prefers-reduced-motion: reduce) {\n&:hover { transition: none;\n}\n} } }',
      message: messages.expected('&:hover'),
      description: 'should add prefers-reduced-motion when not present in nested media query',
    },
  ],
});
