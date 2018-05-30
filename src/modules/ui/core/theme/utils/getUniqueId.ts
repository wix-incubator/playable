import camelToKebab from './camelToKebab';

const generatedIds: Map<string, number> = new Map();

function getUniquePostfix(className: string): string {
  if (generatedIds.has(className)) {
    const newID: number = generatedIds.get(className) + 1;
    generatedIds.set(className, newID);

    return `${newID}`;
  }

  generatedIds.set(className, 0);
  return '';
}

function getUniqueId(classImportName: string): string {
  const kebabName: string = camelToKebab(classImportName);

  return `${kebabName}${getUniquePostfix(kebabName)}`;
}

export default getUniqueId;
