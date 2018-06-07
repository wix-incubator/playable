import getUniqueId from './getUniqueId';

function getUniqueClassName(classImportName: string) {
  return `wix-playable--${getUniqueId(classImportName)}`;
}

function generateClassNames(rules: Playable.ICSSRules): Playable.IStyles {
  return Object.keys(rules).reduce(
    (acc, classImportName) => ({
      ...acc,
      [classImportName]: getUniqueClassName(classImportName),
    }),
    {},
  );
}

export default generateClassNames;
