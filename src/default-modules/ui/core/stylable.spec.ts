import { expect } from 'chai';
import classnames from 'classnames';

import Stylable from './stylable';

describe('Stylable', () => {
  let stylable;

  beforeEach(() => {
    stylable = new Stylable();
  });

  afterEach(() => {
    Stylable.resetStyles();
  });

  it('instance should have method for getting styles', () => {
    expect(stylable.styleNames).to.be.deep.equal({});
  });

  it('should have method for extending styles', () => {
    const styleNames = {
      name: 'value',
    };
    Stylable.extendStyleNames(styleNames);
    expect(stylable.styleNames).to.be.deep.equal(styleNames);
  });

  it('method for extending styles should merge styleNames for same style', () => {
    const styleNames1 = {
      name: 'value1',
    };

    const styleNames2 = {
      name: 'value2',
    };

    Stylable.extendStyleNames(styleNames1);
    Stylable.extendStyleNames(styleNames2);
    expect(stylable.styleNames).to.be.deep.equal({
      name: classnames(styleNames1.name, styleNames2.name),
    });
  });
});
