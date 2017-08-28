import createContainer from './createContainer';
import Lifetime from './constants/Lifetime';
import registrations from './registrations';

require('core-js/fn/object');
require('core-js/fn/array/iterator');

export default {
  createContainer,
  Lifetime,
  ...registrations
};

