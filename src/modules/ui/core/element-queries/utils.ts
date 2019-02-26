function reduce(
  arrayLike: { length: number },
  callback: (...args: any[]) => void,
  initialValue: any,
) {
  return Array.prototype.reduce.call(arrayLike, callback, initialValue);
}

function forEachMatch(
  string: string,
  pattern: RegExp,
  callback: (match: RegExpExecArray) => void,
) {
  let match = pattern.exec(string);

  while (match !== null) {
    callback(match);
    match = pattern.exec(string);
  }
}

export { reduce, forEachMatch };
