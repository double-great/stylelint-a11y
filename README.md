# @double-great/stylelint-a11y

## Installation and usage

```bash
npm i --save-dev stylelint @double-great/stylelint-a11y
```

Create the `.stylelintrc.json` config file (or open the existing one), add `stylelint-a11y` to the plugins array and the rules you need to the rules list. All rules from stylelint-a11y need to be namespaced with `a11y`.

Please refer to [stylelint docs](https://stylelint.io/user-guide/) for the detailed info on using this linter.

## Rules

| Rule ID                                                                                    | Description                                                             |
| :----------------------------------------------------------------------------------------- | :---------------------------------------------------------------------- | -------------------- |
| [content-property-no-static-value](./src/rules/content-property-no-static-value/README.md) | Disallow unaccessible CSS generated content in pseudo-elements          |
| [font-size-is-readable](./src/rules/font-size-is-readable/README.md)                       | Disallow font sizes less than `15px`                                    |
| [line-height-is-vertical-rhythmed](./src/rules/line-height-is-vertical-rhythmed/README.md) | Disallow not vertical rhythmed `line-height`                            |
| [media-prefers-reduced-motion](./src/rules/media-prefers-reduced-motion/README.md)         | Require certain styles if the animation or transition in media features | Recommended, Fixable |
| [media-prefers-color-scheme](./src/rules/media-prefers-color-scheme/README.md)             | Require implementation of certain styles for selectors with colors.     |
| [no-display-none](./src/rules/no-display-none/README.md)                                   | Disallow content hiding with `display: none` property                   |
| [no-obsolete-attribute](./src/rules/no-obsolete-attribute/README.md)                       | Disallow obsolete attribute using                                       |
| [no-obsolete-element](./src/rules/no-obsolete-element/README.md)                           | Disallow obsolete selectors using                                       |
| [no-spread-text](./src/rules/no-spread-text/README.md)                                     | Require width of text in a comfortable range                            |
| [no-outline-none](./src/rules/no-outline-none/README.md)                                   | Disallow outline clearing                                               | Recommended          |
| [no-text-align-justify](./src/rules/no-text-align-justify/README.md)                       | Disallow content with `text-align: justify`                             |
| [selector-pseudo-class-focus](./src/rules/selector-pseudo-class-focus/README.md)           | Require or disallow a pseudo-element to the selectors with `:hover`     | Recommended, Fixable |

## Recommended config

Add recommended configuration by adding the following to `extends` in your stylelint configuration:

```
@double-great/stylelint-a11y/recommended
```

This shareable config contains the following:

```json
{
  "plugins": ["@double-great/stylelint-a11y"],
  "rules": {
    "a11y/media-prefers-reduced-motion": true,
    "a11y/no-outline-none": true,
    "a11y/selector-pseudo-class-focus": true
  }
}
```

Since it adds stylelint-a11y to `plugins`, you don't have to do this yourself when extending this config.

## Help out

There work on the plugin's rules is still in progress, so if you feel like it, you're welcome to help out in any of these (the plugin follows stylelint guidelines so most part of this is based on its docs):

- Create, enhance, and debug rules (see stylelint's guide to "[Working on rules](https://github.com/stylelint/stylelint/blob/main/docs/developer-guide/rules.md)").
- Improve documentation.
- Chime in on any open issue or pull request.
- Open new issues about your ideas on new rules, or for how to improve the existing ones, and pull requests to show us how your idea works.
- Add new tests to absolutely anything.
- Work on improving performance of rules.
- Contribute to [stylelint](https://github.com/stylelint/stylelint)
- Spread the word.

We communicate via [issues](https://github.com/double-great/stylelint-a11y/issues) and [pull requests](https://github.com/double-great/stylelint-a11y/pulls).

There is also [stackoverflow](https://stackoverflow.com/questions/tagged/stylelint), which would be the preferred QA forum.
