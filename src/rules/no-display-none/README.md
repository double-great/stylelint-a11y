# no-display-none

Sources that will help you do without `{ display: none; }` and hide the content:

- [CSS Tricks](https://css-tricks.com/places-its-tempting-to-use-display-none-but-dont/)
- [A11Y Project](https://a11yproject.com/posts/how-to-hide-content/)
- [WebAIM](https://webaim.org/techniques/css/invisiblecontent/)

A rule inside a media query that starts with `print` is not checked, because content hidden only when printing stays available on screen and to assistive technology.

## Options

### true

The following pattern is considered a violation:

```css
.foo {
  display: none;
}
```

The following patterns are _not_ considered violations:

```css
.foo {
  display: flex;
}
```
