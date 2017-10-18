const express = require('express');

const render = require('./tmpl');

module.exports = function start(port = 5000, onListen = () => {}) {
  const app = express();

  app.get('/', (req, res) => {
    res.send(render('./dev-env/index.ejs'));
  });

  return app.listen(port, () => {
    console.log('Dev server is listening on port ' + port + '...');
    onListen();
  });
};
