import strictConfig from '../../strict.js';
import stylelint from 'stylelint';

describe('Strict Configuration', () => {
  it('should load the strict config without errors', () => {
    expect(strictConfig).toBeDefined();
    expect(strictConfig.plugins).toEqual(['.']);
    expect(strictConfig.rules).toBeDefined();
  });

  it('should include all accessibility rules', () => {
    const expectedRules = [
      'a11y/content-property-no-static-value',
      'a11y/font-size-is-readable',
      'a11y/line-height-is-vertical-rhythmed',
      'a11y/media-prefers-color-scheme',
      'a11y/media-prefers-reduced-motion',
      'a11y/no-display-none',
      'a11y/no-obsolete-attribute',
      'a11y/no-obsolete-element',
      'a11y/no-outline-none',
      'a11y/no-spread-text',
      'a11y/no-text-align-justify',
      'a11y/selector-pseudo-class-focus',
    ];

    expectedRules.forEach((rule) => {
      expect(strictConfig.rules[rule]).toBe(true);
    });

    // Verify we have exactly the expected number of rules
    expect(Object.keys(strictConfig.rules)).toHaveLength(expectedRules.length);
  });

  it('should work with stylelint when extended', async () => {
    const css = `
      .button:focus {
        outline: none;
      }
      .text {
        font-size: 10px;
      }
    `;

    const config = {
      extends: ['./strict.js'],
    };

    const result = await stylelint.lint({
      code: css,
      config,
      configBasedir: process.cwd(), // eslint-disable-line n/prefer-global/process
    });

    expect(result.errored).toBe(true);
    const warnings = result.results[0].warnings;

    // Should catch multiple violations with strict config
    expect(warnings.length).toBeGreaterThan(0);

    // Check for specific rules being triggered
    const ruleNames = warnings.map((w) => w.rule);

    expect(ruleNames).toContain('a11y/no-outline-none');
    expect(ruleNames).toContain('a11y/font-size-is-readable');
  });

  it('should catch more issues than recommended config', async () => {
    const css = `
      .text {
        font-size: 12px;
        text-align: justify;
        line-height: 1.1;
      }
      .hidden {
        display: none;
      }
    `;

    const recommendedConfig = {
      extends: ['./recommended.js'],
    };

    const strictConfigTest = {
      extends: ['./strict.js'],
    };

    const recommendedResult = await stylelint.lint({
      code: css,
      config: recommendedConfig,
      configBasedir: process.cwd(), // eslint-disable-line n/prefer-global/process
    });

    const strictResult = await stylelint.lint({
      code: css,
      config: strictConfigTest,
      configBasedir: process.cwd(), // eslint-disable-line n/prefer-global/process
    });

    const recommendedWarnings = recommendedResult.results[0].warnings;
    const strictWarnings = strictResult.results[0].warnings;

    // Strict config should catch more issues
    expect(strictWarnings.length).toBeGreaterThan(recommendedWarnings.length);

    // Recommended should have no warnings for this CSS
    expect(recommendedWarnings).toHaveLength(0);

    // Strict should catch multiple issues
    expect(strictWarnings.length).toBeGreaterThan(0);

    const strictRuleNames = strictWarnings.map((w) => w.rule);

    expect(strictRuleNames).toContain('a11y/font-size-is-readable');
    expect(strictRuleNames).toContain('a11y/no-text-align-justify');
    expect(strictRuleNames).toContain('a11y/line-height-is-vertical-rhythmed');
    expect(strictRuleNames).toContain('a11y/no-display-none');
  });
});
