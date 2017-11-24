import * as t from '@babel/types';
import * as _ from 'lodash';

import glob from '../utils/glob';
import parseFile from '../utils/parseFile';
import getPlayerApiMethods from './getPlayerApiMethods';
import { createJSDocCommentBlock } from '../utils/ast';

function buildPlayerClassDeclaration(playerApiMethods) {
  const playerClassDeclaration = t.classDeclaration(
    t.identifier('Player'),
    null,
    t.classBody(playerApiMethods),
  );

  // NOTE: add empty JSDoc to force `documentation.js` to add this class to documentation
  playerClassDeclaration.leadingComments = [createJSDocCommentBlock('')];

  return playerClassDeclaration;
}

function buildPlayerClass(pattern) {
  const files = glob(pattern);
  const playerApiMethods = _.flatMap(files, filePath =>
    getPlayerApiMethods(parseFile(filePath)),
  );

  return buildPlayerClassDeclaration(playerApiMethods);
}

export default buildPlayerClass;
