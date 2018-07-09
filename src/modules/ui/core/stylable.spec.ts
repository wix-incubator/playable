import Chance from 'chance';
import { expect } from 'chai';

import Stylable from './stylable';

const chance = new Chance();

describe('Stylable', () => {
  let stylable: any;

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
      name: chance.word(),
    };

    const styleNames2 = {
      name: chance.word(),
    };

    Stylable.extendStyleNames(styleNames2);
    Stylable.extendStyleNames(styleNames1);

    expect(stylable.styleNames.name.split(' ')).to.include.members([
      styleNames1.name,
      styleNames2.name,
    ]);
  });
});
