import * as t from '@babel/types';

import { getDecoratorArguments } from '../utils/ast';

function isPlayerApiDecorator(node) {
  return t.isDecorator(node) && node.expression.callee.name === 'playerAPI';
}

function getNameFromPlayerApiDecorator(decoratorNode) {
  const decoratorArguments = getDecoratorArguments(decoratorNode);

  return decoratorArguments.length && t.isStringLiteral(decoratorArguments[0])
    ? decoratorArguments[0].value
    : null;
}

export { isPlayerApiDecorator, getNameFromPlayerApiDecorator };
