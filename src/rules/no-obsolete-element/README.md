# no-obsolete-element

Disallow selectors that target obsolete HTML elements.

**Sources:**

- [W3G Obsolete features](https://www.w3.org/TR/html5/obsolete.html#obsolete)
- [W3G Features removed](https://www.w3.org/TR/html52/changes.html#features-removed)

A selector inside `:not()` is ignored because it names an element the rule does not style.

## Options

### true

The following pattern is considered a violation:

```css
blink {
  color: pink;
}
```

```css
div center.active {
  color: pink;
}
```
