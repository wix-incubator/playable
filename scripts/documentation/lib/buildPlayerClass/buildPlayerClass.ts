import * as t from '@babel/types';
import * as _ from 'lodash';

import glob from '../utils/glob';
import parseFile from '../utils/parseFile';
import getPlayerApiMethods from './getPlayerApiMethods';

function buildPlayerClassDeclaration(playerApiMethods) {
  return t.classDeclaration(
    t.identifier('Player'),
    null,
    t.classBody(playerApiMethods),
  );
}

function buildPlayerClass(pattern) {
  const files = glob(pattern);
  const playerApiMethods = _.flatMap(files, filePath =>
    getPlayerApiMethods(parseFile(filePath)),
  );

  return buildPlayerClassDeclaration(playerApiMethods);
}

export default buildPlayerClass;
