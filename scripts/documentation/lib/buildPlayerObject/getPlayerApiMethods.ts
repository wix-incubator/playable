import traversePlayerApiMethods from '../utils/traversePlayerApiMethods';
import createPlayerApiMethod from './createPlayerApiMethod';

function getPlayerApiMethods(ast) {
  const methods = [];

  traversePlayerApiMethods(ast, {
    enter(node) {
      methods.push(createPlayerApiMethod(node));
    },
  });

  return methods;
}

export default getPlayerApiMethods;
