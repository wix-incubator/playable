import 'jsdom-global/register';
import { expect } from 'chai';
import * as sinon from 'sinon';

import getContainer from '../../../../testkit';

import ProgressControl from './progress.controler';

import { VIDEO_EVENTS, STATES } from '../../../../constants/index';

describe('ProgressControl', () => {
  let container;
  let control;
  let engine;
  let eventEmitter;

  beforeEach(() => {
    container = getContainer();

    container.register('volumeControl', ProgressControl);
    control = container.get('volumeControl');
    eventEmitter = container.get('eventEmitter');
    engine = container.get('engine');
  });

  describe('constructor', () => {
    it('should create instance ', () => {
      expect(control).to.exist;
      expect(control.view).to.exist;
    });
  });

  describe('API', () => {
    it('should have method for setting value for played', () => {
      const played = '10';
      const spy = sinon.spy(control.view, 'setPlayed');
      expect(control.updatePlayed).to.exist;
      control.updatePlayed(played);
      expect(spy.calledWith(played)).to.be.true;
    });

    it('should have method for setting value for buffered', () => {
      const buffered = '30';
      const spy = sinon.spy(control.view, 'setBuffered');
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
      expect(control._eventEmitter).to.not.exist;
      expect(spy.called).to.be.true;
    });
  });

  describe('video events listeners', () => {
    it('should call callback on playback status change', () => {
      const spy = sinon.spy(control, '_processStateChange');
      control._bindEvents();
      eventEmitter.emit(VIDEO_EVENTS.STATE_CHANGED, {});
      expect(spy.called).to.be.true;
    });

    it('should call callback on seek', () => {
      const spyPlayed = sinon.spy(control, '_updatePlayedIndicator');
      const spyBuffered = sinon.spy(control, '_updateBufferIndicator');
      control._bindEvents();
      eventEmitter.emit(VIDEO_EVENTS.STATE_CHANGED, {
        nextState: STATES.SEEK_IN_PROGRESS,
      });
      expect(spyPlayed.called).to.be.true;
      expect(spyBuffered.called).to.be.true;
    });

    it('should call callback on duration update', () => {
      const spy = sinon.spy(control, '_updateBufferIndicator');
      control._bindEvents();
      eventEmitter.emit(VIDEO_EVENTS.CHUNK_LOADED);
      expect(spy.called).to.be.true;
    });
  });

  describe('internal methods', () => {
    it('should toggle playback on manipulation change', () => {
      const startSpy = sinon.spy(
        control,
        '_pauseVideoOnProgressManipulationStart',
      );
      const stopSpy = sinon.spy(control, '_playVideoOnProgressManipulationEnd');
      //const timeoutSpy = sinon.spy(global, 'setTimeout');
      control._onUserInteractionStarts();
      expect(startSpy.called).to.be.true;
      control._onUserInteractionEnds();
      //expect(timeoutSpy.calledWith(stopSpy)).to.be.true;

      control._playVideoOnProgressManipulationEnd.restore();
      control._pauseVideoOnProgressManipulationStart.restore();
      //global.setTimeout.restore();
    });

    it('should toggle interval updates', () => {
      const startSpy = sinon.spy(control, '_startIntervalUpdates');
      control._processStateChange({ nextState: STATES.PLAYING });
      expect(startSpy.called).to.be.true;

      const stopSpy = sinon.spy(control, '_stopIntervalUpdates');
      control._processStateChange({ nextState: STATES.PAUSED });
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
      const spy = sinon.spy(engine, 'setCurrentTime');
      control._changePlayedProgress(10);
      expect(spy.called).to.be.true;
    });

    it('should update view', () => {
      const playedSpy = sinon.spy(control, 'updatePlayed');
      const bufferSpy = sinon.spy(control, 'updateBuffered');
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
    });
  });
});
