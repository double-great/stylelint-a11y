# no-display-none

Disallow hiding content with `display: none`.

## Why

`display: none` removes content from the accessibility tree as well as from the screen. That is right when the content is hidden from everyone, but it is often used where the intent was to hide something visually while keeping it for screen reader users, such as a label, a heading, or skip link text. A visually hidden utility class keeps the content available; `display: none` does not.

## WCAG 2.2

No success criterion forbids `display: none`. The barrier appears when content that assistive technology needs is hidden along with the visual version:

- [1.3.1 Info and Relationships (Level A)](https://www.w3.org/WAI/WCAG22/Understanding/info-and-relationships)
- [4.1.2 Name, Role, Value (Level A)](https://www.w3.org/WAI/WCAG22/Understanding/name-role-value) when a hidden element was meant to supply a name

## Sources

- [The A11Y Project: How to hide content](https://www.a11yproject.com/posts/how-to-hide-content/)
- [WebAIM: Invisible content just for screen reader users](https://webaim.org/techniques/css/invisiblecontent/)
- [CSS-Tricks: Places it is tempting to use display: none, but do not](https://css-tricks.com/places-its-tempting-to-use-display-none-but-dont/)

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

```css
@media print {
  .foo {
    display: none;
  }
}
```
