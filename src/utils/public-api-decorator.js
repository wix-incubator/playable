import isEqual from 'lodash/isEqual';

export default function publicAPI(name) {
  return (target, property, descriptor) => {
    const methodName = name || property;

    if (!target._publicAPI) {
      target._publicAPI = {};
    }

    if (target._publicAPI[methodName]) {
      if (!isEqual(target._publicAPI[methodName], descriptor)) {
        throw new Error(`Method "${methodName}" for public API in ${target.constructor.name} is already defined`);
      }
    }

    target._publicAPI[methodName] = descriptor;
  };
}
