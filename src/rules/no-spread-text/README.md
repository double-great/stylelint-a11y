# no-spread-text

Require text `max-width` between 45ch and 80ch.

## Why

Long lines make it hard to find the start of the next line, and very short lines break the reading rhythm with constant returns. Both slow down people with dyslexia, low vision, and cognitive disabilities. A measure of 45 to 80 characters is the typographic range that reads comfortably.

## WCAG 2.2

- [1.4.8 Visual Presentation (Level AAA)](https://www.w3.org/WAI/WCAG22/Understanding/visual-presentation) asks for a width of no more than 80 characters. The 45ch minimum is a typographic convention, not a WCAG requirement.

## Sources

- [Manuel Matuzović: Writing CSS with accessibility in mind](https://medium.com/@matuzo/writing-css-with-accessibility-in-mind-8514a0007939)

The rule uses heuristics to decide which rules style text, so expect some misses. Only `max-width` values in `ch` are checked, and only in rules that also set a text property such as `color`, `line-height`, or `text-align`. `font-size` alone does not mark a rule as text, and `width` and `max-inline-size` are ignored.

## Options

### true

The rule is enabled with a 45ch minimum and an 80ch maximum.

The following patterns are considered violations:

```css
.foo {
  text-transform: lowercase;
  max-width: 40ch;
}
```

```css
.foo {
  line-height: 1.8;
  max-width: 82ch;
}
```

The following patterns are _not_ considered violations:

```css
.foo {
  max-width: 65ch;
}
```

```css
.foo {
  max-width: 82ch;
}
```

```css
.foo {
  max-width: 100px;
}
```

## Optional secondary options

### `minWidth: number`

Default: `45`. The smallest accepted `max-width` in `ch`.

### `maxWidth: number`

Default: `80`. The largest accepted `max-width` in `ch`.

```json
{
  "a11y/no-spread-text": [true, { "minWidth": 30, "maxWidth": 60 }]
}
```
