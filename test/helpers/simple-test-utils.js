import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import stylelint from 'stylelint';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Simple helper to run stylelint with the a11y plugin using in-memory CSS
 * @param {string} code - CSS code to lint
 * @param {object} rules - A11y rules configuration (object with rule names as keys)
 * @param {object} options - Additional stylelint options
 * @returns {Promise<object>} - Stylelint result
 */
export async function testCSS(code, rules = {}, options = {}) {
  const pluginPath = join(__dirname, '../../src/index.js');

  const config = {
    plugins: [pluginPath],
    rules: Object.fromEntries(
      Object.entries(rules).map(([rule, value]) => [
        rule.startsWith('a11y/') ? rule : `a11y/${rule}`,
        value,
      ])
    ),
    ...options.config,
  };

  const result = await stylelint.lint({
    code,
    config,
    configBasedir: join(__dirname, '../..'),
    ...options,
  });

  return result;
}

/**
 * Helper to check if CSS passes all rules without errors
 * @param {string} code - CSS code to test
 * @param {object} rules - A11y rules configuration
 * @returns {Promise<boolean>} - True if no errors
 */
export async function passesLint(code, rules = {}) {
  const result = await testCSS(code, rules);

  return !result.errored;
}

/**
 * Helper to get all warnings from linting
 * @param {string} code - CSS code to test
 * @param {object} rules - A11y rules configuration
 * @returns {Promise<Array>} - Array of warnings
 */
export async function getWarnings(code, rules = {}) {
  const result = await testCSS(code, rules);

  return result.results[0]?.warnings || [];
}

/**
 * Helper to check if a specific rule triggers on CSS
 * @param {string} code - CSS code to test
 * @param {string} ruleName - Rule name (with or without a11y/ prefix)
 * @param {*} ruleConfig - Rule configuration (true, false, or array)
 * @returns {Promise<boolean>} - True if rule triggers
 */
export async function ruleTriggersOn(code, ruleName, ruleConfig = true) {
  const warnings = await getWarnings(code, { [ruleName]: ruleConfig });
  const fullRuleName = ruleName.startsWith('a11y/') ? ruleName : `a11y/${ruleName}`;

  return warnings.some((w) => w.rule === fullRuleName);
}
