const { Server: KarmaServer } = require('karma');

const karmaWebpackOptions = {
  port: 9876,
  configFile: `${process.cwd()}/dev-env/karma-webpack.conf.js`,
  singleRun: true
};

const karmaRollupOptions = {
  port: 9877,
  configFile: `${process.cwd()}/dev-env/karma-rollup.conf.js`,
  singleRun: true
};

/* ignore coverage */
function startKarma(config, cb) {

  const server = new KarmaServer(config, cb);
  server.start();
}

/* ignore coverage */
  startKarma(karmaWebpackOptions, () => {
    startKarma(karmaRollupOptions, cleanup);
  });

/* ignore coverage */
function cleanup(exitCode) {
  process.exit(exitCode);
}
