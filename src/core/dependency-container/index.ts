import createContainer from './createContainer';
import Lifetime from './constants/Lifetime';
import registrations from './registrations';

export default {
  createContainer,
  Lifetime,
  ...registrations,
};
