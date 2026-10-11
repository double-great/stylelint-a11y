# no-obsolete-element

Disallow selectors that target obsolete HTML elements.

## Why

A selector such as `blink` or `center` only matches if the markup still uses the element. Those elements are obsolete in the HTML Living Standard, and most of them, such as `font`, `center`, and `marquee`, carry presentation instead of meaning. Flagging the selector surfaces the markup that needs updating.

## WCAG 2.2

No success criterion names obsolete elements. Presentational elements work against:

- [1.3.1 Info and Relationships (Level A)](https://www.w3.org/WAI/WCAG22/Understanding/info-and-relationships)
- [2.2.2 Pause, Stop, Hide (Level A)](https://www.w3.org/WAI/WCAG22/Understanding/pause-stop-hide) in the case of `blink` and `marquee`

## Sources

- [HTML Living Standard: Obsolete features](https://html.spec.whatwg.org/multipage/obsolete.html)

Obsolete elements are matched inside compound and descendant selectors. A selector inside `:not()` is ignored because it names an element the rule does not style.

## Options

### true

The following patterns are considered violations:

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

The following pattern is _not_ considered a violation:

```css
div:not(center) {
  color: pink;
}
```
