const path = require('path');
const postcss = require('rollup-plugin-postcss');
const autoprefixer = require('autoprefixer');

const plugin =
  (isDevelop, isExtractNeeded) =>
    postcss({
      modules: {
        generateScopedName: isDevelop ? '[name]__[local]___[hash:base64:5]' : '__[hash:base64:5]'
      },
      plugins: [
        autoprefixer()
      ],
      sourceMap: false,
      minimize: !isDevelop,
      extract: isExtractNeeded && path.resolve('./dist/rollup/playable.css')
    });

module.exports = plugin;
