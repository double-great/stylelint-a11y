# media-prefers-color-scheme

Require a `prefers-color-scheme` override for colors.

## Why

People set a dark or light scheme at the operating system level for light sensitivity, migraine, low vision, or comfort. A stylesheet that sets colors without honouring that preference forces its own scheme on them. The rule asks that every rule setting a color have a matching rule inside a `prefers-color-scheme` query.

## WCAG 2.2

No success criterion requires a dark theme. Whichever scheme is shown, it has to meet the contrast criteria:

- [1.4.3 Contrast (Minimum) (Level AA)](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum)
- [1.4.11 Non-text Contrast (Level AA)](https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast)

## Sources

- [MDN: prefers-color-scheme](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-color-scheme)
- [Media Queries Level 5: prefers-color-scheme](https://drafts.csswg.org/mediaqueries-5/#prefers-color-scheme)

A color set through a custom property, such as `color: var(--text)`, is not checked because the theme lives where the property is defined. A `@media (prefers-color-scheme)` block nested inside the rule also satisfies the rule. The override selector is matched regardless of whitespace.

## Options

### true

The following patterns are considered violations:

```css
.foo {
  color: red;
}
```

```css
.bar {
  color: red;
}
.baz {
  background-color: red;
}
@media screen and (prefers-color-scheme: dark) {
  .baz {
    background-color: white;
  }
}
```

```css
.foo {
  color: red;
}
@media screen and (prefers-color-scheme: dark) {
  .foo {
    background-color: red;
  }
}
```

The following patterns are _not_ considered violations:

```css
.foo {
  color: red;
}
@media screen and (prefers-color-scheme: dark) {
  .foo {
    color: white;
  }
}
```

```css
.bar {
  background-color: white;
}
@media screen and (prefers-color-scheme: dark) {
  .bar {
    background-color: gray;
  }
}
```

```css
.baz {
  color: var(--text);
}
```
