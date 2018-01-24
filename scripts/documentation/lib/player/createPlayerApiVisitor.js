const { isPlayerApiDecorator } = require('./playerApi');

function createPlayerApiVisitor(enter) {
  return {
    Decorator(path) {
      if (isPlayerApiDecorator(path.node)) {
        enter(path.parentPath);
      }
    },
  };
}

module.exports = createPlayerApiVisitor;
