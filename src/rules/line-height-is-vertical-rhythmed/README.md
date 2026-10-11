# line-height-is-vertical-rhythmed

Require line heights that fit a baseline grid.

## Why

Tight line spacing makes it hard to track from the end of one line to the start of the next, which affects people with dyslexia, low vision, and cognitive disabilities. A consistent baseline grid also keeps spacing predictable across a page, so text does not get cramped in one component and loose in another.

## WCAG 2.2

- [1.4.8 Visual Presentation (Level AAA)](https://www.w3.org/WAI/WCAG22/Understanding/visual-presentation) asks for line spacing of at least 1.5 within paragraphs, which is the default minimum relative value
- [1.4.12 Text Spacing (Level AA)](https://www.w3.org/WAI/WCAG22/Understanding/text-spacing)

## Sources

- [Zell Liew: Why is vertical rhythm an important typography practice?](https://zellwk.com/blog/why-vertical-rhythms/)

Only `px` values and unitless numbers are checked. A pixel value has to be a multiple of the baseline grid, and a unitless number has to meet the minimum relative line height. Percentages, `em` and `rem` values, keywords, and the `font` shorthand are ignored.

## Options

### true

The rule is enabled with a 24px baseline grid and a 1.5 minimum relative line height.

The following patterns are considered violations:

```css
.foo {
  line-height: 12px;
}
```

```css
.foo {
  line-height: 1.3;
}
```

```css
.foo {
  line-height: 50px;
}
```

The following patterns are _not_ considered violations:

```css
.foo {
  line-height: 24px;
}
```

```css
.foo {
  line-height: 1.6;
}
```

```css
.foo {
  line-height: 48px;
}
```

## Optional secondary options

### `baselineGrid: number`

Default: `24`. Pixel line heights have to be a multiple of this value. It has to be a positive number.

### `minRelativeLineHeight: number`

Default: `1.5`. Unitless line heights have to be at least this value. It has to be a positive number.

```json
{
  "a11y/line-height-is-vertical-rhythmed": [
    true,
    { "baselineGrid": 20, "minRelativeLineHeight": 1.3 }
  ]
}
```
