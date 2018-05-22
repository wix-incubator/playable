import 'jsdom-global/register';

import { expect } from 'chai';
import * as sinon from 'sinon';

import { EventEmitter } from 'eventemitter3';

import RootContainer from './root-container';

(global as any).requestAnimationFrame = () => {};

describe('RootContainer', () => {
  let ui: any = {};
  let eventEmitter: any = {};
  let config: any = {};

  beforeEach(() => {
    config = {
      ui: {},
    };
    eventEmitter = new EventEmitter();

    ui = new RootContainer({
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
        eventEmitter,
        config,
      });
    });

    it('should have method for setting width', () => {
      expect(ui.setWidth).to.exist;
    });

    it('should have method for setting height', () => {
      expect(ui.setHeight).to.exist;
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
      expect(ui.destroy).to.exist;
      ui.destroy();
    });
  });
});
