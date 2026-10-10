# content-property-no-static-value

Disallow CSS generated content except aria-label attribute content and empty strings.

**Sources:**

- [MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/content)
- [tink](https://tink.uk/accessibility-support-for-css-generated-content//)

Values of `none` and `normal` are always accepted because they produce no content. A value that ends with a slash and a string, such as `content: "\2605" / "star"`, is accepted because the string gives the generated content alternative text.

## Options

### true

The rule is enabled with default allowed values: `['""', "''", 'attr(aria-label)']`.

### { allowedValues: string[] }

- `allowedValues` (default: `['""', "''", 'attr(aria-label)']`): Array of allowed content values

#### Example configuration

```javascript
{
  "a11y/content-property-no-static-value": [true, {
    "allowedValues": ["''", '""', "attr(title)", "counter(section)"]
  }]
}
```

### Examples

#### ✓ Default configuration (`true`)

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
