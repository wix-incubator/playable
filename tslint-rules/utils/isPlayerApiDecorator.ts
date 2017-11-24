import { getDecoratorExpressionName } from './ast';

const PLAYER_API_DECORATOR_NAME = 'playerAPI';

function isPlayerApiDecorator(decorator) {
  return getDecoratorExpressionName(decorator) === PLAYER_API_DECORATOR_NAME;
}

export { PLAYER_API_DECORATOR_NAME };

export default isPlayerApiDecorator;
