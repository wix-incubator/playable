export const PLAYER_API_PROPERTY = '___playerAPI';

const checkDescriptorsOnEquality = (desc1, desc2) =>
  desc1.value === desc2.value &&
  desc1.get === desc2.get &&
  desc1.set === desc2.set;

// tslint:disable-next-line
const playerAPI = (name?) => (target, property, descriptor) => {
  const methodName = name || property;

  if (!target[PLAYER_API_PROPERTY]) {
    target[PLAYER_API_PROPERTY] = {};
  }

  if (target[PLAYER_API_PROPERTY][methodName]) {
    if (
      !checkDescriptorsOnEquality(
        target[PLAYER_API_PROPERTY][methodName],
        descriptor,
      )
    ) {
      throw new Error(
        `Method "${methodName}" for public API in ${
          target.constructor.name
        } is already defined`,
      );
    }
  }

  target[PLAYER_API_PROPERTY][methodName] = descriptor;
};

export default playerAPI;
