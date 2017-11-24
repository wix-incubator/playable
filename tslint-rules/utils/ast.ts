function isPlayerApiDecorator(decorator) {
  return decorator.expression.expression.escapedText === 'playerAPI';
}

function getDecoratorExpressionName(decorator) {
  return decorator.expression.expression.escapedText;
}

function getDecoratorArguments(decorator) {
  return decorator.expression.arguments;
}

export {
  getDecoratorExpressionName,
  isPlayerApiDecorator,
  getDecoratorArguments,
};
