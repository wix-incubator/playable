import * as sinon from 'sinon';

import convertToDeviceRelatedConfig from './config';

import Player from './player-facade';
import DependencyContainer from './dependency-container';
import playerAPI from '../core/player-api-decorator';

describe("Player's instance", () => {
  let container: any;
  let player: any;
  let defaultModules: any;
  let additionalModules: any;

  beforeEach(() => {
    container = DependencyContainer.createContainer();
  });

  describe('rootNode and params', () => {
    test('should be registered and resolved', () => {
      const registerValueSpy: sinon.SinonSpy = sinon.spy(
        container,
        'registerValue',
      );
      const params = {};

      player = new Player({}, container, []);
      expect(
        registerValueSpy.calledWith({
          config: convertToDeviceRelatedConfig(params),
        }),
      ).toBe(true);
    });

    test('should be resolved', () => {
      const resolveSpy = sinon.spy(container, 'resolve');

      player = new Player({}, container, []);

      expect(resolveSpy.args).toEqual([['config']]);
    });
  });

  describe('default modules', () => {
    test('should be resolved', () => {
      class ClassA {}
      const resolveSpy: sinon.SinonSpy = sinon.spy(container, 'resolve');

      defaultModules = {
        ClassA,
      };

      container.registerClass('ClassA', ClassA);

      player = new Player({}, container, Object.keys(defaultModules));

      expect(resolveSpy.calledWith('ClassA')).toBe(true);
    });

    test('should call destroy on player destroy', () => {
      const destroySpy = sinon.spy();
      class ClassA {
        destroy() {
          destroySpy();
        }
      }

      defaultModules = {
        ClassA,
      };

      container.registerClass('ClassA', ClassA);

      player = new Player({}, container, Object.keys(defaultModules));
      player.destroy();

      expect(destroySpy.called).toBe(true);
    });
  });

  describe('additional modules', () => {
    test('should be resolved', () => {
      class ClassB {}
      const resolveSpy: sinon.SinonSpy = sinon.spy(container, 'resolve');

      container.registerClass('ClassB', ClassB);

      player = new Player({}, container, [], ['ClassB']);

      expect(resolveSpy.calledWith('ClassB')).toBe(true);
    });

    test('should call destroy on player destroy', () => {
      const destroySpy = sinon.spy();
      class ClassA {
        destroy() {
          destroySpy();
        }
      }

      container.registerClass('ClassA', ClassA);

      player = new Player({}, container, [], ['ClassA']);
      player.destroy();

      expect(destroySpy.called).toBe(true);
    });
  });

  describe('public API', () => {
    let ClassA: any;
    let ClassB: any;
    let ClassC: any;
    let methodASpy: any;
    let methodBSpy: any;

    beforeEach(() => {
      methodASpy = sinon.spy();
      methodBSpy = sinon.spy();

      class A {
        @playerAPI()
        methodA() {
          methodASpy();
        }

        @playerAPI()
        get methodC() {
          return;
        }

        set methodC(_) {}

        destroy() {}
      }

      class B {
        @playerAPI()
        methodB() {
          methodBSpy();
        }

        destroy() {}
      }

      class C {
        @playerAPI('methodA')
        methodA() {}

        destroy() {}
      }

      ClassA = A;
      ClassB = B;
      ClassC = C;
    });

    test('should be constructed from default modules', () => {
      container.registerClass('ClassA', ClassA);
      defaultModules = {
        ClassA,
      };
      player = new Player({}, container, Object.keys(defaultModules));

      expect(Reflect.has(player, 'methodA')).toBe(true);
      expect(Reflect.has(player, 'methodB')).toBe(false);
      expect(Reflect.has(player, 'methodC')).toBe(true);

      container.registerClass('ClassB', ClassB);
      defaultModules = {
        ClassA,
        ClassB,
      };

      player = new Player({}, container, Object.keys(defaultModules));

      expect(Reflect.has(player, 'methodA')).toBe(true);
      expect(Reflect.has(player, 'methodB')).toBe(true);
    });

    test('should be constructed from additional modules', () => {
      container.registerClass('ClassA', ClassA);
      defaultModules = {
        ClassA,
      };
      additionalModules = {
        ClassA,
      };
      player = new Player(
        {},
        container,
        Object.keys(defaultModules),
        Object.keys(additionalModules),
      );

      expect(Reflect.has(player, 'methodA')).toBe(true);
      expect(Reflect.has(player, 'methodC')).toBe(true);
    });

    test('methods should call proper methods from modules', () => {
      defaultModules = {
        ClassA,
      };
      additionalModules = {
        ClassB,
      };
      container.registerClass('ClassA', ClassA);
      container.registerClass('ClassB', ClassB);

      player = new Player(
        {},
        container,
        Object.keys(defaultModules),
        Object.keys(additionalModules),
      );
      player.methodA();
      player.methodB();

      expect(methodASpy.called).toBe(true);
      expect(methodBSpy.called).toBe(true);
    });

    test('should throw error on duplicate method in API', () => {
      defaultModules = {
        ClassA,
        ClassC,
      };
      container.registerClass('ClassA', ClassA);
      container.registerClass('ClassC', ClassC);

      const getDuplicateAPIMethodPlayer = () => {
        return new Player({}, container, Object.keys(defaultModules));
      };

      expect(getDuplicateAPIMethodPlayer).toThrowError(
        'API method methodA is already defined in Player facade',
      );
    });

    describe('when instance destroyed', () => {
      test('should clear instance', () => {
        defaultModules = {
          ClassA,
        };
        container.registerClass('ClassA', ClassA);

        player = new Player({}, container, Object.keys(defaultModules));

        player.destroy();
        expect(Reflect.has(player, 'methodA')).toBe(false);
      });

      test('should not broadcast call methods of module', () => {
        defaultModules = {
          ClassA,
        };
        container.registerClass('ClassA', ClassA);

        player = new Player({}, container, Object.keys(defaultModules));
        const methodA = player.methodA;

        player.destroy();
        expect(methodA).toThrowError('Player instance is destroyed');
      });
    });
  });
});
