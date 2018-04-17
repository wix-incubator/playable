const configBase = require('./karma.conf.base');

/* ignore coverage */
module.exports = function(config) {
  configBase(config, {
    testName: 'Playable with adapters'
  });

  config.set({
    // list of files / patterns to load in the browser
    files: ['../dist/statics/playable-test-with-adapters.bundle.js'],
  });
};
