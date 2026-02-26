import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';
import { createRequire } from 'module';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import postcss from 'rollup-plugin-postcss';
import dot from 'rollup-plugin-dot';
import terser from '@rollup/plugin-terser';
import * as sass from 'sass';

const require = createRequire(import.meta.url);
const postcssImport = require('postcss-import');
const autoprefixer = require('autoprefixer');
const { DOTJS_OPTIONS } = require('./dev-env/constants.js');

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const SRC_DIR = path.resolve(__dirname, 'src');
const DIST_DIR = path.resolve(__dirname, 'dist/statics');
const LIBRARY_NAME = 'Playable';

/**
 * Custom Sass loader using the modern Dart Sass JS API (compileString) to avoid
 * "Deprecation Warning [legacy-js-api]". Replaces the built-in sass loader in rollup-plugin-postcss.
 */
const sassModernLoader = {
  name: 'sass',
  test: /\.(sass|scss)$/,
  process({ code }) {
    const data = this.options?.data ?? '';
    const loadPaths = this.options?.includePaths ?? [];
    const entryUrl = pathToFileURL(path.resolve(this.id));
    const result = sass.compileString(data + code, {
      url: entryUrl,
      loadPaths,
      sourceMap: Boolean(this.sourceMap),
      syntax: /\.sass$/.test(this.id) ? 'indented' : 'scss',
    });
    if (result.loadedUrls) {
      for (const u of result.loadedUrls) {
        if (u.protocol === 'file:') this.dependencies.add(fileURLToPath(u));
      }
    }
    return Promise.resolve({
      code: result.css,
      map: result.sourceMap ? JSON.stringify(result.sourceMap) : undefined,
    });
  },
};

/**
 * @param {{ name: string, input: string, minify?: boolean }} opts
 */
function createConfig({ name, input, minify = true }) {
  const inputPath = path.join(SRC_DIR, input);
  const outputFile = path.join(DIST_DIR, `${name}.bundle${minify ? '.min' : ''}.js`);

  return {
    input: inputPath,
    output: {
      name: LIBRARY_NAME,
      format: 'umd',
      file: outputFile,
      exports: 'named',
      sourcemap: true,
    },
    plugins: [
      resolve({ browser: true, preferBuiltins: false }),
      commonjs({
        include: /node_modules/,
        extensions: ['.js', '.ts'],
      }),
      postcss({
        // Apply CSS modules to ALL .scss (not just .module.scss). Plugin uses onlyModules when modules === true.
        modules: true,
        use: [
          ['sass', { includePaths: [path.join(SRC_DIR, 'modules')] }],
        ],
        loaders: [sassModernLoader],
        inject: true,
        extract: false,
        sourceMap: true,
        minimize: minify && { safe: true },
        plugins: [postcssImport(), autoprefixer()],
      }),
      dot({ templateSettings: DOTJS_OPTIONS }),
      typescript({
        tsconfig: path.join(__dirname, 'tsconfig.json'),
        declaration: false,
        compilerOptions: { module: 'ESNext', moduleResolution: 'node' },
      }),
      ...(minify
        ? [
            terser({
              maxWorkers: 1,
              format: {
                comments: false,
                ecma: 2017,
              },
              compress: {
                passes: 2,
                dead_code: true,
                unused: true,
                collapse_vars: true,
                reduce_vars: true,
                inline: 3,
                join_vars: true,
                // Set to true to strip console.* and reduce size further (optional)
                drop_console: false,
              },
            }),
          ]
        : []),
    ],
  };
}

/** Entry points: name => path relative to src/ (minified entries get both .js and .min.js) */
const entries = {
  playable: 'index.ts',
  'playable-dash': 'with-dash.ts',
  'playable-hls': 'with-hls.ts',
  'playable-with-adapters': 'with-adapters.ts',
};

export default Object.entries(entries).flatMap(([name, input]) => [
  createConfig({ name, input, minify: false }),
  createConfig({ name, input, minify: true }),
]);
