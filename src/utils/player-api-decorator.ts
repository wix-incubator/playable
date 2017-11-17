import * as isEqual from 'lodash/isEqual';


export const PLAYER_API_PROPERTY = '___playerAPI';

// tslint:disable-next-line
const playerAPI = (name?) => (target, property, descriptor) => {
    const methodName = name || property;

    if (!target[PLAYER_API_PROPERTY]) {
      target[PLAYER_API_PROPERTY] = {};
    }

    if (target[PLAYER_API_PROPERTY][methodName]) {
      if (!isEqual(target[PLAYER_API_PROPERTY][methodName], descriptor)) {
        throw new Error(`Method "${methodName}" for public API in ${target.constructor.name} is already defined`);
      }
    }

    target[PLAYER_API_PROPERTY][methodName] = descriptor;
  };


export default playerAPI;
