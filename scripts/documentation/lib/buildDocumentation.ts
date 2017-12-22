import generate from '@babel/generator';
import * as documentation from 'documentation';

import buildDocumentationAst from './buildDocumentationAst';

const PLAYER_MODULES_PATH_PATTERN = 'src/default-modules/**/*.ts';
const PLAYER_CLASS_JSDOC_COMMENT = 'Player public methods';

function buildDocumentation(
  pattern = PLAYER_MODULES_PATH_PATTERN,
  {
    format = 'json',
    playerClassJSDocComment = PLAYER_CLASS_JSDOC_COMMENT,
  } = {},
) {
  // TODO: parse and traverse files only one time
  const documentationSource = generate(
    buildDocumentationAst(pattern, { playerClassJSDocComment }),
  ).code;

  return documentation
    .build([{ source: documentationSource }], { shallow: true })
    .then(documentation.formats[format]);
}

export default buildDocumentation;
