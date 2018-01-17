import * as t from '@babel/types';

import { isJSDocComment, createJSDocComment } from '../utils/ast';

import {
  isPlayerApiDecorator,
  getNameFromPlayerApiDecorator,
} from './playerApi';

function createApiMethod(playerApiMethod) {
  const playerApiDecorator = playerApiMethod.decorators.find(
    isPlayerApiDecorator,
  );
  const playerApiComments = playerApiMethod.leadingComments;
  const playerApiJSDoc =
    playerApiComments && playerApiComments.find(isJSDocComment);

  const methodNameFromPlayerApiDecorator = getNameFromPlayerApiDecorator(
    playerApiDecorator,
  );

  if (methodNameFromPlayerApiDecorator) {
    playerApiMethod.key = t.identifier(methodNameFromPlayerApiDecorator);
  }

  t.removeComments(playerApiMethod);
  t.addComment(
    playerApiMethod,
    'leading',
    createJSDocComment((playerApiJSDoc && playerApiJSDoc.value) || ''),
  );

  playerApiMethod.decorators = [];
  playerApiMethod.body = t.blockStatement([]);

  return playerApiMethod;
}

export default createApiMethod;
