module.exports = wallaby => {
  const config = require('yoshi/config/wallaby-mocha')(wallaby);
  const { hints } = config;
  config.hints = {
    hints,
    ignoreCoverage: /ignore coverage/
  };

  return config;
};
