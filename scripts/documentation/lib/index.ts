import generate from '@babel/generator';
import * as documentation from 'documentation';

import buildPlayerClass from './buildPlayerClass';
import buildPlayerObject from './buildPlayerObject';

const PLAYER_MODULES_PATH_PATTERN = 'src/default-modules/**/*.ts';

function buildDocumentation(
  pattern = PLAYER_MODULES_PATH_PATTERN,
  format = 'json',
) {
  const source = generate(buildPlayerClass(pattern)).code;

  return documentation
    .build([{ source }], { shallow: true })
    .then(documentation.formats[format]);
}

export { buildPlayerClass, buildPlayerObject, buildDocumentation };
