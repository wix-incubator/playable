const path = require('path');
const sass = require('node-sass');
const postcss = require('rollup-plugin-postcss');
const postcssModules = require('postcss-modules');
const autoprefixer = require('autoprefixer');
const CssModulesSassLoader = require('./css-modules-sass-loader');
const clean = require('postcss-clean');

const cssExportMap = {};

const sassPreprocessor = (content, id) => new Promise((resolve) => {
  const result = sass.renderSync({ file: id });

  resolve({ code: result.css.toString() });
});

const plugin =
  (isDevelop, isExtractNeeded) =>
    postcss({
      extract: isExtractNeeded ? path.resolve('./dist/rollup/playable.css') : false,
      sourceMap: false,
      extensions: ['.scss'],
      preprocessor: sassPreprocessor, // Pre-process all imports with Sass
      plugins: [
        autoprefixer(),
        postcssModules({
          Loader: CssModulesSassLoader, // Load all "composes" files with Sass
          generateScopedName: isDevelop ? '[name]__[local]___[hash:base64:5]' : '__[hash:base64:5]',
          getJSON(id, exportTokens) {
            cssExportMap[id] = exportTokens
          }
        }),
        clean()
      ],
      getExportNamed: false,
      getExport(id) {
        return cssExportMap[id]
      }
    });

module.exports = plugin;
