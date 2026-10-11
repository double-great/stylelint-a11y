# no-text-align-justify

Disallow `text-align: justify`.

## Why

Justified text stretches the spaces between words to fill each line, which creates uneven gaps and the "rivers" of white space that run down a paragraph. People with dyslexia and other reading disabilities lose their place in those gaps. Browsers do not hyphenate or adjust letter spacing well enough to avoid them.

## WCAG 2.2

- [1.4.8 Visual Presentation (Level AAA)](https://www.w3.org/WAI/WCAG22/Understanding/visual-presentation) asks that text not be justified
- [G169: Aligning text on only one side](https://www.w3.org/WAI/WCAG22/Techniques/general/G169)

## Sources

- [Design for Hackers: Why you should never justify text](https://designforhackers.com/blog/justify-text-html-css/)

Only the `text-align` property is checked. `text-align-last` and `text-justify` are ignored.

## Options

### true

The following pattern is considered a violation:

```css
.foo {
  text-align: justify;
}
```

The following patterns are _not_ considered violations:

```css
.foo {
  text-align: center;
}
```

```css
.foo {
  text-align: left;
}
```

```css
.foo {
  text-align: start;
}
```

## Note

Stylelint's built-in [`declaration-property-value-disallowed-list`](https://stylelint.io/user-guide/rules/declaration-property-value-disallowed-list/) can forbid the same value. This rule exists so the check travels with the rest of the accessibility configuration.

```json
{
  "declaration-property-value-disallowed-list": { "text-align": ["justify"] }
}
```
