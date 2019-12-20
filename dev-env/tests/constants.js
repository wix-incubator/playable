const APP_ROOT = process.cwd();
const APP_SRC = `${APP_ROOT}/src`;

const TEST_PATTERNS = {
  UNIT: '**/*.spec.ts',
  VISUAL: `**/*.visual.+(ts|js){,x}`,
};

module.exports = {
  APP_SRC,
  TEST_PATTERNS,
};
