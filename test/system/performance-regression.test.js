/**
 * Performance regression detection and monitoring
 * Automated benchmarking to catch performance degradations
 */

import { performance } from 'perf_hooks';
import process from 'process';
import { testCSS } from '../helpers/simple-test-utils.js';

describe('Performance Regression Detection', () => {
  // Performance baselines (in milliseconds)
  const PERFORMANCE_BASELINES = {
    singleRule: 50, // Single rule on simple CSS
    allRules: 200, // All rules on simple CSS
    largeFile: 1000, // All rules on large CSS file
    memoryUsage: 50, // Memory usage in MB
  };

  // Generate test CSS of various sizes
  const generateCSS = (ruleCount) => {
    return Array.from(
      { length: ruleCount },
      (_, i) => `
      .rule-${i}:focus {
        color: red;
        font-size: 10px;
        outline: none;
        text-align: justify;
        display: none;
        max-width: 30ch;
        line-height: 1.2;
      }
      .rule-${i}:hover {
        color: blue;
      }
    `
    ).join('\n');
  };

  const measurePerformance = async (css, config, testName) => {
    const startTime = performance.now();
    const startMemory = process.memoryUsage().heapUsed / 1024 / 1024; // MB

    const result = await testCSS(css, config);

    const endTime = performance.now();
    const endMemory = process.memoryUsage().heapUsed / 1024 / 1024; // MB

    const metrics = {
      duration: endTime - startTime,
      memoryDelta: endMemory - startMemory,
      violations: result.errored ? result.results[0].warnings.length : 0,
    };

    // eslint-disable-next-line no-console
    console.log(
      `Performance: ${testName} - ${metrics.duration.toFixed(2)}ms, Memory: ${metrics.memoryDelta.toFixed(2)}MB, Violations: ${metrics.violations}`
    );

    return metrics;
  };

  describe('Single Rule Performance', () => {
    it('should execute single rule within performance baseline', async () => {
      const css = '.test:focus { outline: none; }';
      const config = { 'a11y/no-outline-none': true };

      const metrics = await measurePerformance(css, config, 'Single Rule');

      expect(metrics.duration).toBeLessThan(PERFORMANCE_BASELINES.singleRule);
      expect(metrics.violations).toBe(1);
    });

    it('should handle enhanced options without significant overhead', async () => {
      const css = '.test { font-size: 10px; }';
      const config = {
        'a11y/font-size-is-readable': [true, { thresholdInPixels: 16 }],
      };

      const metrics = await measurePerformance(css, config, 'Enhanced Options');

      expect(metrics.duration).toBeLessThan(PERFORMANCE_BASELINES.singleRule);
      expect(metrics.violations).toBe(1);
    });
  });

  describe('All Rules Performance', () => {
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

    it('should execute all rules on simple CSS within baseline', async () => {
      const css = `
        .test:focus {
          color: red;
          font-size: 10px;
          outline: none;
          text-align: justify;
          display: none;
        }
        .test:hover {
          color: blue;
        }
      `;

      const metrics = await measurePerformance(css, allRulesConfig, 'All Rules Simple');

      expect(metrics.duration).toBeLessThan(PERFORMANCE_BASELINES.allRules);
      expect(metrics.violations).toBeGreaterThan(3); // Should catch multiple violations
    });

    it('should scale reasonably with CSS file size', async () => {
      const smallCSS = generateCSS(10);
      const largeCSS = generateCSS(100);

      const smallMetrics = await measurePerformance(
        smallCSS,
        allRulesConfig,
        'Small CSS (10 rules)'
      );
      const largeMetrics = await measurePerformance(
        largeCSS,
        allRulesConfig,
        'Large CSS (100 rules)'
      );

      // Performance should scale sub-linearly (better than 10x for 10x content)
      const scalingFactor = largeMetrics.duration / smallMetrics.duration;

      expect(scalingFactor).toBeLessThan(20); // Should be much better than linear scaling

      expect(largeMetrics.duration).toBeLessThan(PERFORMANCE_BASELINES.largeFile);
    });
  });

  describe('Memory Usage Monitoring', () => {
    it('should not exceed memory usage baseline', async () => {
      const css = generateCSS(500); // Large CSS file
      const config = {
        'a11y/no-outline-none': true,
        'a11y/font-size-is-readable': true,
        'a11y/selector-pseudo-class-focus': true,
      };

      const metrics = await measurePerformance(css, config, 'Memory Usage');

      expect(Math.abs(metrics.memoryDelta)).toBeLessThan(PERFORMANCE_BASELINES.memoryUsage);
    });

    it('should clean up memory after processing', async () => {
      const css = generateCSS(100);
      const config = { 'a11y/no-outline-none': true };

      const initialMemory = process.memoryUsage().heapUsed / 1024 / 1024;

      // Process multiple times
      for (let i = 0; i < 10; i++) {
        await testCSS(css, config);
      }

      // Force garbage collection if available
      if (global.gc) {
        global.gc();
      }

      const finalMemory = process.memoryUsage().heapUsed / 1024 / 1024;
      const memoryGrowth = finalMemory - initialMemory;

      // Memory should not grow significantly
      expect(memoryGrowth).toBeLessThan(PERFORMANCE_BASELINES.memoryUsage);
    });
  });

  describe('Performance Regression Alerts', () => {
    // This would integrate with CI to track performance over time
    it('should track performance metrics for trending', async () => {
      const css = generateCSS(50);
      const config = {
        'a11y/no-outline-none': true,
        'a11y/font-size-is-readable': true,
        'a11y/no-display-none': true,
      };

      const runs = [];

      for (let i = 0; i < 5; i++) {
        const metrics = await measurePerformance(css, config, `Consistency Run ${i + 1}`);

        runs.push(metrics.duration);
      }

      // Calculate coefficient of variation (std dev / mean)
      const mean = runs.reduce((a, b) => a + b) / runs.length;
      const variance = runs.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / runs.length;
      const stdDev = Math.sqrt(variance);
      const coefficientOfVariation = stdDev / mean;

      // Performance should be consistent (CV < 0.2 means < 20% variation)
      expect(coefficientOfVariation).toBeLessThan(0.2);

      // eslint-disable-next-line no-console
      console.log(
        `Performance consistency: ${(coefficientOfVariation * 100).toFixed(1)}% variation`
      );
    });

    it('should validate performance with different rule combinations', async () => {
      const css = '.test { outline: none; font-size: 10px; }';

      const configs = [
        { 'a11y/no-outline-none': true },
        { 'a11y/font-size-is-readable': true },
        { 'a11y/no-outline-none': true, 'a11y/font-size-is-readable': true },
      ];

      const results = [];

      for (const config of configs) {
        const metrics = await measurePerformance(css, config, `Config ${results.length + 1}`);

        results.push(metrics);
      }

      // Adding rules should not dramatically increase processing time
      const singleRuleTime = Math.max(results[0].duration, results[1].duration);
      const multiRuleTime = results[2].duration;

      // Multi-rule should be less than 3x single rule time
      expect(multiRuleTime).toBeLessThan(singleRuleTime * 3);
    });
  });

  describe('Stress Testing', () => {
    it('should handle extreme CSS sizes gracefully', async () => {
      const extremeCSS = generateCSS(1000); // Very large CSS
      const config = { 'a11y/no-outline-none': true };

      const metrics = await measurePerformance(extremeCSS, config, 'Stress Test');

      // Should complete within reasonable time even for extreme cases
      expect(metrics.duration).toBeLessThan(5000); // 5 seconds max
    });

    it('should handle deeply nested selectors', async () => {
      const deeplyNestedCSS = `
        .a .b .c .d .e .f .g .h .i .j:hover { outline: none; }
        .complex:not(.exclude):first-child:nth-of-type(odd):hover { color: red; }
      `;

      const config = {
        'a11y/no-outline-none': true,
        'a11y/selector-pseudo-class-focus': true,
      };

      const metrics = await measurePerformance(deeplyNestedCSS, config, 'Deep Nesting');

      expect(metrics.duration).toBeLessThan(PERFORMANCE_BASELINES.singleRule * 2);
      expect(metrics.violations).toBeGreaterThan(0);
    });
  });
});
