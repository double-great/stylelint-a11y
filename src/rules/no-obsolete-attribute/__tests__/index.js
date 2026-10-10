import { messages, ruleName } from '../index.js';

testRule({
  ruleName,
  config: [true],

  accept: [
    {
      code: 'a { color: pink; }',
    },
    {
      code: 'a[href] { color: pink; }',
    },
    {
      code: '[data-link] { color: pink; }',
    },
    {
      code: '.body[link] { color: pink; }',
      description: 'ignores an attribute that is only obsolete on a specific element',
    },
  ],

  reject: [
    {
      code: 'body[link] { color: pink; }',
      message: messages.expected('body[link]'),
      line: 1,
      column: 1,
    },
    {
      code: 'a, img[datasrc] { color: pink; }',
      message: messages.expected('a, img[datasrc]'),
      line: 1,
      column: 1,
    },
    {
      code: 'img[align], a[name] { color: pink; }',
      message: messages.expected('img[align], a[name]'),
      line: 1,
      column: 1,
    },
    {
      code: 'body[link].old { color: pink; }',
      message: messages.expected('body[link].old'),
      line: 1,
      column: 1,
      description: 'rejects an obsolete attribute in a compound selector',
    },
    {
      code: 'div body[link] { color: pink; }',
      message: messages.expected('div body[link]'),
      line: 1,
      column: 1,
      description: 'rejects an obsolete attribute inside a descendant selector',
    },
    {
      code: '.drop[dropzone]:hover { color: pink; }',
      message: messages.expected('.drop[dropzone]:hover'),
      line: 1,
      column: 1,
      description: 'rejects an attribute that is obsolete on any element',
    },
    {
      code: 'a[href] IMG[DATASRC] { color: pink; }',
      message: messages.expected('a[href] IMG[DATASRC]'),
      line: 1,
      column: 1,
      description: 'rejects an uppercase obsolete attribute',
    },
  ],
});
