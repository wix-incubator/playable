const { Server: KarmaServer } = require('karma');
const start = require('../server/fake-server');

function startKarma() {
    const karmaOptions = {
        port: 9876,
        configFile: `${process.cwd()}/test/karma.conf.js`,
        singleRun: true
    };
    const karmaServer = new KarmaServer(karmaOptions, cleanup);
    karmaServer.start();
}

start(5000, startKarma);

function cleanup(exitCode) {
  process.exit(exitCode);
}
