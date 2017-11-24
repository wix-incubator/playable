import * as t from '@babel/types';

import {
  getDecoratorArguments,
  isJSDocComment,
  createJSDocCommentBlock,
} from '../utils/ast';

import {
  isPlayerApiDecorator,
  getNameFromPlayerApiDecorator,
} from '../utils/playerApiDecorator';

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

  playerApiMethod.leadingComments = [
    playerApiJSDoc || createJSDocCommentBlock(''),
  ];
  playerApiMethod.decorators = [];
  playerApiMethod.body = t.blockStatement([]);

  return playerApiMethod;
}

export default createApiMethod;
