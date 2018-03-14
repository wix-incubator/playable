function reduce(
  arrayLike: { length: number },
  callback: Function,
  initialValue: any,
) {
  return Array.prototype.reduce.call(arrayLike, callback, initialValue);
}

function forEachMatch(string: string, pattern: RegExp, callback: Function) {
  let match = pattern.exec(string);

  while (match !== null) {
    callback(match);
    match = pattern.exec(string);
  }
}

export { reduce, forEachMatch };
