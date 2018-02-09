import { __assign } from 'tslib';

export default function(name, value) {
  let obj = name;
  if (typeof obj !== 'object') {
    obj = __assign({ [name]: value });
  }

  return obj;
}
