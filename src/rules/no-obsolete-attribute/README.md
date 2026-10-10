# no-obsolete-attribute

Disallow obsolete attribute using.

**Sources:**

- [W3G Obsolete features](https://www.w3.org/TR/html5/obsolete.html#obsolete)
- [W3C Non-conforming features](https://w3c.github.io/html/obsolete.html#non-conforming-features)
- [W3G Features removed](https://www.w3.org/TR/html52/changes.html#features-removed)

A selector inside `:not()` is ignored because it names an element the rule does not style.

## Options

### true

The following pattern is considered a violation:

```css
body[link] {
  background-color: pink;
}
```

```css
a,
img[datasrc] {
  color: pink;
}
```

```css
img[align],
a[name] {
  color: pink;
}
```

```css
div body[link].old {
  color: pink;
}
```
