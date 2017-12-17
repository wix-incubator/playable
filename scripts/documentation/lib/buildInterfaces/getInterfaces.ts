import traverse from '@babel/traverse';

import { isInterface } from '../utils/ast';
import createInterface from './createInterface';

function traverseInterfaces(ast, { enter }) {
  traverse(ast, {
    enter(path) {
      if (isInterface(path.node)) {
        enter(path.node);
      }
    },
  });
}

function getInterfaces(ast) {
  const interfaces = [];

  traverseInterfaces(ast, {
    enter(node) {
      interfaces.push(createInterface(node));
    },
  });

  return interfaces;
}

export default getInterfaces;
