const { defaults: tsjestPreset } = require('ts-jest/presets');

module.exports = {
  testEnvironment: 'node',
  setupFiles: ['<rootDir>/jest.setup.js'],
  moduleNameMapper: {
    '\\.(css|scss)$': 'identity-obj-proxy',
  },
  testMatch: ['**/*.spec.ts'],
  transform: {
    //https://kulshekhar.github.io/ts-jest/user/config/
    ...tsjestPreset.transform,
    '\\.(dot)$': '<rootDir>/dotTransformer.js',
  },
};
