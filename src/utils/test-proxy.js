import sinon from 'sinon';


export default function getProxy(constructor, props = {}) {
  return new Proxy(new constructor(props), {
    get: (target, property) => {
      if (!target.hasOwnProperty(property)) {
        target[property] = sinon.spy((...args) => {
          if (constructor.prototype.hasOwnProperty(property)) {
            return constructor.prototype[property].apply(target, args);
          }

          return {};
        });
      }

      return target[property];
    }
  });
}
