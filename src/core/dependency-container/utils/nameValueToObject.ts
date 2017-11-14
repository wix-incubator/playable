
import * as isPlainObject from 'lodash/isPlainObject';

export default function (name, value) {
  let obj = name;
  if (!isPlainObject(obj)) {
    obj = Object.assign({ [name]: value });
  }

  return obj;
}
