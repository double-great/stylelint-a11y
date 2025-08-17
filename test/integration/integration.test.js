import { getWarnings, passesLint, ruleTriggersOn, testCSS } from '../helpers/simple-test-utils.js';

import myPlugin from '../../src/index.js';
import recommendedConfig from '../../recommended.js';

describe('Integration Testing', () => {
  describe('Plugin Integration', () => {
    it('should export plugin array', () => {
      expect(Array.isArray(myPlugin)).toBe(true);
      expect(myPlugin.length).toBeGreaterThan(0);
    });

    it('should have properly namespaced rules', () => {
      myPlugin.forEach((plugin) => {
        expect(plugin.ruleName).toMatch(/^a11y\//);
        expect(plugin.rule).toBeDefined();
      });
    });

    it('should export meta objects for all rules', () => {
      myPlugin.forEach((plugin) => {
        expect(plugin.meta).toBeDefined();
        expect(plugin.meta.url).toBeDefined();
        expect(plugin.meta.url).toMatch(/^https:\/\/github\.com\/double-great\/stylelint-a11y/);
        expect(typeof plugin.meta.fixable).toBe('boolean');
        expect(typeof plugin.meta.deprecated).toBe('boolean');
      });
    });

    it('should correctly identify fixable rules', () => {
      const fixableRules = myPlugin.filter((plugin) => plugin.meta.fixable);
      const fixableRuleNames = fixableRules.map((plugin) => plugin.ruleName);

      expect(fixableRuleNames).toContain('a11y/media-prefers-reduced-motion');
      expect(fixableRuleNames).toContain('a11y/selector-pseudo-class-focus');
      // Should only have 2 fixable rules
      expect(fixableRules).toHaveLength(2);
    });

    it('should integrate with stylelint API', async () => {
      const result = await testCSS('.bar:focus { outline: none; }', {
        'no-outline-none': true,
      });

      expect(result.errored).toBe(true);
      expect(result.results[0].warnings).toHaveLength(1);
      expect(result.results[0].warnings[0].rule).toBe('a11y/no-outline-none');
    });
  });

  describe('Rule Functionality', () => {
    it('should detect outline-none violations', async () => {
      const hasError = await ruleTriggersOn('.bar:focus { outline: none; }', 'no-outline-none');

      expect(hasError).toBe(true);
    });

    it('should pass valid outline usage', async () => {
      const passes = await passesLint('.baz:focus { outline: none; border-color: #333; }', {
        'no-outline-none': true,
      });

      expect(passes).toBe(true);
    });

    it('should detect static content violations', async () => {
      const hasError = await ruleTriggersOn(
        '.foo::before { content: "bar"; }',
        'content-property-no-static-value'
      );

      expect(hasError).toBe(true);
    });

    it('should pass dynamic content', async () => {
      const passes = await passesLint('.bar::before { content: attr(aria-label); }', {
        'content-property-no-static-value': true,
      });

      expect(passes).toBe(true);
    });

    it('should detect small font sizes', async () => {
      const hasError = await ruleTriggersOn('a { font-size: 10px; }', 'font-size-is-readable');

      expect(hasError).toBe(true);
    });

    it('should pass readable font sizes', async () => {
      const passes = await passesLint('a { font-size: 16px; }', {
        'font-size-is-readable': true,
      });

      expect(passes).toBe(true);
    });

    it('should detect missing focus pseudo-class', async () => {
      const hasError = await ruleTriggersOn(
        'a:hover { color: blue; }',
        'selector-pseudo-class-focus'
      );

      expect(hasError).toBe(true);
    });

    it('should pass hover with focus', async () => {
      const passes = await passesLint('a:hover:focus { color: blue; }', {
        'selector-pseudo-class-focus': true,
      });

      expect(passes).toBe(true);
    });
  });

  describe('Configuration', () => {
    it('should load recommended configuration', () => {
      expect(recommendedConfig).toBeDefined();
      expect(recommendedConfig.rules).toBeDefined();
      expect(Object.keys(recommendedConfig.rules)).toContain('a11y/media-prefers-reduced-motion');
      expect(Object.keys(recommendedConfig.rules)).toContain('a11y/no-outline-none');
      expect(Object.keys(recommendedConfig.rules)).toContain('a11y/selector-pseudo-class-focus');
    });

    it('should apply recommended rules', async () => {
      const result = await testCSS('a:hover { color: blue; }', recommendedConfig.rules);

      expect(result.errored).toBe(true);
      expect(
        result.results[0].warnings.some((w) => w.rule === 'a11y/selector-pseudo-class-focus')
      ).toBe(true);
    });

    it('should handle rule options', async () => {
      const result = await testCSS('a { font-size: 14px; }', {
        'font-size-is-readable': [true, { minSize: 15 }],
      });

      expect(result.errored).toBe(true);
      expect(result.results[0].warnings[0].rule).toBe('a11y/font-size-is-readable');
    });

    it('should handle disabled rules', async () => {
      const result = await testCSS('.bar:focus { outline: none; }', {
        'no-outline-none': null,
      });

      expect(result.errored).toBe(false);
      expect(result.results[0].warnings).toHaveLength(0);
    });
  });

  describe('Multiple Rules', () => {
    it('should handle multiple violations', async () => {
      const warnings = await getWarnings('a:hover { outline: none; font-size: 10px; }', {
        'no-outline-none': true,
        'font-size-is-readable': true,
        'selector-pseudo-class-focus': true,
      });

      // Should have violations from font-size and selector-pseudo-class-focus
      // (no-outline-none only fires with :focus, not :hover)
      expect(warnings.some((w) => w.rule === 'a11y/no-outline-none')).toBe(false);
      expect(warnings.some((w) => w.rule === 'a11y/font-size-is-readable')).toBe(true);
      expect(warnings.some((w) => w.rule === 'a11y/selector-pseudo-class-focus')).toBe(true);
    });

    it('should handle complex selectors', async () => {
      const warnings = await getWarnings(
        `
        .container .button:hover::before {
          content: "→";
          outline: none;
          font-size: 10px;
        }
      `,
        {
          'content-property-no-static-value': true,
          'no-outline-none': true,
          'font-size-is-readable': true,
          'selector-pseudo-class-focus': true,
        }
      );

      // Should detect content and font-size issues, but not outline (no :focus)
      expect(warnings.some((w) => w.rule === 'a11y/content-property-no-static-value')).toBe(true);
      expect(warnings.some((w) => w.rule === 'a11y/font-size-is-readable')).toBe(true);
      expect(warnings.some((w) => w.rule === 'a11y/selector-pseudo-class-focus')).toBe(true);
    });

    it('should handle empty CSS', async () => {
      const passes = await passesLint('', {
        'no-outline-none': true,
        'font-size-is-readable': true,
      });

      expect(passes).toBe(true);
    });

    it('should handle comments', async () => {
      const hasError = await ruleTriggersOn(
        `
        /* This is a test */
        .bar:focus { 
          /* Remove outline */
          outline: none; 
        }
      `,
        'no-outline-none'
      );

      expect(hasError).toBe(true);
    });
  });

  describe('Edge Cases', () => {
    it('should handle vendor prefixes', async () => {
      const hasError = await ruleTriggersOn(
        `
        .button:focus {
          -webkit-outline: none;
          -moz-outline: none;
          outline: none;
        }
      `,
        'no-outline-none'
      );

      expect(hasError).toBe(true);
    });

    it('should handle nested media queries', async () => {
      const hasError = await ruleTriggersOn(
        `
        @media screen {
          @media (min-width: 768px) {
            .button:focus { outline: none; }
          }
        }
      `,
        'no-outline-none'
      );

      expect(hasError).toBe(true);
    });

    it('should perform efficiently on large CSS', async () => {
      let largeCss = '';

      for (let i = 0; i < 25; i++) {
        largeCss += `.class-${i}:hover { outline: none; font-size: 10px; }\n`;
      }

      const startTime = Date.now();
      const warnings = await getWarnings(largeCss, {
        'no-outline-none': true,
        'font-size-is-readable': true,
        'selector-pseudo-class-focus': true,
      });
      const duration = Date.now() - startTime;

      expect(duration).toBeLessThan(1000); // Should complete within 1 second
      expect(warnings.length).toBeGreaterThanOrEqual(50); // Should detect all violations
    });
  });
});
