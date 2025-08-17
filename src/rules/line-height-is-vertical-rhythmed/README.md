# line-height-is-vertical-rhythmed

Disallow not vertical rhythmed line-height.

**Sources:**

- [Zell Liew](https://zellwk.com/blog/why-vertical-rhythms/)

## Options

### true

The rule is enabled with default values (24px baseline grid, 1.5 minimum relative line-height).

### { baselineGrid: number, minRelativeLineHeight: number }

- `baselineGrid` (default: `24`): Baseline grid value in pixels for pixel-based line-heights
- `minRelativeLineHeight` (default: `1.5`): Minimum allowed relative line-height value

#### Example configuration

```javascript
{
  "a11y/line-height-is-vertical-rhythmed": [true, { "baselineGrid": 20, "minRelativeLineHeight": 1.3 }]
}
```

### Examples

#### ✓ Default configuration (`true`)

The following pattern is considered a violation:

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
