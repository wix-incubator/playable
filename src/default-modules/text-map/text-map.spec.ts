import { expect } from 'chai';

import DependencyContainer from '../../core/dependency-container';
import TextMap from './text-map';


describe('TextMap module', () => {
  let container;

  beforeEach(() => {
    container = DependencyContainer.createContainer();
    container.registerClass('textMap', TextMap);
  });

  it('should have ability to get text from it', () => {
    container.registerValue('config', {
      textMap: {
        'testID': 'testText'
      }
    });
    const map = container.resolve('textMap');
    expect(map.get).to.exist;
    expect(map.get('testID')).to.be.equal('testText');
  });

  it('should pass arguments to translate function', () => {
    container.registerValue('config', {
      textMap: {
        'testID': ({ arg }) => `Test:${arg}`
      }
    });

    const map = container.resolve('textMap');
    expect(map.get('testID', { arg: 1 })).to.be.equal('Test:1');
  });

  it('should return undefined if destroyed', () => {
    container.registerValue('config', {
      textMap: {
        'testID': 'testText'
      }
    });
    const map = container.resolve('textMap');
    map.destroy();
    expect(map.get('testID')).to.be.equal(undefined);
  });
});
