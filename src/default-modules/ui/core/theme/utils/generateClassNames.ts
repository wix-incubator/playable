import camelToKebab from './camelToKebab';
import getUniqueId from './getUniqueId';

import { IStyles } from '../../types';
import { ICSSRules } from '../types';

function getUniqueClassName(classImportName) {
  return `wix-vp--${camelToKebab(classImportName)}-${getUniqueId()}`;
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
