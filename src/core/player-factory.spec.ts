import {
  create,
  registerModule,
  clearAdditionalModules,
  IPlayerInstance,
} from './player-factory';
import { IPlayableModule } from './playable-module';

describe('registerModule', () => {
  it('should add additional module', () => {
    const spy = vi.fn();

    class ClassA {
      constructor() {
        spy();
      }
    }

    registerModule('ClassA', ClassA);

    /*const player = */ create();
    expect(spy).toHaveBeenCalled();
    clearAdditionalModules();
  });

  it('should add module API', () => {
    const spy = vi.fn();
    const methodName = 'customModuleMethod';
    const method = () => {};

    type API = {
      [methodName](): void;
    };

    class CustomModule implements IPlayableModule<API> {
      getAPI(): API {
        spy();

        return {
          [methodName]: method,
        };
      }
    }

    registerModule('customModule', CustomModule);
    const player = create() as IPlayerInstance & API;
    player[methodName]();
    expect(spy).toHaveBeenCalled();
    expect(player[methodName]).toBe(method);
    clearAdditionalModules();
  });
});

describe('Player', () => {
  let player: any;

  beforeEach(() => {
    player = create();
  });

  describe('constructor', () => {
    it('should create instance ', () => {
      expect(player).toBeDefined();
      expect(player._defaultModules.engine).toBeDefined();
      expect(player.getElement()).toBeDefined();
      expect(player._defaultModules.eventEmitter).toBeDefined();
    });

    it('should create separate instances', () => {
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
