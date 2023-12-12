import { getTestRule, getTestRuleConfigs } from 'jest-preset-stylelint';
import myPlugin from './src/index.js';

const plugins = [myPlugin];

global.testRule = getTestRule({ plugins });
global.testRuleConfigs = getTestRuleConfigs({ plugins });
