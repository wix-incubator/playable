const t = require('@babel/types');

function isPlayerApiDecorator(node) {
  return t.isDecorator(node) && node.expression.callee.name === 'playerAPI';
}

function getNameFromPlayerApiDecorator(decoratorNode) {
  const decoratorArguments = decoratorNode.expression.arguments;

  return decoratorArguments.length && t.isStringLiteral(decoratorArguments[0])
    ? decoratorArguments[0].value
    : null;
}

exports.isPlayerApiDecorator = isPlayerApiDecorator;
exports.getNameFromPlayerApiDecorator = getNameFromPlayerApiDecorator;
