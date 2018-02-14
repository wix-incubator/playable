const rollup = require('rollup');

const typescript = require('rollup-plugin-typescript2');
const nodeResolve = require('rollup-plugin-node-resolve');
const uglify = require('rollup-plugin-uglify');
const dot = require('rollup-plugin-dot');

const commonjs = require('./plugins/commonjs');
const postcss = require('./plugins/postcss/plugin');


const isDevelop = process.env.NODE_ENV !== 'production';
const isCssExtractionNeeded = process.argv.indexOf('--extract-css') !== -1;

const inputPath = 'src/index.ts';

const defaultOutput = {
  exports: 'named',
  name: 'Playable',
  file: 'dist/rollup/playable.js',
  format: 'umd',
  sourcemap: true
}

const minifiedOutput = {
  ...defaultOutput,
  file: 'dist/rollup/playable.min.js'
}

const getPlugins = isDevelop => ([
  nodeResolve({
    jsnext: true
  }),
  commonjs(),
  postcss(isDevelop, isCssExtractionNeeded),
  dot({
    templateSettings: {
      varname: 'props',
      interpolate: /\$\{([\s\S]+?)\}/g,
      selfcontained: true,
    }
  }),
  typescript({
    verbosity: 1
  }),
]);

async function build(isDevelop) {
  const bundle = await rollup.rollup({
    input: inputPath,
    plugins: getPlugins(isDevelop)
  });

  await bundle.write(defaultOutput);
}

async function buildMin(isDevelop) {
  const bundle = await rollup.rollup({
    input: inputPath,
    plugins: [
      ...getPlugins(isDevelop),
      uglify()
    ]
  });

  await bundle.write(minifiedOutput);
}

build(isDevelop);
buildMin(isDevelop);
