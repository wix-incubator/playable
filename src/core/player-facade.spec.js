import 'jsdom-global/register';
import { expect } from 'chai';
import sinon from 'sinon';

import mapParamsToConfig from './config-mapper';
import Player from './player-facade';
import DependencyContainer from './dependency-container';
import publicAPI from '../utils/public-api-decorator';


describe('Player\'s instance', () => {
  let container;
  let player;
  let defaultModules;

  beforeEach(() => {
    container = DependencyContainer.createContainer();
  });

  describe('rootNode and params', () => {
    it('should be registered and resolved', () => {
      const registerValueSpy = sinon.spy(container, 'registerValue');
      const resolveSpy = sinon.spy(container, 'resolve');
      const params = {};

      player = new Player({}, container, {});

      expect(
        registerValueSpy.calledWith({
          config: mapParamsToConfig(params)
        })
      ).to.be.true;
      expect(resolveSpy.args).to.deep.equal(
        [['config']]
      );
    });
  });

  describe('default modules', () => {
    it('should be resolved', () => {
      class ClassA {}
      const resolveSpy = sinon.spy(container, 'resolve');

      defaultModules = {
        ClassA
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
        ClassA
      };

      container.registerClass('ClassA', ClassA);

      player = new Player({}, container, defaultModules);
      player.destroy();

      expect(destroySpy.called).to.be.true;
    })
  });

  describe('additional modules', () => {
    it('should be resolved', () => {
      class ClassB {}
      const resolveSpy = sinon.spy(container, 'resolve');

      container.registerClass('ClassB', ClassB);

      player = new Player({}, container, {}, ['ClassB']);

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

      player = new Player({}, container, {}, ['ClassA']);
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

      ClassA = class A {
        @publicAPI()
        methodA() {
          methodASpy();
        }

        @publicAPI()
        get methodC() {

        }

        @publicAPI()
        set methodC(a) {

        }

        destroy() {}
      };

      ClassB = class B {
        @publicAPI()
        methodB() {
          methodBSpy();
        }

        destroy() {}
      };

      ClassC = class C {
        @publicAPI('methodA')
        methodA() {}

        destroy() {}
      };
    });

    it('should be constructed from default modules', () => {
      container.registerClass('ClassA', ClassA);
      defaultModules = {
        ClassA
      };
      player = new Player({}, container, defaultModules);

      expect(player.methodA).to.be.defined;
      expect(player.methodB).to.not.be.defined;
      expect(player.methodC).to.be.defined;

      container.registerClass('ClassB', ClassB);
      defaultModules = {
        ClassA,
        ClassB
      };

      player = new Player({}, container, defaultModules);

      expect(player.methodA).to.be.defined;
      expect(player.methodB).to.be.defined;
    });

    it('methods should call proper methods from modules', () => {
      defaultModules = {
        ClassA
      };
      container.registerClass('ClassA', ClassA);

      player = new Player({}, container, defaultModules);
      player.methodA();
      expect(methodASpy.called).to.be.true;
    });

    it('should throw error on duplicate method in API', () => {
      defaultModules = {
        ClassA,
        ClassC
      };
      container.registerClass('ClassA', ClassA);
      container.registerClass('ClassC', ClassC);

      const getDuplicateAPIMethodPlayer = () => {
        return new Player({}, container, defaultModules);
      };

      expect(getDuplicateAPIMethodPlayer).to.throw('API method methodA is already defined in Player facade');
    });

    it('should be cleared on destroy', () => {
      defaultModules = {
        ClassA
      };
      container.registerClass('ClassA', ClassA);

      player = new Player({}, container, defaultModules);
      const methodA = player.methodA;

      player.destroy();
      expect(player.methodA).to.be.not.defined;
      methodA();
      expect(methodASpy.called).to.be.false;
    });
  });
});
