import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs/promises';
import stylelint from 'stylelint';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Helper to run stylelint with the a11y plugin
 * @param {string} code - CSS code to lint
 * @param {object} config - Stylelint configuration
 * @returns {Promise<object>} - Stylelint result
 */
export async function runStylelint(code, config) {
  const pluginPath = join(__dirname, '../../src/index.js');
  const result = await stylelint.lint({
    code,
    config: {
      plugins: [pluginPath],
      ...config,
    },
    configBasedir: join(__dirname, '../..'),
  });

  return result;
}

/**
 * Helper to run stylelint on a file
 * @param {string} filePath - Path to CSS file
 * @param {object} config - Stylelint configuration
 * @returns {Promise<object>} - Stylelint result
 */
export async function runStylelintOnFile(filePath, config) {
  const pluginPath = join(__dirname, '../../src/index.js');
  const result = await stylelint.lint({
    files: filePath,
    config: {
      plugins: [pluginPath],
      ...config,
    },
    configBasedir: join(__dirname, '../..'),
  });

  return result;
}

/**
 * Helper to create a temporary CSS file for testing
 * @param {string} content - CSS content
 * @param {string} filename - File name
 * @returns {Promise<string>} - Path to created file
 */
export async function createTempFile(content, filename = 'test.css') {
  const tempDir = join(__dirname, '../temp');

  await fs.mkdir(tempDir, { recursive: true });
  const filePath = join(tempDir, filename);

  await fs.writeFile(filePath, content, 'utf8');

  return filePath;
}

/**
 * Helper to clean up temporary files
 * @returns {Promise<void>}
 */
export async function cleanupTempFiles() {
  const tempDir = join(__dirname, '../temp');

  try {
    await fs.rm(tempDir, { recursive: true, force: true });
  } catch {
    // Ignore errors if directory doesn't exist
  }
}

/**
 * Helper to get all rule names from the plugin
 * @returns {Promise<string[]>} - Array of rule names
 */
export async function getAllRuleNames() {
  const rulesModule = await import('../../src/rules/index.js');

  return Object.keys(rulesModule.default);
}

/**
 * Helper to validate a stylelint configuration
 * @param {object} config - Configuration to validate
 * @returns {Promise<boolean>} - True if valid
 */
export async function validateConfig(config) {
  try {
    await runStylelint('a { color: red; }', config);

    return true;
  } catch {
    return false;
  }
}
