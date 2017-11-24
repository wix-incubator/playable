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

  const _apiMethod = {
    kind: playerApiMethod.kind,
    key: playerApiMethod.key,
    params: playerApiMethod.params,
    body: t.blockStatement([]),
  };

  if (methodNameFromPlayerApiDecorator) {
    _apiMethod.key = t.identifier(methodNameFromPlayerApiDecorator);
  }

  const apiMethod = t.objectMethod(
    _apiMethod.kind,
    _apiMethod.key,
    _apiMethod.params,
    _apiMethod.body,
  );

  apiMethod.leadingComments = [playerApiJSDoc || createJSDocCommentBlock('')];

  return apiMethod;
}

export default createApiMethod;
