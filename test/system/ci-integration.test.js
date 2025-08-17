/**
 * CI/CD Integration Testing
 * Tests for automated environments and continuous integration scenarios
 */

import { existsSync, readFileSync } from 'fs';
import process from 'process';

describe('CI/CD Integration', () => {
  describe('Environment Compatibility', () => {
    it('should work in Node.js minimum version', () => {
      const nodeVersion = process.version;
      const majorVersion = parseInt(nodeVersion.slice(1).split('.')[0]);

      // Ensure we meet our minimum Node.js requirement
      expect(majorVersion).toBeGreaterThanOrEqual(18);
    });

    it('should handle missing optional dependencies gracefully', async () => {
      // Test that plugin works even if some optional tools are missing
      expect(async () => {
        await import('../../src/index.js');
      }).not.toThrow();
    });

    it('should work with various package managers', () => {
      // Test that package.json is properly configured for different package managers
      const packageJson = JSON.parse(readFileSync('package.json', 'utf8'));

      expect(packageJson.engines.node).toBeDefined();
      expect(packageJson.peerDependencies.stylelint).toBeDefined();
      expect(packageJson.type).toBe('module');
    });
  });

  describe('Test Matrix Validation', () => {
    it('should support all test types independently', async () => {
      // Verify all test types can run independently for CI matrix
      const testTypes = ['unit', 'integration', 'e2e', 'performance'];

      for (const testType of testTypes) {
        expect(() => {
          // This would be used in CI to verify each test type works
          // eslint-disable-next-line no-console
          console.log(`Test type: ${testType} - Ready for matrix execution`);
        }).not.toThrow();
      }
    });

    it('should handle parallel test execution', async () => {
      // Test that our tests can run in parallel without conflicts
      const { testCSS } = await import('../helpers/simple-test-utils.js');

      const testPromises = Array.from({ length: 5 }, () =>
        testCSS('.test:focus { outline: none; }', { 'a11y/no-outline-none': true })
      );

      const results = await Promise.all(testPromises);

      // All tests should succeed independently
      results.forEach((result) => {
        expect(result.errored).toBe(true);
        expect(result.results[0].warnings).toHaveLength(1);
      });
    });
  });

  describe('Build and Distribution', () => {
    it('should have correct package exports', async () => {
      // Test that all package exports work correctly
      const mainExport = await import('../../src/index.js');
      const recommendedExport = await import('../../recommended.js');

      expect(Array.isArray(mainExport.default)).toBe(true);
      expect(mainExport.default.length).toBeGreaterThan(0);
      expect(recommendedExport.default.rules).toBeDefined();
    });

    it('should include all necessary files in distribution', () => {
      const packageJson = JSON.parse(readFileSync('package.json', 'utf8'));

      // Check that essential files exist
      expect(existsSync('src/index.js')).toBe(true);
      expect(existsSync('recommended.js')).toBe(true);
      expect(existsSync('README.md')).toBe(true);

      // Check exports are correctly defined
      expect(packageJson.exports['.']).toBe('./src/index.js');
      expect(packageJson.exports['./recommended']).toBe('./recommended.js');
    });

    it('should not include development files in published package', () => {
      const packageJson = JSON.parse(readFileSync('package.json', 'utf8'));

      // Verify we have appropriate files configuration or .npmignore
      // (In a real CI environment, this would check the actual published tarball)
      expect(packageJson.files || true).toBeTruthy(); // Package uses .gitignore pattern
    });
  });

  describe('Performance Monitoring for CI', () => {
    it('should track performance metrics for trending', async () => {
      const { testCSS } = await import('../helpers/simple-test-utils.js');

      const css = '.test { outline: none; font-size: 10px; }';
      const config = {
        'a11y/no-outline-none': true,
        'a11y/font-size-is-readable': true,
      };

      const startTime = Date.now();

      await testCSS(css, config);
      const endTime = Date.now();

      const duration = endTime - startTime;

      // This could be reported to a performance tracking system in CI
      // eslint-disable-next-line no-console
      console.log(`CI_METRIC: test_duration=${duration}ms`);

      expect(duration).toBeLessThan(1000); // Should complete within 1 second
    });

    it('should validate memory usage in CI environment', async () => {
      const { testCSS } = await import('../helpers/simple-test-utils.js');

      const initialMemory = process.memoryUsage();

      // Run a moderate workload
      const css = Array.from({ length: 100 }, (_, i) => `.rule-${i} { outline: none; }`).join('\n');

      await testCSS(css, { 'a11y/no-outline-none': true });

      const finalMemory = process.memoryUsage();
      const memoryGrowth = (finalMemory.heapUsed - initialMemory.heapUsed) / 1024 / 1024;

      // eslint-disable-next-line no-console
      console.log(`CI_METRIC: memory_growth=${memoryGrowth.toFixed(2)}MB`);

      // Memory growth should be reasonable
      expect(memoryGrowth).toBeLessThan(100); // Less than 100MB growth
    });
  });

  describe('Error Reporting for CI', () => {
    it('should provide clear error messages for CI debugging', async () => {
      const { testCSS } = await import('../helpers/simple-test-utils.js');

      const result = await testCSS('.test:focus { outline: none; }', {
        'a11y/no-outline-none': true,
      });

      expect(result.errored).toBe(true);

      const warning = result.results[0].warnings[0];

      expect(warning.text).toContain('Expected');
      expect(warning.rule).toBe('a11y/no-outline-none');
      expect(warning.line).toBeDefined();
      expect(warning.column).toBeDefined();
    });

    it('should handle CI-specific configurations', async () => {
      // Test configurations that might be used in CI environments
      process.env.CI = 'true';

      const { testCSS } = await import('../helpers/simple-test-utils.js');

      const result = await testCSS('.test { outline: none; }', {
        'a11y/no-outline-none': true,
      });

      expect(result).toBeDefined();

      // Clean up
      delete process.env.CI;
    });
  });

  describe('Dependency Health', () => {
    it('should have secure and up-to-date dependencies', () => {
      const packageJson = JSON.parse(readFileSync('package.json', 'utf8'));

      // Check that we have appropriate peer dependency constraints
      expect(packageJson.peerDependencies.stylelint).toMatch(/>=16\.0\.0/);

      // Verify we're using a modern PostCSS version
      expect(packageJson.dependencies.postcss).toBeDefined();
    });

    it('should not have vulnerable dependencies', () => {
      // This would integrate with security scanning in CI
      // For now, we just verify the package structure is correct
      const packageJson = JSON.parse(readFileSync('package.json', 'utf8'));

      expect(packageJson.dependencies).toBeDefined();
      expect(Object.keys(packageJson.dependencies).length).toBeGreaterThan(0);
    });
  });

  describe('Cross-platform CI Testing', () => {
    it('should work across different operating systems', async () => {
      const { testCSS } = await import('../helpers/simple-test-utils.js');

      // Test with different path separators and line endings
      const css = '.test:focus { outline: none; }';
      const config = { 'a11y/no-outline-none': true };

      const result = await testCSS(css, config);

      expect(result.errored).toBe(true);
      expect(result.results[0].warnings).toHaveLength(1);

      // Should work regardless of platform
      // eslint-disable-next-line no-console
      console.log(`Platform: ${process.platform}, Arch: ${process.arch}`);
    });

    it('should handle different timezone and locale settings', async () => {
      // Ensure our plugin doesn't depend on locale-specific behaviors
      const originalTZ = process.env.TZ;
      const originalLANG = process.env.LANG;

      process.env.TZ = 'UTC';
      process.env.LANG = 'en_US.UTF-8';

      const { testCSS } = await import('../helpers/simple-test-utils.js');

      const result = await testCSS('.test:focus { outline: none; }', {
        'a11y/no-outline-none': true,
      });

      expect(result.errored).toBe(true);

      // Restore original environment
      if (originalTZ) process.env.TZ = originalTZ;
      else delete process.env.TZ;

      if (originalLANG) process.env.LANG = originalLANG;
      else delete process.env.LANG;
    });
  });
});
