import { dirname, join } from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '../..');

/**
 * Execute stylelint command with proper error handling and output suppression
 * @param {string} command - The stylelint command to run
 * @param {object} options - Additional options for execSync
 * @param {boolean} expectErrors - Whether to expect violations (default: true)
 * @returns {object} - { stdout, stderr, exitCode, error }
 */
export function execStylelint(command, options = {}, expectErrors = true) {
  const defaultOptions = {
    cwd: options.cwd || rootDir,
    encoding: 'utf8',
    ...options,
  };

  try {
    const stdout = execSync(command, {
      ...defaultOptions,
      stdio: ['pipe', 'pipe', 'pipe'], // Capture all streams
    });

    return {
      stdout,
      stderr: '',
      exitCode: 0,
      error: null,
    };
  } catch (error) {
    // In E2E tests, stylelint failures are often expected (when testing rule violations)
    if (expectErrors && error.status !== 0) {
      return {
        stdout: error.stdout || '',
        stderr: error.stderr || '',
        exitCode: error.status || 1,
        error,
      };
    }

    // Re-throw unexpected errors
    throw error;
  }
}

/**
 * Execute stylelint and expect violations, return parsed JSON output
 * @param {string} file - File path to lint
 * @param {string} configFile - Config file path
 * @param {object} options - Additional options
 * @returns {object} - Parsed stylelint JSON output
 */
export function expectStylelintViolations(file, configFile, options = {}) {
  const command = `npx stylelint "${file}" --config "${configFile}" --formatter json`;
  const result = execStylelint(command, options, true);

  // Parse the JSON output (from stdout or stderr)
  const outputText = result.stdout || result.stderr;

  if (!outputText.trim()) {
    throw new Error('Expected stylelint violations but got no output');
  }

  try {
    return JSON.parse(outputText);
  } catch {
    // If JSON parsing fails, it might be because of error output
    // Check if the output contains error messages that indicate config issues
    if (outputText.includes('ENOENT') || outputText.includes('Error:')) {
      throw new Error(`Stylelint configuration error: ${outputText}`);
    }

    throw new Error(`Failed to parse stylelint output as JSON: ${outputText}`);
  }
}
