const t = require('@babel/types');
const { isJSDocComment, createJSDocComment } = require('okidoc/lib/utils/ast');

const {
  isPlayerApiDecorator,
  getNameFromPlayerApiDecorator,
} = require('./playerApi');

function createPlayerApiMethod(playerApiMethod) {
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

module.exports = createPlayerApiMethod;
