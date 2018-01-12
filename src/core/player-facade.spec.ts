import 'jsdom-global/register';
import { expect } from 'chai';
import * as sinon from 'sinon';

import convertToDeviceRelatedConfig from './config';

import Player from './player-facade';
import DependencyContainer from './dependency-container';
import playerAPI from '../utils/player-api-decorator';

describe("Player's instance", () => {
  let container;
  let player;
  let defaultModules;
  let additionalModules;

  beforeEach(() => {
    container = DependencyContainer.createContainer();
  });

  describe('rootNode and params', () => {
    it('should be registered and resolved', () => {
      const registerValueSpy = sinon.spy(container, 'registerValue');
      const params = {};

      player = new Player({}, container, {});
      expect(
        registerValueSpy.calledWith({
          config: convertToDeviceRelatedConfig(params),
        }),
      ).to.be.true;
    });

    it('should be resolved', () => {
      const resolveSpy = sinon.spy(container, 'resolve');

      player = new Player({}, container, {});

      expect(resolveSpy.args).to.deep.equal([['config'], ['theme']]);
    });
  });

  describe('default modules', () => {
    it('should be resolved', () => {
      class ClassA {}
      const resolveSpy = sinon.spy(container, 'resolve');

      defaultModules = {
        ClassA,
      };

      container.registerClass('ClassA', ClassA);

      player = new Player({}, container, defaultModules);

      expect(resolveSpy.calledWith('ClassA')).to.be.true;
    });

    it('should call destroy on player destroy', () => {
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

      player = new Player({}, container, defaultModules);
      player.destroy();

      expect(destroySpy.called).to.be.true;
    });
  });

  describe('additional modules', () => {
    it('should be resolved', () => {
      class ClassB {}
      const resolveSpy = sinon.spy(container, 'resolve');

      container.registerClass('ClassB', ClassB);

      player = new Player({}, container, {}, { ClassB });

      expect(resolveSpy.calledWith('ClassB')).to.be.true;
    });

    it('should call destroy on player destroy', () => {
      const destroySpy = sinon.spy();
      class ClassA {
        destroy() {
          destroySpy();
        }
      }

      container.registerClass('ClassA', ClassA);

      player = new Player({}, container, {}, { ClassA });
      player.destroy();

      expect(destroySpy.called).to.be.true;
    });
  });

  describe('public API', () => {
    let ClassA;
    let ClassB;
    let ClassC;
    let methodASpy;
    let methodBSpy;

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

    it('should be constructed from default modules', () => {
      container.registerClass('ClassA', ClassA);
      defaultModules = {
        ClassA,
      };
      player = new Player({}, container, defaultModules);

      expect(Reflect.has(player, 'methodA')).to.be.true;
      expect(Reflect.has(player, 'methodB')).to.be.false;
      expect(Reflect.has(player, 'methodC')).to.be.true;

      container.registerClass('ClassB', ClassB);
      defaultModules = {
        ClassA,
        ClassB,
      };

      player = new Player({}, container, defaultModules);

      expect(Reflect.has(player, 'methodA')).to.be.true;
      expect(Reflect.has(player, 'methodB')).to.be.true;
    });

    it('should be constructed from additional modules', () => {
      container.registerClass('ClassA', ClassA);
      additionalModules = {
        ClassA,
      };
      player = new Player({}, container, {}, additionalModules);

      expect(Reflect.has(player, 'methodA')).to.be.true;
      expect(Reflect.has(player, 'methodC')).to.be.true;
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

      player = new Player({}, container, defaultModules, additionalModules);
      player.methodA();
      player.methodB();

      expect(methodASpy.called).to.be.true;
      expect(methodBSpy.called).to.be.true;
    });

    it('should throw error on duplicate method in API', () => {
      defaultModules = {
        ClassA,
        ClassC,
      };
      container.registerClass('ClassA', ClassA);
      container.registerClass('ClassC', ClassC);

      const getDuplicateAPIMethodPlayer = () => {
        return new Player({}, container, defaultModules);
      };

      expect(getDuplicateAPIMethodPlayer).to.throw(
        'API method methodA is already defined in Player facade',
      );
    });

    describe('when instance destroyed', () => {
      it('should clear instance', () => {
        defaultModules = {
          ClassA,
        };
        container.registerClass('ClassA', ClassA);

        player = new Player({}, container, defaultModules);

        player.destroy();
        expect(Reflect.has(player, 'methodA')).to.be.false;
      });

      it('should not broadcast call methods of module', () => {
        defaultModules = {
          ClassA,
        };
        container.registerClass('ClassA', ClassA);

        player = new Player({}, container, defaultModules);
        const methodA = player.methodA;

        player.destroy();
        expect(methodA).to.throw('Player instance is destroyed');
      });
    });
  });
});
