const t = require('@babel/types');
const {
  nodeASTUtils: { cleanUpNodeJSDoc, removeNodeDecorators, removeNodeBody },
} = require('okidoc-md');

const {
  isPlayerApiDecorator,
  getNameFromPlayerApiDecorator,
} = require('./playerApi');

function createPlayerApiMethod(playerApiMethod) {
  const playerApiDecorator = playerApiMethod.decorators.find(
    isPlayerApiDecorator,
  );

  const methodNameFromPlayerApiDecorator = getNameFromPlayerApiDecorator(
    playerApiDecorator,
  );

  if (methodNameFromPlayerApiDecorator) {
    playerApiMethod.key = t.identifier(methodNameFromPlayerApiDecorator);
  }

  cleanUpNodeJSDoc(playerApiMethod);
  removeNodeDecorators(playerApiMethod);
  removeNodeBody(playerApiMethod);

  return playerApiMethod;
}

module.exports = createPlayerApiMethod;
