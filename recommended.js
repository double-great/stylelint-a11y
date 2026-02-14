/** @type {import('stylelint').Config} */

export default {
  plugins: ['@double-great/stylelint-a11y'],

  rules: {
    'a11y/media-prefers-reduced-motion': true,
    'a11y/no-outline-none': true,
    'a11y/selector-pseudo-class-focus': true,
  },
};
