import * as t from '@babel/types';
import template from '@babel/template';
import * as _ from 'lodash';

import glob from '../utils/glob';
import parseFile from '../utils/parseFile';

import getPlayerApiMethods from './getPlayerApiMethods';

function buildPlayerObjectExpression(playerApiMethods) {
  const buildRequire = template(`
      const player = OBJECT_EXPRESSION;
    `);

  return buildRequire({
    OBJECT_EXPRESSION: t.objectExpression(playerApiMethods),
  });
}

function buildPlayerObject(pattern) {
  const files = glob(pattern);
  const playerApiMethods = _.flatMap(files, filePath =>
    getPlayerApiMethods(parseFile(filePath)),
  );

  return buildPlayerObjectExpression(playerApiMethods);
}

export default buildPlayerObject;
