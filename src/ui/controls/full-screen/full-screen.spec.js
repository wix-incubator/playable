import 'jsdom-global/register';
import EventEmitter from 'eventemitter3';

import { expect } from 'chai';
import sinon from 'sinon';

import FullScreenControl from './full-screen.controler';
import UI_EVENTS from '../../../constants/events/ui';


describe('FullScreenControl', () => {
  let control = {};
  let eventEmitter = {};

  beforeEach(() => {
    eventEmitter = new EventEmitter();
    control = new FullScreenControl({
      eventEmitter
    });
  });

  describe('constructor', () => {
    it('should create instance ', () => {
      expect(control).to.exists;
      expect(control.view).to.exists;
    });

    it('should create instance with custom view if provided', () => {
      const spy = sinon.spy(function () {
        return {
          setFullScreenStatus: () => {},
          hide: () => {}
        }
      });
      control = new FullScreenControl({
        eventEmitter,
        view: spy
      });

      expect(spy.called).to.be.true;
    })
  });

  describe('ui events listeners', () => {
    it('should call callback on playback status change', () => {
      const spy = sinon.spy(control, '_updateFullScreenControlStatus');
      control._bindEvents();
      eventEmitter.emit(UI_EVENTS.FULLSCREEN_STATUS_CHANGED);
      expect(spy.called).to.be.true;
    });
  });

  describe('API', () => {
    it('should have method for setting current time', () => {
      const spy = sinon.spy(control.view, 'setFullScreenStatus');
      expect(control.setControlStatus).to.exist;
      control.setControlStatus();
      expect(spy.called).to.be.true;
    });

    it('should have method for showing whole view', () => {
      expect(control.show).to.exist;
      control.show();
      expect(control.isHidden).to.be.false;
    });

    it('should have method for hiding whole view', () => {
      expect(control.hide).to.exist;
      control.hide();
      expect(control.isHidden).to.be.true;
    });

    it('should have method for destroying', () => {
      const spy = sinon.spy(control, '_unbindEvents');
      expect(control.destroy).to.exist;
      control.destroy();
      expect(control.view).to.not.exist;
      expect(control._vidi).to.not.exist;
      expect(control._eventEmitter).to.not.exist;
      expect(spy.called).to.be.true;
    });
  });

  describe('internal methods', () => {
    it('should change view fullscreen status', () => {
      const spy = sinon.spy(control, 'setControlStatus');
      control._updateFullScreenControlStatus();
      expect(spy.called).to.be.true;
    });

    it('should call callbacks from uiView', () => {
      const enterFullScreen = sinon.spy();
      const exitFullScreen = sinon.spy();

      control._uiView = {
        enterFullScreen,
        exitFullScreen
      };
      control._enterFullScreen();
      expect(enterFullScreen.called).to.be.true;
      control._exitFullScreen();
      expect(exitFullScreen.called).to.be.true;
    });
  });

  describe('View', () => {
    it('should react on play/pause icon click' , () => {
      const toggleSpy = sinon.spy(control, '_toggleFullScreen');
      control._bindCallbacks();
      control._initUI();

      control.view.$toggleFullScreenControl.trigger('click');
      expect(toggleSpy.called).to.be.true;
    });

    it('should have method for setting current time', () => {
      expect(control.view.setFullScreenStatus).to.exist;
    });

    it('should have method for showing itself', () => {
      expect(control.view.show).to.exist;
    });

    it('should have method for hidding itself', () => {
      expect(control.view.hide).to.exist;
    });

    it('should have method gettind root node', () => {
      expect(control.view.getNode).to.exist;
    });

    it('should have method for destroying', () => {
      expect(control.view.destroy).to.exist;
    });
  });
});
