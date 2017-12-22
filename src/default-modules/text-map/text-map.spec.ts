import { expect } from 'chai';

import TextMap from './text-map';

import createPlayerTestkit from '../../testkit';

describe('TextMap module', () => {
  let testkit;

  beforeEach(() => {
    testkit = createPlayerTestkit();
    testkit.registerModule('textMap', TextMap);
  });

  it('should have ability to get text from it', () => {
    testkit.setConfig({
      textMap: {
        testID: 'testText',
      },
    });
    const map = testkit.getModule('textMap');
    expect(map.get).to.exist;
    expect(map.get('testID')).to.be.equal('testText');
  });

  it('should pass arguments to translate function', () => {
    testkit.setConfig({
      textMap: {
        testID: ({ arg }) => `Test:${arg}`,
      },
    });

    const map = testkit.getModule('textMap');
    expect(map.get('testID', { arg: 1 })).to.be.equal('Test:1');
  });

  it('should return undefined if destroyed', () => {
    testkit.setConfig({
      textMap: {
        testID: 'testText',
      },
    });
    const map = testkit.getModule('textMap');
    map.destroy();
    expect(map.get('testID')).to.be.equal(undefined);
  });
});
