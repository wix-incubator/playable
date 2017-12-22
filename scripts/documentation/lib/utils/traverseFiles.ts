import traverse from '@babel/traverse';
import parseFile from './parseFile';

type Visitor = { [nodeType: string]: Function | Visitor };

function traverseFiles(files: string[], visitor: Visitor) {
  files.forEach(filePath => {
    traverse(parseFile(filePath), visitor);
  });
}

export default traverseFiles;
