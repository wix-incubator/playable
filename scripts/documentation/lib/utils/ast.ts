const COMMENT_BLOCK_TYPE = 'CommentBlock';
const JSDOC_PATTERN = /^\*[^*]+/;

function getDecoratorArguments(decoratorNode) {
  return decoratorNode.expression.arguments;
}

function isJSDocComment(comment: { value: string; type: string }) {
  return (
    comment.type === COMMENT_BLOCK_TYPE && JSDOC_PATTERN.test(comment.value)
  );
}

function createCommentBlock(description) {
  return {
    type: COMMENT_BLOCK_TYPE,
    value: description,
  };
}

function createJSDocComment(description = '') {
  // cleanup spaces
  description = description.replace(/\n\s*/g, '\n');

  return description.startsWith('*') ? description : `* ${description}`;
}

function createJSDocCommentBlock(description) {
  return createCommentBlock(createJSDocComment(description));
}

export {
  getDecoratorArguments,
  isJSDocComment,
  createCommentBlock,
  createJSDocComment,
  createJSDocCommentBlock,
};
