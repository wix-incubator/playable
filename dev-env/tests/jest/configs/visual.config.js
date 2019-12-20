const { defaults: tsjestPreset } = require('ts-jest/presets');

const { APP_SRC, TEST_PATTERNS } = require('../../constants');

const jestPuppeteerConfigPath = require.resolve('./jest-puppeteer.config.js');
const setupFilePath = require.resolve('./visual.setup.js');

// https://github.com/smooth-code/jest-puppeteer#jest-puppeteerconfigjs
process.env.JEST_PUPPETEER_CONFIG = jestPuppeteerConfigPath;

module.exports = {
  preset: 'jest-puppeteer',
  setupFilesAfterEnv: [setupFilePath],
  roots: [APP_SRC],
  testMatch: [TEST_PATTERNS.VISUAL],
  transform: {
    //https://kulshekhar.github.io/ts-jest/user/config/
    ...tsjestPreset.transform,
  },
};
