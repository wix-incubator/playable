// Karma configuration

const sauceLabsLaunchers = {
  SL_Chrome: {
    base: 'SauceLabs',
    browserName: 'chrome',
    version: '48.0',
    platform: 'Linux',
  },
  SL_Firefox: {
    base: 'SauceLabs',
    browserName: 'firefox',
    version: '50.0',
    platform: 'Windows 10',
  },
  SL_InternetExplorer: {
    base: 'SauceLabs',
    browserName: 'internet explorer',
    version: '11.0',
    platform: 'Windows 7',
  },
  SL_Safari: {
    base: 'SauceLabs',
    browserName: 'safari',
    platform: 'OS X 10.13',
    version: '11.0',
  },
};

/* ignore coverage */
module.exports = function(config, { testName }) {
  config.set({
    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',

    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['mocha'],

    // list of files / patterns to load in the browser
    files: [],

    // list of files to exclude
    exclude: [],

    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {},

    plugins: [
      require('karma-mocha'),
      require('karma-sauce-launcher'),
      require('karma-chrome-launcher'),
      require('karma-safari-launcher'),
    ],

    // web server port
    port: 9876,

    // enable / disable colors in the output (reporters and logs)
    colors: true,

    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,

    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,

    ...(process.env.SAUCE_ACCESS_KEY || process.env.TRAVIS
      ? {
          sauceLabs: {
            // https://github.com/karma-runner/karma-sauce-launcher#saucelabs-config-properties-shared-across-all-browsers
            testName: testName,
          },
          customLaunchers: sauceLabsLaunchers,
          browsers: Object.keys(sauceLabsLaunchers),
          reporters: ['dots', 'saucelabs'],
          // https://docs.travis-ci.com/user/gui-and-headless-browsers/#Karma-and-Firefox-inactivity-timeouts
          browserNoActivityTimeout: 120000,
          // Allocating a browser can take pretty long (eg. if we are out of capacity and need to wait
          // for another build to finish) and so the `captureTimeout` typically kills
          // an in-queue-pending request, which makes no sense.
          // https://github.com/angular/angular.js/blob/v1.6.9/karma-shared.conf.js#L194
          captureTimeout: 0,
        }
      : {
          customLaunchers: {
            // https://docs.travis-ci.com/user/chrome#Sandboxing
            ChromeHeadlessNoSandbox: {
              base: 'ChromeHeadless',
              flags: ['--no-sandbox'],
            },
          },
          // start these browsers
          // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
          browsers: ['ChromeHeadlessNoSandbox', 'Safari'],
          reporters: ['progress'],

          // https://docs.travis-ci.com/user/gui-and-headless-browsers/#Karma-and-Firefox-inactivity-timeouts
          browserNoActivityTimeout: 30000,
        }),

    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: true,

    // Concurrency level
    // how many browser should be started simultaneous
    concurrency: Infinity,
  });

  if (process.env.TRAVIS) {
    // https://github.com/angular/angular.js/blob/v1.6.9/karma-shared.conf.js#L179-L182
    // https://github.com/angular/angular/blob/6.0.0-rc.5/karma-js.conf.js#L127-L144
    config.sauceLabs.build = `TRAVIS #${process.env.TRAVIS_BUILD_NUMBER} (${
      process.env.TRAVIS_BUILD_ID
    })`;
    config.sauceLabs.tunnelIdentifier = process.env.TRAVIS_JOB_NUMBER;
    config.sauceLabs.startConnect = false;
  }
};
