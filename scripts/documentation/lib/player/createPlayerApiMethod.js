const t = require('@babel/types');
const { JSDocASTUtils: { isJSDocComment, createJSDocCommentValue } } = require('okidoc-md');

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
    createJSDocCommentValue((playerApiJSDoc && playerApiJSDoc.value) || ''),
  );

  playerApiMethod.decorators = [];
  playerApiMethod.body = t.blockStatement([]);

  return playerApiMethod;
}

module.exports = createPlayerApiMethod;
