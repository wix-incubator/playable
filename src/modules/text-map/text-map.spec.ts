import TextMap from './text-map';

import createPlayerTestkit from '../../testkit';

describe('TextMap module', () => {
  let testkit: any;

  beforeEach(() => {
    testkit = createPlayerTestkit();
    testkit.registerModule('textMap', TextMap);
  });

  test('should have ability to get text from it', () => {
    testkit.setConfig({
      texts: {
        testID: 'testText',
      },
    });
    const map = testkit.getModule('textMap');
    expect(map.get).toBeDefined();
    expect(map.get('testID')).toBe('testText');
  });

  test('should pass arguments to translate function', () => {
    testkit.setConfig({
      texts: {
        testID: ({ arg }: { arg: any }) => `Test:${arg}`,
      },
    });

    const map = testkit.getModule('textMap');
    expect(map.get('testID', { arg: 1 })).toBe('Test:1');
  });

  test('should return undefined if destroyed', () => {
    testkit.setConfig({
      texts: {
        testID: 'testText',
      },
    });
    const map = testkit.getModule('textMap');
    map.destroy();
    expect(map.get('testID')).toBeUndefined();
  });
});
