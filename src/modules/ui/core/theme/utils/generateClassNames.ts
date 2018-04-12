import getUniqueId from './getUniqueId';

import { IStyles } from '../../types';
import { ICSSRules } from '../types';

function getUniqueClassName(classImportName: string) {
  return `wix-playable--${getUniqueId(classImportName)}`;
}

function generateClassNames(rules: ICSSRules): IStyles {
  return Object.keys(rules).reduce(
    (acc, classImportName) => ({
      ...acc,
      [classImportName]: getUniqueClassName(classImportName),
    }),
    {},
  );
}

export default generateClassNames;
