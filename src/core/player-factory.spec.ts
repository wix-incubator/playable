import * as sinon from 'sinon';

import {
  create,
  registerModule,
  clearAdditionalModules,
} from './player-factory';

describe('registerModule', () => {
  test('should add additional module', () => {
    const spy = sinon.spy();

    class ClassA {
      constructor() {
        spy();
      }
    }

    registerModule('ClassA', ClassA);

    /*const player = */ create();
    expect(spy.called).toBe(true);
    clearAdditionalModules();
  });
});

describe('Player', () => {
  let player: any;

  beforeEach(() => {
    player = create();
  });

  describe('constructor', () => {
    test('should create instance ', () => {
      expect(player).toBeDefined();
      expect(player._defaultModules.engine).toBeDefined();
      expect(player.getElement()).toBeDefined();
      expect(player._defaultModules.eventEmitter).toBeDefined();
    });

    test('should create separate instances', () => {
      const player2: any = create();

      expect(player._defaultModules.engine).not.toBe(
        player2._defaultModules.engine,
      );
      expect(player.getElement()).not.toBe(player2.getElement());
      expect(player._defaultModules.eventEmitter).not.toBe(
        player2._defaultModules.eventEmitter,
      );
    });
  });
});
