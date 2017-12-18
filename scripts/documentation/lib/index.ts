import generate from '@babel/generator';
import * as documentation from 'documentation';

import buildPlayerClass from './buildPlayerClass';
import buildInterfaces from './buildInterfaces';
import buildPlayerObject from './buildPlayerObject';

const PLAYER_MODULES_PATH_PATTERN = 'src/default-modules/**/*.ts';

function buildDocumentation(
  pattern = PLAYER_MODULES_PATH_PATTERN,
  format = 'json',
) {
  // TODO: parse and traverse files only one time
  const playerClassSource = generate(buildPlayerClass(pattern)).code;
  const interfacesSource = generate(buildInterfaces(pattern)).code;

  return documentation
    .build([{ source: playerClassSource }, { source: interfacesSource }], {
      shallow: true,
    })
    .then(documentation.formats[format]);
}

export { buildPlayerClass, buildPlayerObject, buildDocumentation };
