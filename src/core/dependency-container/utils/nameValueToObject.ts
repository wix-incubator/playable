import * as isPlainObject from 'lodash/isPlainObject';
import assign from './assign';

export default function(name, value) {
  let obj = name;
  if (!isPlainObject(obj)) {
    obj = assign({ [name]: value });
  }

  return obj;
}
