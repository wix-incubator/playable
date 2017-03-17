import 'jsdom-global/register';
import EventEmitter from 'eventemitter3';

import { expect } from 'chai';
import sinon from 'sinon';

import PlayControl from './play.controler';
import Engine from '../../../playback-engine/playback-engine';

import VIDEO_EVENTS, { VIDI_PLAYBACK_STATUSES } from '../../../constants/events/video';


describe('PlayControl', () => {
  let control = {};
  let engine = {};
  let eventEmitter = {};

  beforeEach(() => {
    eventEmitter = new EventEmitter();
    engine = new Engine({
      eventEmitter
    });
    control = new PlayControl({
      engine,
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
          setPlaybackStatus: () => {}
        }
      });
      control = new PlayControl({
        engine,
        eventEmitter,
        view: spy
      });

      expect(spy.called).to.be.true;
    })
  });

  describe('API', () => {
    it('should have method for setting playback status', () => {
      const spy = sinon.spy(control.view, 'setPlaybackStatus');
      expect(control.setControlStatus).to.exist;
      control.setControlStatus();
      expect(spy.called).to.be.true;
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

  describe('video events listeners', () => {
    it('should call callback on playback status change', () => {
      const spy = sinon.spy(control, '_updatePlayingStatus');
      control._bindEvents();
      eventEmitter.emit(VIDEO_EVENTS.PLAYBACK_STATUS_CHANGED);
      expect(spy.called).to.be.true;
    });
  });

  describe('internal methods', () => {
    it('should change view based on playback status', () => {
      const spy = sinon.spy(control, 'setControlStatus');
      control._updatePlayingStatus(VIDI_PLAYBACK_STATUSES.PLAYING);
      expect(spy.calledWith(true)).to.be.true;
      control._updatePlayingStatus(VIDI_PLAYBACK_STATUSES.PAUSED);
      expect(spy.calledWith(false)).to.be.true;
    });

    it('should change playback status', () => {
      const playSpy = sinon.spy(control._engine, 'play');
      const pauseSpy = sinon.spy(control._engine, 'pause');
      control._playVideo();
      expect(playSpy.called).to.be.true;
      control._pauseVideo();
      expect(pauseSpy.called).to.be.true;
    });
  });

  describe('View', () => {
    it('should react on play/pause icon click' , () => {
      const playSpy = sinon.spy(control, '_playVideo');
      const pauseSpy = sinon.spy(control, '_pauseVideo');
      control._bindCallbacks();
      control._initUI();

      control.view.$playIcon.trigger('click');
      expect(playSpy.called).to.be.true;
      control.view.$pauseIcon.trigger('click');
      expect(pauseSpy.called).to.be.true;
    });

    it('should have method for setting current time', () => {
      expect(control.view.setPlaybackStatus).to.exist;
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
