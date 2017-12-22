import * as babylon from 'babylon';

function parseFileSource(fileSource) {
  return babylon.parse(fileSource, {
    sourceType: 'module',
    plugins: [
      'typescript',
      'classProperties',
      'objectRestSpread',
      'decorators',
    ],
  });
}

export default parseFileSource;
