import { expect } from 'chai';
import sinon from 'sinon';

import convertParamsToConfig from './config';
import Player from './player-facade';
import DependencyContainer from './dependency-container';
import publicAPI from '../utils/public-api-decorator';

describe('Player\'s instance', () => {
  let container;
  let player;
  let defaultModules;
  let additionalModules;
  const rootNode = document.createElement('div');

  beforeEach(() => {
    container = DependencyContainer.createContainer();
  });

  describe('rootNode and params', () => {
    it('should be registered and resolved', () => {
      const registerValueSpy = sinon.spy(container, 'registerValue');
      const resolveSpy = sinon.spy(container, 'resolve');
      const params = {};

      player = new Player(rootNode, {}, container, {});

      expect(
        registerValueSpy.calledWith({
          config: convertParamsToConfig(params),
          rootNode
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

      player = new Player(rootNode, {}, container, defaultModules);

      expect(resolveSpy.calledWith('ClassA')).to.be.true;
    })
  });

  describe('additional modules', () => {
    it('should be resolved', () => {
      class ClassB {}
      const resolveSpy = sinon.spy(container, 'resolve');

      additionalModules = {
        ClassB
      };

      container.registerClass('ClassB', ClassB);

      player = new Player(rootNode, {}, container, {}, additionalModules);

      expect(resolveSpy.calledWith('ClassB')).to.be.true;
    })
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
      player = new Player(rootNode, {}, container, defaultModules);

      expect(player.methodA).to.be.defined;
      expect(player.methodB).to.not.be.defined;

      container.registerClass('ClassB', ClassB);
      defaultModules = {
        ClassA,
        ClassB
      };

      player = new Player(rootNode, {}, container, defaultModules);

      expect(player.methodA).to.be.defined;
      expect(player.methodB).to.be.defined;
    });

    it('methods should call proper methods from modules', () => {
      defaultModules = {
        ClassA
      };
      container.registerClass('ClassA', ClassA);

      player = new Player(rootNode, {}, container, defaultModules);
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
        return new Player(rootNode, {}, container, defaultModules);
      };

      expect(getDuplicateAPIMethodPlayer).to.throw('API method methodA is already defined in Player facade');
    });

    it('should be cleared on destroy', () => {
      defaultModules = {
        ClassA
      };
      container.registerClass('ClassA', ClassA);

      player = new Player(rootNode, {}, container, defaultModules);
      const methodA = player.methodA;

      player.destroy();
      expect(player.methodA).to.be.not.defined;
      methodA();
      expect(methodASpy.called).to.be.false;
    });
  });
});
