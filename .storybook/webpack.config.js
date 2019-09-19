const { DOTJS_OPTIONS } = require('haste-preset-playable/src/config/constants');

module.exports = ({ config }) => {
  config.module.rules = [
    ...config.module.rules,
    require('haste-preset-playable/src/loaders/typescript')(),
    require('haste-preset-playable/src/loaders/dot')(DOTJS_OPTIONS),
    require('haste-preset-playable/src/loaders/assets')(),
    require('haste-preset-playable/src/loaders/svg')(),
    ...require('haste-preset-playable/src/loaders/sass')({}),
  ];

  config.resolve.extensions.push('.ts', '.tsx');
  return config;
};
