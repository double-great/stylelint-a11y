import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs/promises';
import { execStylelint } from '../helpers/exec-stylelint.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

describe('CLI Integration Tests', () => {
  const projectRoot = join(__dirname, '../..');

  it('should work with recommended config via CLI', async () => {
    // Create a minimal test to verify CLI works with the plugin
    const testCssFile = join(projectRoot, 'test-cli-temp.css');
    const testConfigFile = join(projectRoot, '.stylelintrc-cli-temp.json');

    try {
      await fs.writeFile(testCssFile, '.test:focus { outline: none; }');
      await fs.writeFile(
        testConfigFile,
        JSON.stringify({
          plugins: ['./src/index.js'],
          rules: { 'a11y/no-outline-none': true },
        })
      );

      const result = execStylelint(`npx stylelint "${testCssFile}" --config "${testConfigFile}"`, {
        cwd: projectRoot,
      });

      expect(result.exitCode).toBeGreaterThan(0);
      expect(result.stdout + result.stderr).toContain('a11y/no-outline-none');
    } finally {
      // Cleanup
      await fs.unlink(testCssFile).catch(() => {});
      await fs.unlink(testConfigFile).catch(() => {});
    }
  });

  it('should handle valid CSS without CLI errors', async () => {
    const testCssFile = join(projectRoot, 'test-cli-valid-temp.css');
    const testConfigFile = join(projectRoot, '.stylelintrc-valid-temp.json');

    try {
      await fs.writeFile(testCssFile, '.test:hover:focus { color: blue; }');
      await fs.writeFile(
        testConfigFile,
        JSON.stringify({
          plugins: ['./src/index.js'],
          rules: { 'a11y/selector-pseudo-class-focus': true },
        })
      );

      const result = execStylelint(
        `npx stylelint "${testCssFile}" --config "${testConfigFile}"`,
        { cwd: projectRoot },
        false
      );

      // Should succeed without errors
      expect(result.exitCode).toBe(0);
    } finally {
      // Cleanup
      await fs.unlink(testCssFile).catch(() => {});
      await fs.unlink(testConfigFile).catch(() => {});
    }
  });
});
