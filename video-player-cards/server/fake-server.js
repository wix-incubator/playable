const express = require('express');
const render = require('./tmpl');

module.exports = function start(port = 3000, onListen = () => {}) {
  const app = express();

  app.get('/', (req, res) => {
    res.send(render('./src/index.ejs'));
  });

  return app.listen(port, () => {
    console.log('Server is listening on port ' + port + '...');
    onListen();
  });
};
