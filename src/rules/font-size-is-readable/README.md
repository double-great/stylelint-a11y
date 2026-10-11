# font-size-is-readable

Disallow font sizes smaller than 15px.

## Why

Small type is hard to read for people with low vision and for anyone on a small or distant screen. Browser zoom helps, but a readable default means people do not have to zoom in the first place, and 200% of a tiny size is still small.

## WCAG 2.2

WCAG 2.2 sets no minimum font size. The rule supports these criteria by keeping the default size readable before any zoom:

- [1.4.4 Resize Text (Level AA)](https://www.w3.org/WAI/WCAG22/Understanding/resize-text)
- [1.4.8 Visual Presentation (Level AAA)](https://www.w3.org/WAI/WCAG22/Understanding/visual-presentation)

## Sources

- [MDN: font-size](https://developer.mozilla.org/en-US/docs/Web/CSS/font-size)

Only `px` and `pt` values of the `font-size` property are checked. The `font` shorthand, relative units such as `rem` and `em`, keyword sizes, and preprocessor variables are ignored. The default threshold of 15px equals 11.25pt.

## Options

### true

The following pattern is considered a violation:

```css
.foo {
  font-size: 10px;
}
```

The following patterns are _not_ considered violations:

```css
.foo {
  font-size: 15px;
}
```

```css
.foo {
  font-size: 1em;
}
```

## Optional secondary options

### `thresholdInPixels: number`

Default: `15`. Sizes below this many pixels are reported. The value has to be a positive number.

Given `16`, the following pattern is considered a violation:

```css
.foo {
  font-size: 15px;
}
```

## Note

To require relative units instead of a minimum size, use stylelint's [`declaration-property-unit-disallowed-list`](https://stylelint.io/user-guide/rules/declaration-property-unit-disallowed-list/):

```json
{
  "declaration-property-unit-disallowed-list": { "font-size": ["px", "pt"] }
}
```
