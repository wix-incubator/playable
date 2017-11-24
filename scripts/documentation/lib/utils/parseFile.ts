import * as fs from 'fs';
import * as babylon from 'babylon';

function parseFile(filePath) {
  const fileSource = fs.readFileSync(filePath).toString();

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

export default parseFile;
