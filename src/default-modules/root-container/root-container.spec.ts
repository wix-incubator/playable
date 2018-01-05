import 'jsdom-global/register';

import { expect } from 'chai';
import * as sinon from 'sinon';

import { EventEmitter } from 'eventemitter3';

import RootContainer from './root-container.controler';
import Engine from '../playback-engine/playback-engine';

(global as any).requestAnimationFrame = () => {};

describe('RootContainer', () => {
  let ui: any = {};
  let engine: any = {};
  let eventEmitter: any = {};
  let config: any = {};

  beforeEach(() => {
    config = {
      ui: {},
    };
    eventEmitter = new EventEmitter();
    engine = new Engine({
      eventEmitter,
      config,
    });

    ui = new RootContainer({
      engine,
      eventEmitter,
      config,
    });
  });

  describe('constructor', () => {
    it('should create instance ', () => {
      expect(ui).to.exist;
      expect(ui.view).to.exist;
    });
  });

  describe('API', () => {
    beforeEach(() => {
      ui = new RootContainer({
        engine,
        eventEmitter,
        config,
      });
    });

    it('should have method for setting width', () => {
      expect(ui.setWidth).to.exist;
      const cssSpy = sinon.spy(ui.view.$node, 'css');
      ui.setWidth(0);
      expect(cssSpy.called).to.be.false;

      ui.setWidth(10);
      expect(
        cssSpy.calledWith({
          width: '10px',
        }),
      ).to.be.true;
    });

    it('should have method for setting height', () => {
      expect(ui.setHeight).to.exist;
      const cssSpy = sinon.spy(ui.view.$node, 'css');
      ui.setHeight(0);
      expect(cssSpy.called).to.be.false;

      ui.setHeight(10);
      expect(
        cssSpy.calledWith({
          height: '10px',
        }),
      ).to.be.true;
    });

    it('should have method for getting width', () => {
      ui.setWidth(340);
      expect(ui.getWidth()).to.be.equal(340);
    });

    it('should have method for getting width', () => {
      ui.setHeight(350);
      expect(ui.getHeight()).to.be.equal(350);
    });

    it('should have method for attaching player to node', () => {
      const node: any = document.createElement('div');
      sinon.spy(node, 'appendChild');
      ui.attachToElement(node);
      expect(node.appendChild.calledWith(ui.node)).to.be.true;
    });

    it('should have method for setting setFillAllSpace', () => {
      sinon.spy(ui.view, 'setFillAllSpaceFlag');
      ui.setFillAllSpace(true);
      expect(ui.view.setFillAllSpaceFlag.calledWith(true)).to.be.true;
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

    it('should have method for destroy', () => {
      const node = document.createElement('div');
      expect(ui.destroy).to.exist;
      ui._disengageFocusWithin = () => {};
      ui.attachToElement(node);
      ui.destroy();
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
