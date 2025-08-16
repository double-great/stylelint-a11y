import { testCSS, getWarnings } from '../helpers/simple-test-utils.js';

describe('Performance Tests', () => {
  it('should process rules efficiently', async () => {
    const testCss = `
      .test1:focus { outline: none; }
      .test2:hover { color: blue; }
      .test3 { font-size: 10px; }
      .test4::before { content: "text"; }
      .test5 { line-height: 1.0; }
      .test6 { text-align: justify; }
      .test7 { animation: slide 1s; }
      .test8 { display: none; }
    `.repeat(50); // Create larger test case

    const times = [];

    // Run multiple iterations to get average performance
    for (let i = 0; i < 3; i++) {
      const startTime = process.hrtime.bigint();

      await testCSS(testCss, {
        'no-outline-none': true,
        'selector-pseudo-class-focus': true,
        'font-size-is-readable': true,
        'content-property-no-static-value': true,
        'line-height-is-vertical-rhythmed': true,
        'no-text-align-justify': true,
        'media-prefers-reduced-motion': true,
        'no-display-none': true,
      });

      const endTime = process.hrtime.bigint();
      const duration = Number(endTime - startTime) / 1000000; // Convert to milliseconds

      times.push(duration);
    }

    const averageTime = times.reduce((sum, time) => sum + time, 0) / times.length;

    // Performance assertions
    expect(averageTime).toBeLessThan(1000); // Average should be under 1 second
  });

  it('should scale reasonably with CSS size', async () => {
    const baseCss = '.test:focus { outline: none; } .test:hover { color: blue; }';
    const sizes = [100, 500]; // Different repetition counts
    const results = [];

    for (const size of sizes) {
      const testCss = baseCss.repeat(size);

      const startTime = process.hrtime.bigint();

      await testCSS(testCss, {
        'no-outline-none': true,
        'selector-pseudo-class-focus': true,
      });

      const endTime = process.hrtime.bigint();
      const duration = Number(endTime - startTime) / 1000000;

      results.push({ size, duration });
    }

    // Check that performance scales reasonably
    const scalingFactor = results[1].duration / results[0].duration; // 500 vs 100 rules

    expect(scalingFactor).toBeLessThan(25); // Should not be more than 25x slower for 5x content
  });

  it('should handle large stylesheets without memory issues', async () => {
    let largeCss = '';

    for (let i = 0; i < 100; i++) {
      largeCss += `.component-${i} { font-size: 10px; color: red; }\n`;
      largeCss += `.component-${i}:hover { color: blue; }\n`;
      largeCss += `.component-${i}:focus { outline: none; }\n`;
    }

    const memoryBefore = process.memoryUsage().heapUsed;

    const warnings = await getWarnings(largeCss, {
      'no-outline-none': true,
      'font-size-is-readable': true,
      'selector-pseudo-class-focus': true,
    });

    const memoryAfter = process.memoryUsage().heapUsed;
    const memoryDiff = memoryAfter - memoryBefore;

    // Should detect violations
    expect(warnings.length).toBeGreaterThan(0);

    // Memory usage should be reasonable (less than 50MB increase)
    expect(memoryDiff).toBeLessThan(50 * 1024 * 1024);
  });
});
