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
    it('should be registered and resolved', () => {
      const registerValueSpy = vi.spyOn(container, 'registerValue');
      const params = {};

      player = new Player({}, container, []);
      expect(registerValueSpy).toHaveBeenCalledWith({
        config: convertToDeviceRelatedConfig(params),
      });
    });

    it('should be resolved', () => {
      const resolveSpy = vi.spyOn(container, 'resolve');

      player = new Player({}, container, []);

      expect(resolveSpy.mock.calls).toEqual([['config']]);
    });
  });

  describe('default modules', () => {
    it('should be resolved', () => {
      class ClassA {}
      const resolveSpy = vi.spyOn(container, 'resolve');

      defaultModules = {
        ClassA,
      };

      container.registerClass('ClassA', ClassA);

      player = new Player({}, container, Object.keys(defaultModules));

      expect(resolveSpy).toHaveBeenCalledWith('ClassA');
    });

    it('should call destroy on player destroy', () => {
      const destroySpy = vi.fn();
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

      expect(destroySpy).toHaveBeenCalled();
    });
  });

  describe('additional modules', () => {
    it('should be resolved', () => {
      class ClassB {}
      const resolveSpy = vi.spyOn(container, 'resolve');

      container.registerClass('ClassB', ClassB);

      player = new Player({}, container, [], ['ClassB']);

      expect(resolveSpy).toHaveBeenCalledWith('ClassB');
    });

    it('should call destroy on player destroy', () => {
      const destroySpy = vi.fn();
      class ClassA {
        destroy() {
          destroySpy();
        }
      }

      container.registerClass('ClassA', ClassA);

      player = new Player({}, container, [], ['ClassA']);
      player.destroy();

      expect(destroySpy).toHaveBeenCalled();
    });
  });

  describe('public API', () => {
    let ClassA: any;
    let ClassB: any;
    let ClassC: any;
    let methodASpy: any;
    let methodBSpy: any;

    beforeEach(() => {
      methodASpy = vi.fn();
      methodBSpy = vi.fn();

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

    it('should be constructed from default modules', () => {
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

    it('should be constructed from additional modules', () => {
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

    it('methods should call proper methods from modules', () => {
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

      expect(methodASpy).toHaveBeenCalled();
      expect(methodBSpy).toHaveBeenCalled();
    });

    it('should throw error on duplicate method in API', () => {
      defaultModules = {
        ClassA,
        ClassC,
      };
      container.registerClass('ClassA', ClassA);
      container.registerClass('ClassC', ClassC);

      const getDuplicateAPIMethodPlayer = () => {
        return new Player({}, container, Object.keys(defaultModules));
      };

      expect(getDuplicateAPIMethodPlayer).toThrow(
        'API method methodA is already defined in Player facade',
      );
    });

    describe('when instance destroyed', () => {
      it('should clear instance', () => {
        defaultModules = {
          ClassA,
        };
        container.registerClass('ClassA', ClassA);

        player = new Player({}, container, Object.keys(defaultModules));

        player.destroy();
        expect(Reflect.has(player, 'methodA')).toBe(false);
      });

      it('should not broadcast call methods of module', () => {
        defaultModules = {
          ClassA,
        };
        container.registerClass('ClassA', ClassA);

        player = new Player({}, container, Object.keys(defaultModules));
        const methodA = player.methodA;

        player.destroy();
        expect(methodA).toThrow('Player instance is destroyed');
      });
    });
  });
});
