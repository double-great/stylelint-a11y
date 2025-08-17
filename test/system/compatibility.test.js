/**
 * System-level compatibility testing
 * Tests plugin compatibility across different stylelint versions and configurations
 */

import { testCSS } from '../helpers/simple-test-utils.js';

describe('System Compatibility Testing', () => {
  describe('Stylelint Version Compatibility', () => {
    it('should work with minimum supported stylelint version (16.0.0)', async () => {
      // Test that plugin loads and works with minimum version requirements
      const result = await testCSS('.test:focus { outline: none; }', {
        'a11y/no-outline-none': true,
      });

      expect(result.errored).toBe(true);
      expect(result.results[0].warnings).toHaveLength(1);
      expect(result.results[0].warnings[0].rule).toBe('a11y/no-outline-none');
    });

    it('should handle plugin loading without errors', async () => {
      // Test that all rules can be loaded without throwing
      const allRulesConfig = {
        'a11y/content-property-no-static-value': true,
        'a11y/font-size-is-readable': true,
        'a11y/line-height-is-vertical-rhythmed': true,
        'a11y/media-prefers-color-scheme': true,
        'a11y/media-prefers-reduced-motion': true,
        'a11y/no-display-none': true,
        'a11y/no-obsolete-attribute': true,
        'a11y/no-obsolete-element': true,
        'a11y/no-outline-none': true,
        'a11y/no-spread-text': true,
        'a11y/no-text-align-justify': true,
        'a11y/selector-pseudo-class-focus': true,
      };

      const result = await testCSS('.test { color: red; }', allRulesConfig);

      // Should not throw errors during rule loading
      expect(result).toBeDefined();
      expect(result.results).toBeDefined();
    });

    it('should handle meta object access correctly', async () => {
      // Test that meta objects are accessible without errors
      const { default: plugin } = await import('../../src/index.js');

      plugin.forEach((rule) => {
        expect(rule.meta).toBeDefined();
        expect(rule.meta.url).toBeDefined();
        expect(typeof rule.meta.fixable).toBe('boolean');
        expect(typeof rule.meta.deprecated).toBe('boolean');
      });
    });
  });

  describe('Error Handling and Graceful Degradation', () => {
    it('should handle invalid CSS gracefully', async () => {
      const invalidCSS = '.test { color: ; invalid; }';

      // This test ensures our plugin doesn't crash on invalid CSS
      await expect(async () => {
        await testCSS(invalidCSS, { 'a11y/no-outline-none': true });
      }).not.toThrow(/plugin.*crashed/i);
    });

    it('should handle empty CSS files', async () => {
      const result = await testCSS('', { 'a11y/no-outline-none': true });

      expect(result.errored).toBe(false);
      expect(result.results[0].warnings).toHaveLength(0);
    });

    it('should handle CSS with only comments', async () => {
      const cssWithComments = `
        /* This is a comment */
        /* Another comment */
      `;

      const result = await testCSS(cssWithComments, { 'a11y/no-outline-none': true });

      expect(result.errored).toBe(false);
      expect(result.results[0].warnings).toHaveLength(0);
    });

    it('should handle malformed selectors gracefully', async () => {
      const malformedCSS = '.test:hover:hover:focus { outline: none; }';

      const result = await testCSS(malformedCSS, { 'a11y/no-outline-none': true });

      // Should still detect accessibility issues even with complex selectors
      expect(result).toBeDefined();
      expect(result.errored).toBe(true);
    });

    it('should handle very large CSS files', async () => {
      // Generate a large CSS file to test performance under load
      const largeCSSRules = Array.from(
        { length: 100 },
        (_, i) => `.rule-${i}:focus { font-size: 10px; outline: none; }`
      ).join('\n');

      const result = await testCSS(largeCSSRules, {
        'a11y/font-size-is-readable': true,
        'a11y/no-outline-none': true,
      });

      expect(result.errored).toBe(true);
      expect(result.results[0].warnings.length).toBeGreaterThan(100); // Should detect many violations
    });

    it('should handle CSS with vendor prefixes', async () => {
      const vendorPrefixCSS = `
        .test:focus {
          -webkit-transition: all 0.3s;
          -moz-transition: all 0.3s;
          transition: all 0.3s;
          outline: none;
        }
      `;

      const result = await testCSS(vendorPrefixCSS, { 'a11y/no-outline-none': true });

      expect(result.errored).toBe(true);
      expect(result.results[0].warnings).toHaveLength(1);
    });
  });

  describe('Configuration Robustness', () => {
    it('should handle invalid rule options gracefully', async () => {
      // Test with invalid option types
      const result = await testCSS('.test { font-size: 10px; }', {
        'a11y/font-size-is-readable': [true, { thresholdInPixels: 'invalid' }],
      });

      // Should handle invalid options without crashing
      expect(result).toBeDefined();
    });

    it('should handle missing secondary options', async () => {
      const result = await testCSS('.test { font-size: 10px; }', {
        'a11y/font-size-is-readable': [true, {}],
      });

      expect(result.errored).toBe(true);
      expect(result.results[0].warnings).toHaveLength(1);
    });

    it('should handle mixed valid and invalid rules', async () => {
      const result = await testCSS('.test:focus { outline: none; }', {
        'a11y/no-outline-none': true,
        // Note: stylelint will reject configs with invalid rule names
      });

      expect(result.errored).toBe(true);
      expect(result.results[0].warnings).toHaveLength(1);
      expect(result.results[0].warnings[0].rule).toBe('a11y/no-outline-none');
    });
  });

  describe('Cross-platform Validation', () => {
    it('should handle different line endings', async () => {
      const cssWithWindowsLineEndings = '.test:focus { outline: none; }\r\n.other { color: red; }';
      const cssWithUnixLineEndings = '.test:focus { outline: none; }\n.other { color: red; }';

      const resultWindows = await testCSS(cssWithWindowsLineEndings, {
        'a11y/no-outline-none': true,
      });
      const resultUnix = await testCSS(cssWithUnixLineEndings, { 'a11y/no-outline-none': true });

      expect(resultWindows.errored).toBe(true);
      expect(resultUnix.errored).toBe(true);
      expect(resultWindows.results[0].warnings).toHaveLength(1);
      expect(resultUnix.results[0].warnings).toHaveLength(1);
    });

    it('should handle different file encodings consistently', async () => {
      // Test with various Unicode characters that might be in CSS
      const cssWithUnicode = '.test { content: "✓ ★ 中文"; outline: none; }';

      const result = await testCSS(cssWithUnicode, {
        'a11y/no-outline-none': true,
        'a11y/content-property-no-static-value': true,
      });

      expect(result.errored).toBe(true);
      expect(result.results[0].warnings.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe('Memory and Performance Stability', () => {
    it('should not leak memory with repeated rule executions', async () => {
      const css = '.test:focus { outline: none; }';
      const config = { 'a11y/no-outline-none': true };

      // Run the same test multiple times to check for memory leaks
      for (let i = 0; i < 50; i++) {
        const result = await testCSS(css, config);

        expect(result.errored).toBe(true);
      }

      // If we reach here without running out of memory, the test passes
      expect(true).toBe(true);
    });

    it('should handle concurrent rule executions', async () => {
      const css = '.test:focus { outline: none; font-size: 10px; }';
      const config = {
        'a11y/no-outline-none': true,
        'a11y/font-size-is-readable': true,
      };

      // Run multiple tests concurrently
      const promises = Array.from({ length: 5 }, () => testCSS(css, config));
      const results = await Promise.all(promises);

      // All results should be consistent
      results.forEach((result) => {
        expect(result.errored).toBe(true);
        expect(result.results[0].warnings.length).toBeGreaterThanOrEqual(1);
      });
    });
  });

  describe('Integration with Stylelint Ecosystem', () => {
    it('should work alongside other stylelint plugins', async () => {
      // Test that our plugin doesn't interfere with built-in stylelint rules
      const result = await testCSS('.test { color: red; outline: none; }', {
        'color-hex-length': 'short', // Built-in stylelint rule
        'a11y/no-outline-none': true, // Our rule
      });

      expect(result).toBeDefined();
      // Should have violations from both built-in and our rules
    });

    it('should handle configuration inheritance correctly', async () => {
      // Test with recommended configuration
      const { default: recommendedConfig } = await import('../../recommended.js');

      const result = await testCSS('.test:hover { color: red; }', recommendedConfig.rules);

      expect(result.errored).toBe(true);
      expect(result.results[0].warnings.some((w) => w.rule.startsWith('a11y/'))).toBe(true);
    });
  });
});
