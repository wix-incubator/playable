const { nodeASTUtils: { cleanUpClassMethod } } = require('okidoc-md');

const {
  isPlayerApiDecorator,
  getNameFromPlayerApiDecorator,
} = require('./playerApi');

function createPlayerApiClassMethod(node) {
  const playerApiDecorator = node.decorators.find(isPlayerApiDecorator);

  cleanUpClassMethod(node, {
    identifierName: getNameFromPlayerApiDecorator(playerApiDecorator),
  });

  return node;
}

module.exports = createPlayerApiClassMethod;
