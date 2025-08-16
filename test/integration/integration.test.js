/* eslint-disable no-redeclare */
/* global testRule */

import myPlugin from '../../src/index.js';
import recommendedConfig from '../../recommended.js';
import stylelint from 'stylelint';

describe('Integration Testing', () => {
  describe('Plugin Integration Tests', () => {
    it('should export an array of plugins', () => {
      expect(Array.isArray(myPlugin)).toBe(true);
      expect(myPlugin.length).toBeGreaterThan(0);
    });

    it('should have all rules properly namespaced', () => {
      myPlugin.forEach((plugin) => {
        expect(plugin.ruleName).toMatch(/^a11y\//);
        expect(plugin.rule).toBeDefined();
      });
    });

    it('should work with stylelint API directly', async () => {
      const result = await stylelint.lint({
        code: '.bar:focus { outline: none; }',
        config: {
          plugins: [myPlugin],
          rules: {
            'a11y/no-outline-none': true,
          },
        },
      });

      expect(result.errored).toBe(true);
      expect(result.results[0].warnings).toHaveLength(1);
      expect(result.results[0].warnings[0].rule).toBe('a11y/no-outline-none');
    });

    // Test each rule individually using testRule
    testRule({
      plugins: ['../../src/index.js'],
      ruleName: 'a11y/no-outline-none',
      config: [true],

      accept: [
        { code: 'a { color: red; }' },
        { code: '.baz:focus { outline: none; border-color: #333; }' },
      ],

      reject: [
        {
          code: '.bar:focus { outline: none; }',
          message: 'Unexpected using "outline" property in .bar:focus (a11y/no-outline-none)',
        },
      ],
    });

    testRule({
      plugins: ['../../src/index.js'],
      ruleName: 'a11y/content-property-no-static-value',
      config: [true],

      accept: [
        { code: ".foo::after { content: ''; }" },
        { code: '.bar::before { content: attr(aria-label); }' },
      ],

      reject: [
        {
          code: '.foo::before { content: "bar"; }',
          message:
            'Unexpected using "content" property in .foo::before (a11y/content-property-no-static-value)',
        },
      ],
    });

    testRule({
      plugins: ['../../src/index.js'],
      ruleName: 'a11y/font-size-is-readable',
      config: [true],

      accept: [{ code: 'a { font-size: 16px; }' }, { code: 'a { font-size: 1rem; }' }],

      reject: [
        {
          code: 'a { font-size: 10px; }',
          message: 'Expected a larger font-size in a (a11y/font-size-is-readable)',
        },
      ],
    });

    testRule({
      plugins: ['../../src/index.js'],
      ruleName: 'a11y/selector-pseudo-class-focus',
      config: [true],

      accept: [{ code: 'a:hover:focus { color: blue; }' }, { code: 'a:focus { color: blue; }' }],

      reject: [
        {
          code: 'a:hover { color: blue; }',
          message:
            'Expected that a:hover is used together with :focus pseudo-class (a11y/selector-pseudo-class-focus)',
        },
      ],
    });
  });

  describe('Configuration Tests', () => {
    it('should load recommended configuration', () => {
      expect(recommendedConfig).toBeDefined();
      expect(recommendedConfig.rules).toBeDefined();
      expect(Object.keys(recommendedConfig.rules)).toContain('a11y/media-prefers-reduced-motion');
      expect(Object.keys(recommendedConfig.rules)).toContain('a11y/no-outline-none');
      expect(Object.keys(recommendedConfig.rules)).toContain('a11y/selector-pseudo-class-focus');
    });

    it('should apply recommended rules', async () => {
      const result = await stylelint.lint({
        code: 'a:hover { color: blue; }',
        config: {
          plugins: [myPlugin],
          rules: recommendedConfig.rules,
        },
      });

      expect(result.errored).toBe(true);
      expect(
        result.results[0].warnings.some((w) => w.rule === 'a11y/selector-pseudo-class-focus')
      ).toBe(true);
    });

    it('should handle rule options', async () => {
      const result = await stylelint.lint({
        code: 'a { font-size: 14px; }',
        config: {
          plugins: [myPlugin],
          rules: {
            'a11y/font-size-is-readable': [true, { minSize: 15 }],
          },
        },
      });

      expect(result.errored).toBe(true);
      expect(result.results[0].warnings[0].rule).toBe('a11y/font-size-is-readable');
    });

    it('should handle disabled rules', async () => {
      const result = await stylelint.lint({
        code: '.bar:focus { outline: none; }',
        config: {
          plugins: [myPlugin],
          rules: {
            'a11y/no-outline-none': null,
          },
        },
      });

      expect(result.errored).toBe(false);
      expect(result.results[0].warnings).toHaveLength(0);
    });

    it('should respect inline disable comments', async () => {
      const result = await stylelint.lint({
        code: '/* stylelint-disable a11y/no-outline-none */ .bar:focus { outline: none; }',
        config: {
          plugins: [myPlugin],
          rules: {
            'a11y/no-outline-none': true,
          },
        },
      });

      expect(result.errored).toBe(false);
      expect(result.results[0].warnings).toHaveLength(0);
    });
  });

  describe('Multiple Rule Interaction Tests', () => {
    it('should handle multiple rules on same element', async () => {
      const result = await stylelint.lint({
        code: 'a:hover { outline: none; font-size: 10px; }',
        config: {
          plugins: [myPlugin],
          rules: {
            'a11y/no-outline-none': true,
            'a11y/font-size-is-readable': true,
            'a11y/selector-pseudo-class-focus': true,
          },
        },
      });

      expect(result.errored).toBe(true);
      const warnings = result.results[0].warnings;

      // Should have violations from font-size and selector-pseudo-class-focus
      // (no-outline-none only fires with :focus, not :hover)
      expect(warnings.some((w) => w.rule === 'a11y/no-outline-none')).toBe(false);
      expect(warnings.some((w) => w.rule === 'a11y/font-size-is-readable')).toBe(true);
      expect(warnings.some((w) => w.rule === 'a11y/selector-pseudo-class-focus')).toBe(true);
    });

    it('should handle overlapping pseudo-element rules', async () => {
      const result = await stylelint.lint({
        code: '.button::before { content: "Click me"; font-size: 10px; }',
        config: {
          plugins: [myPlugin],
          rules: {
            'a11y/content-property-no-static-value': true,
            'a11y/font-size-is-readable': true,
          },
        },
      });

      expect(result.errored).toBe(true);
      const warnings = result.results[0].warnings;

      // Should detect both issues
      expect(warnings.some((w) => w.rule === 'a11y/content-property-no-static-value')).toBe(true);
      expect(warnings.some((w) => w.rule === 'a11y/font-size-is-readable')).toBe(true);
    });

    it('should handle fixable rules together', async () => {
      const result = await stylelint.lint({
        code: `
          .animated { animation: slide 1s; }
          a:hover { color: blue; }
        `,
        config: {
          plugins: [myPlugin],
          rules: {
            'a11y/media-prefers-reduced-motion': true,
            'a11y/selector-pseudo-class-focus': true,
          },
        },
        fix: true,
      });

      const output = result.results[0]._postcssResult.root.toString();

      // Should have added media query for reduced motion
      expect(output).toContain('@media');
      expect(output).toContain('prefers-reduced-motion');

      // Should have added :focus alongside :hover
      expect(output).toContain(':focus');
    });

    it('should handle complex selectors with multiple rules', async () => {
      const result = await stylelint.lint({
        code: `
          .container .button:hover::before {
            content: "→";
            outline: none;
            font-size: 10px;
          }
        `,
        config: {
          plugins: [myPlugin],
          rules: {
            'a11y/content-property-no-static-value': true,
            'a11y/no-outline-none': true,
            'a11y/font-size-is-readable': true,
            'a11y/selector-pseudo-class-focus': true,
          },
        },
      });

      expect(result.errored).toBe(true);
      const warnings = result.results[0].warnings;

      // Should detect content and font-size issues, but not outline (no :focus)
      expect(warnings.some((w) => w.rule === 'a11y/content-property-no-static-value')).toBe(true);
      expect(warnings.some((w) => w.rule === 'a11y/font-size-is-readable')).toBe(true);
      expect(warnings.some((w) => w.rule === 'a11y/selector-pseudo-class-focus')).toBe(true);
    });

    it('should handle large CSS efficiently', async () => {
      let largeCss = '';

      for (let i = 0; i < 25; i++) {
        largeCss += `.class-${i}:hover { outline: none; font-size: 10px; }\n`;
      }

      const startTime = Date.now();
      const result = await stylelint.lint({
        code: largeCss,
        config: {
          plugins: [myPlugin],
          rules: {
            'a11y/no-outline-none': true,
            'a11y/font-size-is-readable': true,
            'a11y/selector-pseudo-class-focus': true,
          },
        },
      });
      const duration = Date.now() - startTime;

      expect(result.errored).toBe(true);
      expect(duration).toBeLessThan(1000); // Should complete within 1 second
      expect(result.results[0].warnings.length).toBeGreaterThanOrEqual(50); // Should detect all violations
    });

    it('should handle empty CSS without errors', async () => {
      const result = await stylelint.lint({
        code: '',
        config: {
          plugins: [myPlugin],
          rules: {
            'a11y/no-outline-none': true,
            'a11y/font-size-is-readable': true,
          },
        },
      });

      expect(result.errored).toBe(false);
      expect(result.results[0].warnings).toHaveLength(0);
    });

    it('should handle CSS with comments', async () => {
      const result = await stylelint.lint({
        code: `
          /* This is a test */
          .bar:focus { 
            /* Remove outline */
            outline: none; 
          }
        `,
        config: {
          plugins: [myPlugin],
          rules: {
            'a11y/no-outline-none': true,
          },
        },
      });

      expect(result.errored).toBe(true);
      expect(result.results[0].warnings[0].rule).toBe('a11y/no-outline-none');
    });
  });

  describe('Edge Cases and Error Handling', () => {
    it('should handle malformed CSS gracefully', async () => {
      const result = await stylelint.lint({
        code: 'a { color: }', // Malformed CSS
        config: {
          plugins: [myPlugin],
          rules: {
            'a11y/no-outline-none': true,
          },
        },
      });

      // Should not crash even with malformed CSS
      expect(result).toBeDefined();
      expect(result.results).toBeDefined();
      expect(result.results[0]).toBeDefined();
    });

    it('should handle CSS with vendor prefixes', async () => {
      const result = await stylelint.lint({
        code: `
          .button:focus {
            -webkit-outline: none;
            -moz-outline: none;
            outline: none;
          }
        `,
        config: {
          plugins: [myPlugin],
          rules: {
            'a11y/no-outline-none': true,
          },
        },
      });

      expect(result.errored).toBe(true);
      expect(result.results[0].warnings.some((w) => w.rule === 'a11y/no-outline-none')).toBe(true);
    });

    it('should handle nested media queries', async () => {
      const result = await stylelint.lint({
        code: `
          @media screen {
            @media (min-width: 768px) {
              .button:focus { outline: none; }
            }
          }
        `,
        config: {
          plugins: [myPlugin],
          rules: {
            'a11y/no-outline-none': true,
          },
        },
      });

      expect(result.errored).toBe(true);
      expect(result.results[0].warnings[0].rule).toBe('a11y/no-outline-none');
    });
  });
});
