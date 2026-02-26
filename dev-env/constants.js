/** doT template options (same as rollup.config.mjs / original haste-preset-playable) */
const DOTJS_OPTIONS = {
  varname: 'props',
  interpolate: /\$\{([\s\S]+?)\}/g,
  selfcontained: true,
};

module.exports = { DOTJS_OPTIONS };
