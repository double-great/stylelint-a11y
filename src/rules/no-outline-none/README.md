# no-outline-none

Disallow removing the focus outline without an alternative.

## Why

The outline is how keyboard users see where they are. Removing it on `:focus` with nothing in its place leaves a sighted keyboard user guessing which control is active. Replacing it with a visible border or box shadow is fine; removing it is not.

## WCAG 2.2

- [2.4.7 Focus Visible (Level AA)](https://www.w3.org/WAI/WCAG22/Understanding/focus-visible)
- [2.4.13 Focus Appearance (Level AAA)](https://www.w3.org/WAI/WCAG22/Understanding/focus-appearance)
- [F78: Failure due to styling element outlines and borders in a way that removes or renders non-visible the visual focus indicator](https://www.w3.org/WAI/WCAG22/Techniques/failures/F78)

## Sources

- [The A11Y Project: Never remove CSS outlines](https://www.a11yproject.com/posts/never-remove-css-outlines/)
- [MDN: outline](https://developer.mozilla.org/en-US/docs/Web/CSS/outline)
- [Sara Soueidan: A guide to designing accessible, WCAG-conformant focus indicators](https://www.sarasoueidan.com/blog/focus-indicators/)

Only selectors that contain `:focus` are checked. The rule reports the `outline` shorthand set to `none`, `0`, or a transparent color, and the `outline-style`, `outline-width`, and `outline-color` longhands set to the equivalent. A `border` or `box-shadow` in the same rule counts as an alternative only when it is drawn with a visible color; `none`, `0`, and `transparent` do not.

## Options

### true

The following patterns are considered violations:

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
