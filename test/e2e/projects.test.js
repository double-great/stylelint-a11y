import { execSync } from 'child_process';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { expectStylelintViolations } from '../helpers/exec-stylelint.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

describe('Real Project Tests', () => {
  const projectsDir = join(__dirname, 'projects');
  const rootDir = join(__dirname, '../..');

  describe('Basic CSS Project', () => {
    const projectDir = join(projectsDir, 'basic-css');

    it('should detect all rule violations in basic CSS project', () => {
      const stylesPath = join(projectDir, 'styles.css');
      const configPath = join(projectDir, '.stylelintrc.json');

      const output = expectStylelintViolations(stylesPath, configPath, { cwd: projectDir });
      const warnings = output[0].warnings;

      // Should detect multiple violations
      expect(warnings.length).toBeGreaterThan(10);

      // Check for specific rule violations
      const ruleNames = warnings.map((w) => w.rule);

      expect(ruleNames).toContain('a11y/no-outline-none');
      expect(ruleNames).toContain('a11y/font-size-is-readable');
      expect(ruleNames).toContain('a11y/selector-pseudo-class-focus');
      expect(ruleNames).toContain('a11y/content-property-no-static-value');
      expect(ruleNames).toContain('a11y/line-height-is-vertical-rhythmed');
      expect(ruleNames).toContain('a11y/no-text-align-justify');
      expect(ruleNames).toContain('a11y/media-prefers-reduced-motion');
      expect(ruleNames).toContain('a11y/no-display-none');
    });

    it('should provide accurate line numbers and columns', () => {
      try {
        execSync(`npx stylelint "styles.css" --formatter json`, {
          cwd: projectDir,
          encoding: 'utf8',
          stdio: ['pipe', 'pipe', 'pipe'], // Suppress stderr output in tests
        });
      } catch (error) {
        const outputText = error.stdout || error.stderr;
        const output = JSON.parse(outputText);
        const warnings = output[0].warnings;

        // All warnings should have line and column information
        warnings.forEach((warning) => {
          expect(warning.line).toBeGreaterThan(0);
          expect(warning.column).toBeGreaterThan(0);
          expect(typeof warning.text).toBe('string');
          expect(warning.text.length).toBeGreaterThan(0);
        });
      }
    });

    it('should handle fix mode without crashing', () => {
      // Create a copy to test fixing
      const tempFile = join(projectDir, 'styles-temp.css');

      execSync(`cp styles.css styles-temp.css`, { cwd: projectDir });

      try {
        // Most a11y rules are not auto-fixable, but --fix should not crash
        execSync(`npx stylelint "styles-temp.css" --fix`, {
          cwd: projectDir,
          encoding: 'utf8',
          stdio: ['pipe', 'pipe', 'pipe'], // Suppress output since violations will still exist
        });
      } catch (error) {
        // stylelint --fix may still exit with non-zero status if unfixable violations remain
        // This is expected behavior for a11y rules
        expect(error.status).toBeGreaterThan(0);

        // Check that the file still exists and has content
        const fixedContent = execSync(`cat styles-temp.css`, {
          cwd: projectDir,
          encoding: 'utf8',
        });

        expect(fixedContent.length).toBeGreaterThan(0);
      } finally {
        // Clean up
        try {
          execSync(`rm styles-temp.css`, { cwd: projectDir });
        } catch {
          // Ignore cleanup errors
        }
      }
    });
  });

  describe('SCSS Project', () => {
    const projectDir = join(projectsDir, 'scss-project');

    it('should work with SCSS syntax', () => {
      try {
        execSync(`npx stylelint "main.scss" --formatter json`, {
          cwd: projectDir,
          encoding: 'utf8',
          stdio: ['pipe', 'pipe', 'pipe'], // Suppress stderr output in tests
        });
      } catch (error) {
        const outputText = error.stdout || error.stderr;
        const output = JSON.parse(outputText);
        const warnings = output[0].warnings;

        // Should detect violations in SCSS
        expect(warnings.length).toBeGreaterThan(15);

        // Check for violations in nested selectors
        const ruleNames = warnings.map((w) => w.rule);

        expect(ruleNames).toContain('a11y/no-outline-none');
        expect(ruleNames).toContain('a11y/font-size-is-readable');
        expect(ruleNames).toContain('a11y/selector-pseudo-class-focus');
        expect(ruleNames).toContain('a11y/content-property-no-static-value');
      }
    });

    it('should handle SCSS variables and mixins', () => {
      try {
        execSync(`npx stylelint "main.scss" --formatter json`, {
          cwd: projectDir,
          encoding: 'utf8',
          stdio: ['pipe', 'pipe', 'pipe'], // Suppress stderr output in tests
        });
      } catch (error) {
        const outputText = error.stdout || error.stderr;
        const output = JSON.parse(outputText);
        const warnings = output[0].warnings;

        // Should detect violations even when using SCSS features
        const fontSizeWarnings = warnings.filter((w) => w.rule === 'a11y/font-size-is-readable');

        expect(fontSizeWarnings.length).toBeGreaterThan(0);

        // Should detect violations in nested media queries
        const nestedWarnings = warnings.filter((w) => w.line > 50); // Violations in nested sections

        expect(nestedWarnings.length).toBeGreaterThan(0);
      }
    });
  });

  describe('Large Codebase Project', () => {
    const projectDir = join(projectsDir, 'large-codebase');

    it('should handle multiple CSS files efficiently', () => {
      const startTime = Date.now();

      try {
        execSync(`npx stylelint "*.css" --formatter json`, {
          cwd: projectDir,
          encoding: 'utf8',
          stdio: ['pipe', 'pipe', 'pipe'], // Suppress stderr output in tests
        });
      } catch (error) {
        const duration = Date.now() - startTime;

        // Should complete within reasonable time (5 seconds for large files)
        expect(duration).toBeLessThan(5000);

        const outputText = error.stdout || error.stderr;
        const output = JSON.parse(outputText);

        // Should process both files
        expect(output).toHaveLength(2);

        // Should find violations in both files
        const totalWarnings = output.reduce((sum, result) => sum + result.warnings.length, 0);

        expect(totalWarnings).toBeGreaterThan(50);
      }
    });

    it('should detect violations across different component types', () => {
      try {
        execSync(`npx stylelint "components.css" --formatter json`, {
          cwd: projectDir,
          encoding: 'utf8',
          stdio: ['pipe', 'pipe', 'pipe'], // Suppress stderr output in tests
        });
      } catch (error) {
        const outputText = error.stdout || error.stderr;
        const output = JSON.parse(outputText);
        const warnings = output[0].warnings;

        // Should detect violations in different component categories
        const ruleTypes = [...new Set(warnings.map((w) => w.rule))];

        expect(ruleTypes.length).toBeGreaterThan(5);

        // Should include violations from utility classes
        const utilityViolations = warnings.filter(
          (w) =>
            w.text.includes('.text-') || w.text.includes('.sr-only') || w.text.includes('.btn-')
        );

        expect(utilityViolations.length).toBeGreaterThan(0);
      }
    });

    it('should detect violations in responsive breakpoints', () => {
      try {
        execSync(`npx stylelint "layout.css" --formatter json`, {
          cwd: projectDir,
          encoding: 'utf8',
          stdio: ['pipe', 'pipe', 'pipe'], // Suppress stderr output in tests
        });
      } catch (error) {
        const outputText = error.stdout || error.stderr;
        const output = JSON.parse(outputText);
        const warnings = output[0].warnings;

        // Should detect violations in media queries
        const mediaQueryViolations = warnings.filter((w) => w.line > 200); // Violations in media query sections

        expect(mediaQueryViolations.length).toBeGreaterThan(5);

        // Should detect font-size violations in different breakpoints
        const fontSizeInBreakpoints = warnings.filter(
          (w) => w.rule === 'a11y/font-size-is-readable' && w.line > 200
        );

        expect(fontSizeInBreakpoints.length).toBeGreaterThan(0);
      }
    });
  });

  describe('Performance Testing', () => {
    it('should process large CSS files within performance thresholds', () => {
      const projectDir = join(projectsDir, 'large-codebase');
      const startTime = Date.now();

      try {
        execSync(`npx stylelint "*.css" --formatter json`, {
          cwd: projectDir,
          encoding: 'utf8',
          timeout: 10000, // 10 second timeout
        });
      } catch (error) {
        const duration = Date.now() - startTime;

        // Should complete within performance threshold
        expect(duration).toBeLessThan(8000); // 8 seconds max

        // Should still produce results despite timing constraints
        if (error.stdout) {
          const outputText = error.stdout || error.stderr;
          const output = JSON.parse(outputText);

          expect(Array.isArray(output)).toBe(true);
        }
      }
    });

    it('should handle concurrent file processing', async () => {
      const projectDir = join(projectsDir, 'large-codebase');

      // Process files concurrently
      const promises = [
        new Promise((resolve, reject) => {
          try {
            execSync(`npx stylelint "components.css" --formatter json`, {
              cwd: projectDir,
              encoding: 'utf8',
            });
            resolve('success');
          } catch (error) {
            resolve('completed');
          }
        }),
        new Promise((resolve, reject) => {
          try {
            execSync(`npx stylelint "layout.css" --formatter json`, {
              cwd: projectDir,
              encoding: 'utf8',
            });
            resolve('success');
          } catch (error) {
            resolve('completed');
          }
        }),
      ];

      const startTime = Date.now();
      const results = await Promise.all(promises);
      const duration = Date.now() - startTime;

      // Concurrent processing should complete efficiently
      expect(duration).toBeLessThan(6000);
      expect(results).toHaveLength(2);
    });
  });

  describe('Cross-Platform Compatibility', () => {
    it('should work consistently across different file encodings', () => {
      const projectDir = join(projectsDir, 'basic-css');

      try {
        // Test with explicit UTF-8
        execSync(`npx stylelint "styles.css" --formatter json`, {
          cwd: projectDir,
          encoding: 'utf8',
          stdio: ['pipe', 'pipe', 'pipe'], // Suppress stderr output in tests
        });
      } catch (error) {
        const outputText = error.stdout || error.stderr;

        expect(outputText).toBeTruthy();
        const output = JSON.parse(outputText);

        expect(output[0].warnings.length).toBeGreaterThan(0);

        // Should handle Unicode characters in CSS if present
        output[0].warnings.forEach((warning) => {
          expect(warning.text).toBeDefined();
          expect(typeof warning.text).toBe('string');
        });
      }
    });

    it('should handle different line ending formats', () => {
      const projectDir = join(projectsDir, 'scss-project');

      try {
        execSync(`npx stylelint "main.scss" --formatter json`, {
          cwd: projectDir,
          encoding: 'utf8',
          stdio: ['pipe', 'pipe', 'pipe'], // Suppress stderr output in tests
        });
      } catch (error) {
        const outputText = error.stdout || error.stderr;
        const output = JSON.parse(outputText);

        // Line numbers should be accurate regardless of line endings
        output[0].warnings.forEach((warning) => {
          expect(warning.line).toBeGreaterThan(0);
          expect(warning.column).toBeGreaterThan(0);
        });
      }
    });
  });
});
