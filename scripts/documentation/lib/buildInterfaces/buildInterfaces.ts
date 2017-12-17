import * as t from '@babel/types';
import * as _ from 'lodash';

import glob from '../utils/glob';
import parseFile from '../utils/parseFile';
import getInterfaces from './getInterfaces';

function buildInterfaces(pattern) {
  const files = glob(pattern);
  const interfaces = _.flatMap(files, filePath =>
    getInterfaces(parseFile(filePath)),
  );

  return {
    type: 'Program',
    body: interfaces,
  };
}

export default buildInterfaces;
