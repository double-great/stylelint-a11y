import { messages, ruleName } from '../index.js';

testRule({
  ruleName,
  config: [true],

  accept: [
    {
      code: '.foo { outline: 0; }',
    },
    {
      code: '$primary-color: #333; .bar:focus { outline: 1px solid $primary-color; }',
    },
    {
      code: '.baz:focus { outline: none; border-color: #333; }',
    },
    {
      code: '.quux:focus { outline: 0; border: 1px solid #000; }',
    },
    {
      code: '.quuux:focus { outline: none; box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25); }',
    },
    {
      code: '.longhand:focus { outline-style: none; box-shadow: 0 0 0 2px #000; }',
      description: 'accepts a removed outline-style when box-shadow provides an alternative',
    },
    {
      code: '.longhand:focus { outline-width: 2px; outline-color: #333; }',
      description: 'accepts longhand properties that keep the outline visible',
    },
  ],

  reject: [
    {
      code: '.foo1:focus { outline: none; } .foo2:focus { outline: 1px solid red; }',
      message: messages.expected('.foo1:focus'),
      line: 1,
      column: 1,
    },
    {
      code: '.bar:focus { outline: none; }',
      message: messages.expected('.bar:focus'),
      line: 1,
      column: 1,
    },
    {
      code: '.baz:focus { outline: none; border: transparent; }',
      message: messages.expected('.baz:focus'),
      line: 1,
      column: 1,
    },
    {
      code: '.quux { .quuux:focus { outline: 0; } }',
      message: messages.expected('.quuux:focus'),
      line: 1,
      column: 9,
    },
    {
      code: '.longhand:focus { outline-style: none; }',
      message: messages.expected('.longhand:focus'),
      line: 1,
      column: 1,
      description: 'rejects outline-style: none',
    },
    {
      code: '.longhand:focus { outline-width: 0; }',
      message: messages.expected('.longhand:focus'),
      line: 1,
      column: 1,
      description: 'rejects outline-width: 0',
    },
    {
      code: '.longhand:focus { outline-color: transparent; }',
      message: messages.expected('.longhand:focus'),
      line: 1,
      column: 1,
      description: 'rejects outline-color: transparent',
    },
    {
      code: '.longhand:focus { outline-color: rgba(0, 0, 0, 0); border: transparent; }',
      message: messages.expected('.longhand:focus'),
      line: 1,
      column: 1,
      description: 'rejects a fully transparent outline-color without an alternative',
    },
    {
      code: '.alt:focus { outline: none; box-shadow: none; }',
      message: messages.expected('.alt:focus'),
      line: 1,
      column: 1,
      description: 'does not accept box-shadow: none as an alternative',
    },
    {
      code: '.alt:focus { outline: none; border: 0; }',
      message: messages.expected('.alt:focus'),
      line: 1,
      column: 1,
      description: 'does not accept border: 0 as an alternative',
    },
    {
      code: '.alt:focus { outline: none; border: none; }',
      message: messages.expected('.alt:focus'),
      line: 1,
      column: 1,
      description: 'does not accept border: none as an alternative',
    },
    {
      code: '.alt:focus { outline: 1px solid transparent; }',
      message: messages.expected('.alt:focus'),
      line: 1,
      column: 1,
      description: 'treats a transparent outline shorthand as a removed outline',
    },
  ],
});
