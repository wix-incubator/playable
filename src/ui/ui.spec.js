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
    $video = new $('<video>', {
      controls: 'true',
      poster: 'kek'
    });
    vidi = new Vidi($video[0]);
    eventEmitter = new EventEmitter();
  });

  describe('constructor', () => {
    beforeEach(() => {
      ui = new PlayerUI({
        vidi,
        eventEmitter
      });
    });

    it('should create instance ', () => {
      expect(ui).to.exists;
      expect(ui.view).to.exists;
    });
  });

  describe('instance created with default config', () => {
    beforeEach(() => {
      ui = new PlayerUI({
        vidi,
        eventEmitter
      });
    });
    it('should have controls', () => {
      expect(ui.controls).to.exist;
    });
    it('should remove controls attribute from video tag if have controls', () => {
      expect(ui.$video.attr('controls')).to.not.exist;
    });
    it('should have overlay', () =>{
      expect(ui.overlay).to.exist;
    });
    it('should set overlay as visible', () => {
      expect(ui.overlay.isHidden).to.be.false;
    });
    it('should remove poster attribute from video tag if have overlay', () => {
      expect(ui.$video.attr('poster')).to.not.exist;
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
        ...uiConfig
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
        ...uiConfig
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

    it('should have method for setting width', () => {
      expect(ui.setWidth).to.exist;
      const setWidthSpy = sinon.spy(ui.view.$node, 'css');
      ui.setWidth(10);
      expect(setWidthSpy.calledWith({
        width: '10px'
      })).to.be.true;
    });

    it('should have method for setting height', () => {
      expect(ui.setHeight).to.exist;
      const setHeightSpy = sinon.spy(ui.view.$node, 'css');
      ui.setHeight(10);
      expect(setHeightSpy.calledWith({
        height: '10px'
      })).to.be.true;
    });
  });
});
