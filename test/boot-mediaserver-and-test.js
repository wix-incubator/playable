const { Server: KarmaServer } = require('karma');

/* ignore coverage */
const start = require('../server/fake-server');

/* ignore coverage */
function startKarma() {
    const karmaOptions = {
        port: 9876,
        configFile: `${process.cwd()}/test/karma.conf.js`,
        singleRun: true
    };
    const karmaServer = new KarmaServer(karmaOptions, cleanup);
    karmaServer.start();
}

/* ignore coverage */
start(5000, startKarma);

/* ignore coverage */
function cleanup(exitCode) {
  process.exit(exitCode);
}
