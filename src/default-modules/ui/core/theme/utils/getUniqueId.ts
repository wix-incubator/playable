const generatedIds = new Set();
function getUniqueId(): string {
  const id = (Math.random() * 1e4).toFixed(0);

  if (generatedIds.has(id)) {
    return getUniqueId();
  }

  generatedIds.add(id);
  return id;
}

export default getUniqueId;
