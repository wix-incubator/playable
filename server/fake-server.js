const express = require('express');
const render = require('./tmpl');
const generateMediaResponse = require('./http-media-response');

module.exports = function start(port = 5000, onListen = () => {}) {
  const app = express();

  app.get('/', (req, res) => {
    res.send(render('./server/index.ejs'));
  });

  app.get('/assets/:fileName', (req, res) => {
    generateMediaResponse(req, res);
  });
  console.log(port);
  return app.listen(port, () => {
    console.log('Server is listening on port ' + port + '...');
    onListen();
  });
}
