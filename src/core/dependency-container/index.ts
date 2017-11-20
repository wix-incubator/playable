import createContainer from './createContainer';
import Lifetime from './constants/Lifetime';
import registrations from './registrations';

import 'core-js/fn/object';
import 'core-js/fn/array/iterator';

export default {
  createContainer,
  Lifetime,
  ...registrations,
};

