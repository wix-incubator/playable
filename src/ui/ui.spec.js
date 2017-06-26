import 'jsdom-global/register';

import { expect } from 'chai';
import sinon from 'sinon';

import EventEmitter from 'eventemitter3';

import { container } from '../core/player-fabric';
import PlayerUI from './ui.controler';
import Engine from '../playback-engine/playback-engine';


describe('PlayerUI', () => {
  let ui = {};
  let engine = {};
  let eventEmitter = {};
  let config = {};
  let rootNode = {};
  let scope = {};

  beforeEach(() => {
    rootNode = document.createElement('div');
    config = {
      ui: {}
    };
    eventEmitter = new EventEmitter();
    engine = new Engine({
      eventEmitter,
      config
    });
    scope = container.createScope();
    scope.registerValue({
      config,
      rootNode
    });

    ui = new PlayerUI({
      engine,
      eventEmitter,
      config,
      rootNode
    }, scope);
  });

  describe('constructor', () => {
    it('should create instance ', () => {
      expect(ui).to.exists;
      expect(ui.view).to.exists;
    });
  });

  describe('instance created with default config', () => {
    it('should have controls', () => {
      expect(ui._controls).to.exist;
    });
  });

  describe('instance created with extended config', () => {
    it('should create instance with hidden controls', () => {
      const config = {
        ui: {
          controls: false
        }
      };

      ui = new PlayerUI({
        engine,
        eventEmitter,
        config,
        rootNode
      }, scope);

      expect(ui._controls).to.not.exist;
    });
    it('should create instance with overlay', () => {
      const config = {
        ui: {
          overlay: true
        }
      };

      ui = new PlayerUI({
        engine,
        eventEmitter,
        config,
        rootNode
      }, scope);

      expect(ui._overlay).to.exist;
    });
  });

  describe('API', () => {
    beforeEach(() => {
      ui = new PlayerUI({
        engine,
        eventEmitter,
        config,
        rootNode
      }, scope);
    });

    it('should have method for setting width', () => {
      expect(ui.setWidth).to.exist;
      const cssSpy = sinon.spy(ui.view.$node, 'css');
      ui.setWidth(0);
      expect(cssSpy.called).to.be.false;

      ui.setWidth(10);
      expect(cssSpy.calledWith({
        width: '10px'
      })).to.be.true;
    });

    it('should have method for setting height', () => {
      expect(ui.setHeight).to.exist;
      const cssSpy = sinon.spy(ui.view.$node, 'css');
      ui.setHeight(0);
      expect(cssSpy.called).to.be.false;

      ui.setHeight(10);
      expect(cssSpy.calledWith({
        height: '10px'
      })).to.be.true;
    });

    it('should have method for showing whole view', () => {
      expect(ui.show).to.exist;
      ui.show();
      expect(ui.isHidden).to.be.false;
    });

    it('should have method for hiding whole view', () => {
      expect(ui.hide).to.exist;
      ui.hide();
      expect(ui.isHidden).to.be.true;
    });
  });

  describe('View', () => {
    it('should have method for append component node', () => {
      expect(ui.view.appendComponentNode).to.exist;
    });

    it('should have method for showing itself', () => {
      expect(ui.view.show).to.exist;
    });

    it('should have method for hidding itself', () => {
      expect(ui.view.hide).to.exist;
    });

    it('should have method gettind root node', () => {
      expect(ui.view.getNode).to.exist;
    });

    it('should have method for destroying', () => {
      expect(ui.view.destroy).to.exist;
    });
  });
});
