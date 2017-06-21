import sinon from 'sinon';


export default function getProxy(constructor, props = {}) {
  let object;

  switch (typeof constructor) {
    case 'function':
      object = new constructor(props);
      break;
    case 'object' :
      object = constructor;
      break;
    default:
      console.error('Use getProxy only with objects or constructor functions'); //eslint-disable-line no-console
      break;
  }

  if (!object) {
    return null;
  }

  return new Proxy(object, {
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
