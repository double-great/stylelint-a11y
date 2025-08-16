import { execSync } from 'child_process';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs/promises';

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

      try {
        execSync(`npx stylelint "${testCssFile}" --config "${testConfigFile}"`, {
          cwd: projectRoot,
          encoding: 'utf8',
        });

        throw new Error('Expected stylelint to exit with non-zero code');
      } catch (error) {
        expect(error.status).toBeGreaterThan(0);
      }
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

      const result = execSync(`npx stylelint "${testCssFile}" --config "${testConfigFile}"`, {
        cwd: projectRoot,
        encoding: 'utf8',
      });

      // Should succeed without errors
      expect(typeof result).toBe('string');
    } finally {
      // Cleanup
      await fs.unlink(testCssFile).catch(() => {});
      await fs.unlink(testConfigFile).catch(() => {});
    }
  });
});
