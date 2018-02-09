const { Server: KarmaServer } = require('karma');

/* ignore coverage */
const startDevServer = require('./dev-server');

/* ignore coverage */
function startKarma() {
    const karmaOptions = {
        port: 9876,
        configFile: `${process.cwd()}/dev-env/karma.conf.js`,
        singleRun: true
    };
    const karmaServer = new KarmaServer(karmaOptions, cleanup);
    karmaServer.start();
}

/* ignore coverage */
startDevServer(5100, () => {
  startKarma();
});

/* ignore coverage */
function cleanup(exitCode) {
  process.exit(exitCode);
}
