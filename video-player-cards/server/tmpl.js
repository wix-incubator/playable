const fs = require('fs');
const ejs = require('ejs');

module.exports = function render(template, data) {
  const options = Object.assign({
    debug: true,
    basename: '/',
    staticsBaseUrl: '//localhost:3200/'
  }, data);

  return ejs.render(fs.readFileSync(template, { encoding: 'utf8' }), options);
};
