const commonjs = require('rollup-plugin-commonjs');


const plugin = () => commonjs({
  include: 'node_modules/**',
  extensions: [ '.js', '.ts' ],  // Default: [ '.js' ]

  sourceMap: false,

  namedExports: {
    'node_modules/eventemitter3/index.js': [ 'EventEmitter' ],
  }
});

module.exports = plugin;
