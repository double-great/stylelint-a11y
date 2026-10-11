# no-obsolete-attribute

Disallow selectors that target obsolete HTML attributes.

## Why

A selector such as `body[link]` or `img[align]` only matches if the markup still uses the attribute. Those attributes are obsolete in the HTML Living Standard, and most of them carry presentation in the markup instead of structure, which is what the stylesheet should own. Flagging the selector surfaces the markup that needs updating.

## WCAG 2.2

No success criterion names obsolete attributes. Presentational attributes work against:

- [1.3.1 Info and Relationships (Level A)](https://www.w3.org/WAI/WCAG22/Understanding/info-and-relationships)

## Sources

- [HTML Living Standard: Obsolete features](https://html.spec.whatwg.org/multipage/obsolete.html)

Obsolete attributes are matched inside compound and descendant selectors. A selector inside `:not()` is ignored because it names an element the rule does not style.

## Options

### true

The following patterns are considered violations:

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

The following pattern is _not_ considered a violation:

```css
li:not([type]) {
  color: pink;
}
```
