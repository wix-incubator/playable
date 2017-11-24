import traverse from '@babel/traverse';

import { isPlayerApiDecorator } from './playerApiDecorator';

function traversePlayerApiMethods(ast, { enter }) {
  traverse(ast, {
    enter(path) {
      if (isPlayerApiDecorator(path.node)) {
        enter(path.parent);
      }
    },
  });
}

export default traversePlayerApiMethods;
