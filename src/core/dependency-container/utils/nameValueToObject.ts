import { __assign } from 'tslib';

export default function(name: Object | string, value: any): Object {
  if (typeof name !== 'object') {
    return __assign({ [name]: value });
  }

  return name;
}
