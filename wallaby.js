module.exports = wallaby => {
  const config = require('haste-preset-playable/src/config/wallabyConfig')(
    wallaby,
  );
  const { hints } = config;
  config.hints = {
    hints,
    ignoreCoverage: /ignore coverage/,
  };

  return config;
};
