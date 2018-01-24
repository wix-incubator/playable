function getDecoratorArguments(decoratorNode) {
  return decoratorNode.expression.arguments;
}

module.exports = {
  getDecoratorArguments,
};
