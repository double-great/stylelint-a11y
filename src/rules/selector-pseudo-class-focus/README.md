# selector-pseudo-class-focus

Checks the presence of a pseudo-class for selectors with `:hover`.

```css
a:hover,
a:focus {
}
```

This rule considers the `:focus` and `:focus-visible` pseudo-classes defined in the CSS Specifications. Either one satisfies the rule as a companion to `:hover`.
The `--fix` option on the command line can automatically fix all of the problems reported by this rule by adding a `:focus` variant of the selector.

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
a:hover {
}
a:focus-visible {
}
```
