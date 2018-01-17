import * as t from '@babel/types';
import { createJSDocComment } from '../utils/ast';

type PlayerClassOptions = {
  playerClassJSDocComment?: string;
};

function buildPlayerClassDeclaration(
  playerApiMethods,
  options: PlayerClassOptions = {},
) {
  const playerClassDeclaration = t.classDeclaration(
    t.identifier('Player'),
    null,
    t.classBody(playerApiMethods),
  );

  // NOTE: if JSDoc not provided, add empty comment to force JSDoc util to add this class to documentation
  t.addComment(
    playerClassDeclaration,
    'leading',
    createJSDocComment(options.playerClassJSDocComment || ''),
  );

  return playerClassDeclaration;
}

export { PlayerClassOptions };

export default buildPlayerClassDeclaration;
