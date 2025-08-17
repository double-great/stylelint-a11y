import stylelint from 'stylelint';
const { createPlugin } = stylelint;

import rules from './rules/index.js';

// Import meta objects
import { meta as contentPropertyMeta } from './rules/content-property-no-static-value/index.js';
import { meta as fontSizeReadableMeta } from './rules/font-size-is-readable/index.js';
import { meta as lineHeightRhythmedMeta } from './rules/line-height-is-vertical-rhythmed/index.js';
import { meta as mediaPrefersColorSchemeMeta } from './rules/media-prefers-color-scheme/index.js';
import { meta as mediaPrefersReducedMotionMeta } from './rules/media-prefers-reduced-motion/index.js';
import { meta as noDisplayNoneMeta } from './rules/no-display-none/index.js';
import { meta as noObsoleteAttributeMeta } from './rules/no-obsolete-attribute/index.js';
import { meta as noObsoleteElementMeta } from './rules/no-obsolete-element/index.js';
import { meta as noOutlineNoneMeta } from './rules/no-outline-none/index.js';
import { meta as noSpreadTextMeta } from './rules/no-spread-text/index.js';
import { meta as noTextAlignJustifyMeta } from './rules/no-text-align-justify/index.js';
import { meta as selectorPseudoClassFocusMeta } from './rules/selector-pseudo-class-focus/index.js';

const ruleMetaMap = {
  'content-property-no-static-value': contentPropertyMeta,
  'font-size-is-readable': fontSizeReadableMeta,
  'line-height-is-vertical-rhythmed': lineHeightRhythmedMeta,
  'media-prefers-color-scheme': mediaPrefersColorSchemeMeta,
  'media-prefers-reduced-motion': mediaPrefersReducedMotionMeta,
  'no-display-none': noDisplayNoneMeta,
  'no-obsolete-attribute': noObsoleteAttributeMeta,
  'no-obsolete-element': noObsoleteElementMeta,
  'no-outline-none': noOutlineNoneMeta,
  'no-spread-text': noSpreadTextMeta,
  'no-text-align-justify': noTextAlignJustifyMeta,
  'selector-pseudo-class-focus': selectorPseudoClassFocusMeta,
};

const rulesPlugins = Object.keys(rules).map((ruleName) => {
  const plugin = createPlugin(`a11y/${ruleName}`, rules[ruleName]);

  // Add meta object to the plugin
  plugin.meta = ruleMetaMap[ruleName];

  return plugin;
});

export default rulesPlugins;
