# content-property-no-static-value

Disallow static text in the `content` property.

## Why

Text inserted with `content` lives only in CSS. It is not in the document, so it is missing from the DOM, from search, from translation, and from copy and paste. Screen reader support for generated content is inconsistent, and a glyph inserted as an icon has no alternative text unless the slash syntax supplies one.

## WCAG 2.2

- [1.3.1 Info and Relationships (Level A)](https://www.w3.org/WAI/WCAG22/Understanding/info-and-relationships)
- [1.1.1 Non-text Content (Level A)](https://www.w3.org/WAI/WCAG22/Understanding/non-text-content)
- [F87: Failure due to inserting non-decorative generated content](https://www.w3.org/WAI/WCAG22/Techniques/failures/F87)

## Sources

- [MDN: content](https://developer.mozilla.org/en-US/docs/Web/CSS/content)
- [Léonie Watson: Accessibility support for CSS generated content](https://tink.uk/accessibility-support-for-css-generated-content/)

Values of `none` and `normal` are always accepted because they produce no content. A value that ends with a slash and a string, such as `content: "\2605" / "star"`, is accepted because the string gives the generated content alternative text. Pseudo-element names are matched case-insensitively.

## Options

### true

The rule is enabled with the default allowed values `['""', "''", 'attr(aria-label)']`.

The following pattern is considered a violation:

```css
.foo::before {
  content: 'Price: $50';
}
```

The following patterns are _not_ considered violations:

```css
.foo {
  content: '';
}
```

```css
.foo {
  content: attr(aria-label);
}
```

```css
.foo::before {
  content: '\2605' / 'star';
}
```

## Optional secondary options

### `allowedValues: string[]`

Default: `['""', "''", 'attr(aria-label)']`. The exact `content` values the rule accepts.

```json
{
  "a11y/content-property-no-static-value": [
    true,
    { "allowedValues": ["''", "\"\"", "attr(title)", "counter(section)"] }
  ]
}
```
