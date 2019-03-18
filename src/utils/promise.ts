export const isPromiseAvailable = (function() {
  const globalNS: any = (function() {
    if (typeof global !== 'undefined') {
      return global;
    }
    if (typeof window !== 'undefined') {
      return window;
    }
    throw new Error('unable to locate global object');
  })();
  //tslint:disable-next-line
  return globalNS['Promise'] ? true : false;
})();
