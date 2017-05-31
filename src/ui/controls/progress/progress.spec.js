import 'jsdom-global/register';
import EventEmitter from 'eventemitter3';

import { expect } from 'chai';
import sinon from 'sinon';

import ProgressControl from './progress.controler';
import Engine from '../../../playback-engine/playback-engine';

import VIDEO_EVENTS from '../../../constants/events/video';


describe('ProgressControl', () => {
  let control = {};
  let engine = {};
  let eventEmitter = {};

  beforeEach(() => {
    eventEmitter = new EventEmitter();
    engine = new Engine({
      eventEmitter
    });
    control = new ProgressControl({
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
          updatePlayed: () => {},
          updateBuffered: () => {}
        }
      });
      control = new ProgressControl({
        engine,
        eventEmitter,
        view: spy
      });

      expect(spy.called).to.be.true;
    });
  });

  describe('API', () => {
    it('should have method for setting value for played', () => {
      const played = '10';
      const spy = sinon.spy(control.view, 'updatePlayed');
      expect(control.updatePlayed).to.exist;
      control.updatePlayed(played);
      expect(spy.calledWith(played)).to.be.true;
    });

    it('should have method for setting value for buffered', () => {
      const buffered = '30';
      const spy = sinon.spy(control.view, 'updateBuffered');
      expect(control.updateBuffered).to.exist;
      control.updateBuffered(buffered);
      expect(spy.calledWith(buffered)).to.be.true;
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

  describe('video events listeners', () => {
    it('should call callback on playback status change', () => {
      const spy = sinon.spy(control, '_toggleIntervalUpdates');
      control._bindEvents();
      eventEmitter.emit(VIDEO_EVENTS.PLAYBACK_STATUS_CHANGED);
      expect(spy.called).to.be.true;
    });

    it('should call callback on seek', () => {
      const spy = sinon.spy(control, '_updatePlayedIndicator');
      control._bindEvents();
      eventEmitter.emit(VIDEO_EVENTS.SEEK_STARTED);
      expect(spy.called).to.be.true;
    });

    it('should call callback on duration update', () => {
      const spy = sinon.spy(control, '_updateBufferIndicator');
      control._bindEvents();
      eventEmitter.emit(VIDEO_EVENTS.CHUNK_LOADED);
      expect(spy.called).to.be.true;
    });

    it('should call callback on duration update', () => {
      const spy = sinon.spy(control, '_updateBufferIndicator');
      control._bindEvents();
      eventEmitter.emit(VIDEO_EVENTS.SEEK_ENDED);
      expect(spy.called).to.be.true;
    });
  });

  describe('internal methods', () => {
    it('should toggle playback on manipulation change', () => {
      const startSpy = sinon.spy(control, '_pauseVideoOnProgressManipulationStart');
      const stopSpy = sinon.spy(control, '_playVideoOnProgressManipulationEnd');
      control._toggleUserInteractingStatus();
      expect(startSpy.called).to.be.true;
      control._toggleUserInteractingStatus();
      expect(stopSpy.called).to.be.true;
    });

    it('should toggle interval updates', () => {
      const startSpy = sinon.spy(control, '_startIntervalUpdates');
      control._toggleIntervalUpdates(engine.STATUSES.PLAYING);
      expect(startSpy.called).to.be.true;

      const stopSpy = sinon.spy(control, '_stopIntervalUpdates');
      control._toggleIntervalUpdates(engine.STATUSES.PAUSED);
      expect(stopSpy.called).to.be.true;
    });

    it('should start interval updates', () => {
      const spy = sinon.spy(global, 'setInterval');
      const stopSpy = sinon.spy(control, '_stopIntervalUpdates');
      control._startIntervalUpdates();
      expect(spy.calledWith(control._updateControlOnInterval)).to.be.true;
      expect(stopSpy.called).to.be.false;
      control._startIntervalUpdates();
      expect(stopSpy.called).to.be.true;

      spy.restore();
    });

    it('should change current time of video', () => {
      control._engine.getDurationTime = () => 10;
      const spy = sinon.spy(control._engine, 'setCurrentTime');
      control._changePlayedProgress(10);
      expect(spy.called).to.be.true;
    });

    it('should update view', () => {
      const playedSpy = sinon.spy(control.view, 'updatePlayed');
      const bufferSpy = sinon.spy(control.view, 'updateBuffered');
      control._updatePlayedIndicator();
      expect(playedSpy.called).to.be.true;
      control._updateBufferIndicator();
      expect(bufferSpy.called).to.be.true;
    });

    it('should trigger update of both played and buffered', () => {
      const playedSpy = sinon.spy(control, '_updatePlayedIndicator');
      const bufferSpy = sinon.spy(control, '_updateBufferIndicator');
      control._updateControlOnInterval();
      expect(playedSpy.called).to.be.true;
      expect(bufferSpy.called).to.be.true;
    })
  });

  describe('View', () => {
    it('should react on volume range input change event when not muted', () => {
      const callback = sinon.spy(control.view, "_onInputValueChange");
      control.view._bindEvents();

      control.view.$input.trigger('change');
      expect(callback.called).to.be.true;
    });

    it('should react on volume range input input event', () => {
      const callback = sinon.spy(control.view, "_onInputValueChange");
      control.view._bindEvents();

      control.view.$input.trigger('input');
      expect(callback.called).to.be.true;
    });

    it('should react on volume range wheel input event', () => {
      const callback = sinon.spy(control.view, "_onMouseInteractionStart");
      control.view._bindEvents();

      control.view.$input.trigger('mousedown');
      expect(callback.called).to.be.true;
    });

    it('should react on mute button click', () => {
      const callback = sinon.spy(control.view, "_onMouseInteractionEnd");
      control.view._bindEvents();

      control.view.$input.trigger('mouseup');
      expect(callback.called).to.be.true;
    });

    it('should call callbacks', () => {
      const changeSpy = sinon.spy(control, '_changePlayedProgress');
      const interactionSpy = sinon.spy(control, '_toggleUserInteractingStatus');

      control._bindCallbacks();
      control._initUI();

      control.view._onInputValueChange();
      expect(changeSpy.called).to.be.true;
      control.view._onMouseInteractionStart({
        buttons: 2
      });
      expect(interactionSpy.called).to.be.false;
      control.view._onMouseInteractionStart({
        buttons: 1
      });
      expect(interactionSpy.called).to.be.true;
      interactionSpy.reset();
      control.view._onMouseInteractionEnd({
        buttons: 2
      });
      expect(interactionSpy.called).to.be.false;
      control.view._onMouseInteractionEnd({
        buttons: 1
      });
      expect(interactionSpy.called).to.be.true;
    });

    it('should have method for setting current time', () => {
      expect(control.view.updatePlayed).to.exist;
    });

    it('should have method for setting duration time', () => {
      expect(control.view.updateBuffered).to.exist;
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
