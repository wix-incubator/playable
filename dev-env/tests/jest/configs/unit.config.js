const { defaults: tsjestPreset } = require('ts-jest/presets');

const { APP_SRC, TEST_PATTERNS } = require('../../constants');

module.exports = {
  testEnvironment: 'node',
  setupFiles: ['./unit.setup.js'],
  moduleNameMapper: {
    '\\.(css|scss)$': 'identity-obj-proxy',
  },
  roots: [APP_SRC],
  testMatch: [TEST_PATTERNS.UNIT],
  transform: {
    ...tsjestPreset.transform,
    '\\.(dot)$': require.resolve('../utils/dotJsTransformer.js'),
  },
};
