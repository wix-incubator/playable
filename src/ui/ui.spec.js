import 'jsdom-global/register';

import { expect } from 'chai';
import sinon from 'sinon';

import $ from 'jbone';
import Vidi from 'vidi';
import EventEmitter from 'eventemitter3';

import PlayerUI from './ui.controler';


describe('PlayerUI', () => {
  let ui = {};
  let $video = {};
  let vidi = {};
  let eventEmitter = {};

  beforeEach(() => {
    $video = new $('<video>');
    vidi = new Vidi($video[0]);
    eventEmitter = new EventEmitter();
    ui = new PlayerUI({
      vidi,
      eventEmitter
    });
  });

  describe('constructor', () => {
    it('should create instance ', () => {
      expect(ui).to.exists;
      expect(ui.view).to.exists;
    });
  });

  describe('instance created with default config', () => {
    it('should have controls', () => {
      expect(ui.controls).to.exist;
    });
    it('should have overlay', () =>{
      expect(ui.overlay).to.exist;
    });
    it('should set overlay as visible', () => {
      expect(ui.overlay.isHidden).to.be.false;
    });
  });

  describe('instance created with extended config', () => {
    it('should create instance with hidden controls', () => {
      const uiConfig = {
        controls: false
      };

      ui = new PlayerUI({
        vidi,
        eventEmitter,
        config: uiConfig
      });

      expect(ui.controls.isHidden).to.be.true;
    });

    it('should create instance with hidden overlay', () => {
      const uiConfig = {
        overlay: false
      };

      ui = new PlayerUI({
        vidi,
        eventEmitter,
        config: uiConfig
      });

      expect(ui.overlay.isHidden).to.be.true;
    });
  });

  describe('API', () => {
    beforeEach(() => {
      ui = new PlayerUI({
        vidi,
        eventEmitter
      });
    });

    it('should have method for showing controls', () => {
      expect(ui.showControls).to.exist;
      const showSpy = sinon.spy(ui.controls, 'show');
      ui.showControls();
      expect(showSpy.called).to.be.true;
    });

    it('should have method for hiding controls', () => {
      expect(ui.hideControls).to.exist;
      const hideSpy = sinon.spy(ui.controls, 'hide');
      ui.hideControls();
      expect(hideSpy.called).to.be.true;
    });

    it('should have method for showing overlay', () => {
      expect(ui.showOverlay).to.exist;
      const showSpy = sinon.spy(ui.overlay, 'show');
      ui.showOverlay();
      expect(showSpy.called).to.be.true;
    });

    it('should have method for hiding overlay', () => {
      expect(ui.hideOverlay).to.exist;
      const hideSpy = sinon.spy(ui.overlay, 'hide');
      ui.hideOverlay();
      expect(hideSpy.called).to.be.true;
    });

    it('should have method for setting background for overlay', () => {
      const src = 'test';
      expect(ui.setOverlayBackgroundSrc).to.exist;
      const setBackgroundSpy = sinon.spy(ui.overlay, 'setBackgroundSrc');
      ui.setOverlayBackgroundSrc(src);
      expect(setBackgroundSpy.calledWith(src)).to.be.true;
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

    it('should have method for hide time', () => {
      const spy = sinon.spy(ui.controls.timeControl, 'hide');
      expect(ui.hideTime).to.exist;
      ui.hideTime();
      expect(spy.called).to.be.true;
    });

    it('should have method for show time', () => {
      const spy = sinon.spy(ui.controls.timeControl, 'show');
      expect(ui.showTime).to.exist;
      ui.showTime();
      expect(spy.called).to.be.true;
    });

    it('should have method for hide progress', () => {
      const spy = sinon.spy(ui.controls.progressControl, 'hide');
      expect(ui.hideProgress).to.exist;
      ui.hideProgress();
      expect(spy.called).to.be.true;
    });

    it('should have method for show progress', () => {
      const spy = sinon.spy(ui.controls.progressControl, 'show');
      expect(ui.showProgress).to.exist;
      ui.showProgress();
      expect(spy.called).to.be.true;
    });

    it('should have method for hide volume', () => {
      const spy = sinon.spy(ui.controls.volumeControl, 'hide');
      expect(ui.hideVolume).to.exist;
      ui.hideVolume();
      expect(spy.called).to.be.true;
    });

    it('should have method for show volume', () => {
      const spy = sinon.spy(ui.controls.volumeControl, 'show');
      expect(ui.showVolume).to.exist;
      ui.showVolume();
      expect(spy.called).to.be.true;
    });

    it('should have method for hide fullscreen', () => {
      const spy = sinon.spy(ui.controls.fullscreenControl, 'hide');
      expect(ui.hideFullscreen).to.exist;
      ui.hideFullscreen();
      expect(spy.called).to.be.true;
    });

    it('should have method for show progress', () => {
      const spy = sinon.spy(ui.controls.fullscreenControl, 'show');
      expect(ui.showFullscreen).to.exist;
      ui.showFullscreen();
      expect(spy.called).to.be.true;
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

    it('should have method for enter full scren', () => {
      const spy = sinon.spy(ui.view, '_setFullScreenStatus');
      expect(ui.view.enterFullScreen).to.exist;
      ui.view.$node = {
        0: {
        'undefined': () => {}
        },
        toggleClass: () => {}
      };
      ui.view.enterFullScreen();
      expect(spy.called).to.be.true;
    });

    it('should have method for exit full screen', () => {
      const spy = sinon.spy(ui.view, '_setFullScreenStatus');
      expect(ui.view.exitFullScreen).to.exist;
      ui.view.$node = {
        0: {
          'undefined': () => {}
        },
        toggleClass: () => {}
      };
      global.document['undefined'] = () => {};
      ui.view.exitFullScreen();
      expect(spy.called).to.be.true;

      delete global.document['undefined'];
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
