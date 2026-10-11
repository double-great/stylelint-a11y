# selector-pseudo-class-focus

Require a `:focus` or `:focus-visible` companion for `:hover` selectors. The `--fix` option adds a `:focus` variant of the selector.

## Why

A hover style tells a mouse user that something is interactive and shows which element they are on. Keyboard users never hover, so the same affordance has to appear on focus or they get nothing. Every `:hover` selector should have a `:focus` or `:focus-visible` counterpart somewhere in the stylesheet.

## WCAG 2.2

- [2.1.1 Keyboard (Level A)](https://www.w3.org/WAI/WCAG22/Understanding/keyboard)
- [2.4.7 Focus Visible (Level AA)](https://www.w3.org/WAI/WCAG22/Understanding/focus-visible)

## Sources

- [MDN: :focus-visible](https://developer.mozilla.org/en-US/docs/Web/CSS/:focus-visible)
- [Sara Soueidan: A guide to designing accessible, WCAG-conformant focus indicators](https://www.sarasoueidan.com/blog/focus-indicators/)

Either `:focus` or `:focus-visible` satisfies the rule as the companion to `:hover`. The companion can appear anywhere in the stylesheet, and every selector in a list that uses `:hover` needs one. `:hover` is matched case-insensitively, and a `:hover` inside `:not()` is ignored because it does not style the hovered element.

Selectors are compared as text, so a nested `&:hover` needs a nested `&:focus` or `&:focus-visible` companion in the same parent block rather than a full selector written elsewhere.

## Options

### true

The following pattern is considered a violation:

```css
a:hover {
}
```

The following patterns are _not_ considered violations:

```css
a:hover,
a:focus {
}
```

```css
a:hover {
}
a:focus {
}
```

```css
a:hover,
a:focus-visible {
}
```

```css
@media (hover: hover) {
  a:hover {
  }
}
a:focus-visible {
}
```

With `--fix`, the violation above becomes:

```css
a:hover,
a:focus {
}
```
