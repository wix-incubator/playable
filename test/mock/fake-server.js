import express from 'express';
import {render} from './tmpl';

export function start(port = 3000) {
  const app = express();

  app.use('/', (req, res) => {
    res.send(render('./test/mock/index.ejs'));
  });

  return app.listen(port, () => {
    console.log(`Fake server is running on port ${port}`);
  });
}
