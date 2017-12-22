import { createJSDocCommentBlock } from '../utils/ast';

function createPlayerApiInterface(node) {
  // NOTE: add empty JSDoc to force `documentation.js` to add this class to documentation
  node.leadingComments = node.leadingComments || [createJSDocCommentBlock('')];

  return node;
}

export default createPlayerApiInterface;
