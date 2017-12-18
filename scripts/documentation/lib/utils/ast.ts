const COMMENT_BLOCK_TYPE = 'CommentBlock';
const INTERFACE_TYPE = 'TSInterfaceDeclaration';
const JSDOC_PATTERN = /^\*[^*]+/;

function getDecoratorArguments(decoratorNode) {
  return decoratorNode.expression.arguments;
}

function isJSDocComment(comment: { value: string; type: string }) {
  return (
    comment.type === COMMENT_BLOCK_TYPE && JSDOC_PATTERN.test(comment.value)
  );
}

function isInterface(node) {
  return node.type === INTERFACE_TYPE;
}

function createCommentBlock(description) {
  return {
    type: COMMENT_BLOCK_TYPE,
    value: description,
  };
}

function createJSDocCommentBlock(description) {
  return createCommentBlock(`* ${description}`);
}

export {
  isInterface,
  getDecoratorArguments,
  isJSDocComment,
  createCommentBlock,
  createJSDocCommentBlock,
};
