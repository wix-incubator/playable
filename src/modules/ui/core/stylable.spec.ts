import Chance from 'chance';

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

  test('instance should have method for getting styles', () => {
    expect(stylable.styleNames).toEqual({});
  });

  test('should have method for extending styles', () => {
    const styleNames = {
      name: 'value',
    };
    Stylable.extendStyleNames(styleNames);
    expect(stylable.styleNames).toEqual(styleNames);
  });

  test('method for extending styles should merge styleNames for same style', () => {
    const styleNames1 = {
      name: chance.word(),
    };

    const styleNames2 = {
      name: chance.word(),
    };

    Stylable.extendStyleNames(styleNames2);
    Stylable.extendStyleNames(styleNames1);

    expect(stylable.styleNames.name.split(' ')).toEqual(
      expect.arrayContaining([styleNames1.name, styleNames2.name]),
    );
  });
});
