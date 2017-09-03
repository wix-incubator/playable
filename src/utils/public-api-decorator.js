import isEqual from 'lodash/isEqual';


export const PUBLIC_API_PROPERTY = '___publicAPI';

const publicAPI = name => (target, property, descriptor) => {
    const methodName = name || property;

    if (!target[PUBLIC_API_PROPERTY]) {
      target[PUBLIC_API_PROPERTY] = {};
    }

    if (target[PUBLIC_API_PROPERTY][methodName]) {
      if (!isEqual(target[PUBLIC_API_PROPERTY][methodName], descriptor)) {
        throw new Error(`Method "${methodName}" for public API in ${target.constructor.name} is already defined`);
      }
    }

    target[PUBLIC_API_PROPERTY][methodName] = descriptor;
  };


export default publicAPI;
