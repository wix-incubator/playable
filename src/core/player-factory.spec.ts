import 'jsdom-global/register';

import { expect } from 'chai';
import * as sinon from 'sinon';

import {
  create,
  registerModule,
  clearAdditionalModules,
  IPlayerInstance,
} from './player-factory';
import { IPlayableModule } from './playable-module';

describe('registerModule', () => {
  it('should add additional module', () => {
    const spy = sinon.spy();

    class ClassA {
      constructor() {
        spy();
      }
    }

    registerModule('ClassA', ClassA);

    /*const player = */ create();
    expect(spy.called).to.be.true;
    clearAdditionalModules();
  });

  it('should add module API', () => {
    const spy = sinon.spy();
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
    expect(spy.called).to.be.true;
    expect(player[methodName]).to.equal(method);
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
      expect(player).to.exist;
      expect(player._defaultModules.engine).to.exist;
      expect(player.getElement()).to.exist;
      expect(player._defaultModules.eventEmitter).to.exist;
    });

    it('should create separate instances', () => {
      const player2: any = create();

      expect(player._defaultModules.engine).to.not.be.equal(
        player2._defaultModules.engine,
      );
      expect(player.getElement()).to.not.be.equal(player2.getElement());
      expect(player._defaultModules.eventEmitter).to.not.be.equal(
        player2._defaultModules.eventEmitter,
      );
    });
  });
});
