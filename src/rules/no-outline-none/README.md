# no-outline-none

Disallow outline clearing.

Why? [Because](https://www.w3.org/TR/2008/REC-WCAG20-20081211/#navigation-mechanisms-focus-visible)

**Sources:**

- [DON'T DO IT!](http://www.outlinenone.com/)
- [a11yproject](https://a11yproject.com/posts/never-remove-css-outlines/)
- [MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/outline)

## Options

### true

The following pattern is considered a violation:

```css
.foo:focus {
  outline: 0;
}
```

```css
.bar:focus {
  outline: none;
}
```

```css
.baz:focus {
  outline: none;
  border: transparent;
}
```

```css
.qux:focus {
  outline-style: none;
}
```

```css
.qux:focus {
  outline-width: 0;
}
```

```css
.qux:focus {
  outline-color: transparent;
}
```

```css
.quux:focus {
  outline: none;
  box-shadow: none;
}
```

A `border` or `box-shadow` only counts as an alternative when it is drawn with a visible color. Values such as `none`, `0`, and `transparent` do not.

```scss
.quux {
  .quuux:focus {
    outline: 0;
  }
}
```

The following patterns are _not_ considered violations:

```css
.foo {
  outline: 0;
}
```

```scss
$primary-color: #333;
.bar:focus {
  outline: 1px solid $primary-color;
}
```

```css
.baz:focus {
  outline: 1px solid #333;
}
```

```css
.quux:focus {
  outline: 0;
  border: 1px solid #000;
}
```

## Note

Stylelint's built-in [`declaration-property-value-disallowed-list`](https://stylelint.io/user-guide/rules/declaration-property-value-disallowed-list/) rule can also forbid these values, but it reports every `outline: none`, not only those on `:focus` selectors, and it does not accept a `border` or `box-shadow` alternative.

```json
{
  "declaration-property-value-disallowed-list": {
    "outline": ["none", "0"]
  }
}
```
