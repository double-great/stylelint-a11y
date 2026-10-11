# media-prefers-reduced-motion

Require a `prefers-reduced-motion` override for transitions and animations. The `--fix` option adds the override.

## Why

Motion on screen can trigger nausea, dizziness, and migraine for people with vestibular disorders, and it distracts people with attention or cognitive disabilities. Operating systems expose a reduce-motion setting, and `prefers-reduced-motion` lets a stylesheet honour it. The rule asks that every `transition`, `animation`, or `animation-name` have a `none` override inside a reduce query.

## WCAG 2.2

- [2.3.3 Animation from Interactions (Level AAA)](https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions)
- [2.2.2 Pause, Stop, Hide (Level A)](https://www.w3.org/WAI/WCAG22/Understanding/pause-stop-hide) for animation that runs longer than five seconds
- [C39: Using the CSS reduce-motion query to prevent motion](https://www.w3.org/WAI/WCAG22/Techniques/css/C39)

## Sources

- [MDN: prefers-reduced-motion](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion)
- [WebKit: Responsive design for motion](https://webkit.org/blog/7551/responsive-design-for-motion/)

The override has to live in a query for people who asked for less motion. A `prefers-reduced-motion: no-preference` query does not count as an override, but motion declared only inside such a query is accepted. The override can be a sibling `@media` block or a block nested inside the rule.

Only the `transition`, `animation`, and `animation-name` properties are checked. Other longhands such as `transition-duration` and `animation-duration`, and `scroll-behavior`, are ignored. The `none` keyword is matched case-insensitively.

## Options

### true

The following patterns are considered violations:

```css
.foo {
  animation: 1s ease-in;
}
```

```css
.bar {
  animation-name: skew;
}
@media screen and (prefers-reduced-motion) {
  .bar {
    transition: none;
  }
}
```

The following patterns are _not_ considered violations:

```css
div {
  transition: none;
}
```

```css
.foo {
  transition: all 0.3s;
}
@media screen and (prefers-reduced-motion: reduce) {
  .foo {
    transition: none;
  }
}
```

```css
.bar {
  animation: slide 1s;
  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
}
```

With `--fix`, the first violation above becomes:

```css
@media screen and (prefers-reduced-motion: reduce) {
  .foo {
    animation: none;
  }
}
.foo {
  animation: 1s ease-in;
}
```
