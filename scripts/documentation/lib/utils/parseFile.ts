import * as fs from 'fs';
import parseFileSource from './parseFileSource';

function parseFile(filePath) {
  const fileSource = fs.readFileSync(filePath).toString();

  return parseFileSource(fileSource);
}

export default parseFile;
