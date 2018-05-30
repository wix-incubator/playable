export const PLAYER_API_PROPERTY = '___playerAPI';

const checkDescriptorsOnEquality = (
  desc1: PropertyDescriptor,
  desc2: PropertyDescriptor,
) =>
  desc1.value === desc2.value &&
  desc1.get === desc2.get &&
  desc1.set === desc2.set;

const playerAPI = (name?: string) => (
  target: any,
  property: string,
  descriptor: PropertyDescriptor,
) => {
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
