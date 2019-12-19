const path = require('path');
const { DOTJS_OPTIONS } = require('haste-preset-playable/src/config/constants');
const dotLoader = require('dotjs-loader').default;

module.exports = {
  process(src, filename, config, options) {
    const scopedLoader = dotLoader.bind({ query: DOTJS_OPTIONS });
    return scopedLoader(src).replace(
      'export default ',
      'module.exports.default = ',
    );
  },
};
