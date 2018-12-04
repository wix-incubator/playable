import 'jsdom-global/register';
import { expect } from 'chai';
import * as sinon from 'sinon';

import createPlayerTestkit from '../../../../testkit';

import { VIDEO_EVENTS, EngineState } from '../../../../constants';

describe('TimeControl', () => {
  let testkit;
  let control: any;
  let eventEmitter: any;

  beforeEach(() => {
    testkit = createPlayerTestkit();

    eventEmitter = testkit.getModule('eventEmitter');
    control = testkit.getModule('timeControl');
  });

  describe('constructor', () => {
    it('should create instance ', () => {
      expect(control).to.exist;
      expect(control.view).to.exist;
    });
  });

  describe('API', () => {
    it('should have method for setting current time', () => {
      const spy = sinon.spy(control.view, 'setCurrentTime');
      control._setCurrentTime();
      expect(spy.called).to.be.true;
    });

    it('should have method for setting duration time', () => {
      const spy = sinon.spy(control.view, 'setDurationTime');
      control._setDurationTime();
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
      expect(control._eventEmitter).to.not.exist;
      expect(spy.called).to.be.true;
    });
  });

  describe('video events listeners', () => {
    it('should call callback on playback state change', async function() {
      const spy = sinon.spy(control, '_toggleIntervalUpdates');
      control._bindEvents();
      await eventEmitter.emit(VIDEO_EVENTS.STATE_CHANGED, {});
      expect(spy.called).to.be.true;
    });

    it('should call callback on seek', async function() {
      const spy = sinon.spy(control, '_startIntervalUpdates');
      control._bindEvents();
      await eventEmitter.emit(VIDEO_EVENTS.STATE_CHANGED, {
        nextState: EngineState.SEEK_IN_PROGRESS,
      });
      expect(spy.called).to.be.true;
    });

    it('should call callback on duration update', async function() {
      const spy = sinon.spy(control, '_updateDurationTime');
      control._bindEvents();
      await eventEmitter.emit(VIDEO_EVENTS.DURATION_UPDATED);
      expect(spy.called).to.be.true;
    });
  });

  describe('internal methods', () => {
    it('should toggle interval updates', () => {
      const startSpy = sinon.spy(control, '_startIntervalUpdates');
      control._toggleIntervalUpdates({ nextState: EngineState.PLAYING });
      expect(startSpy.called).to.be.true;

      const stopSpy = sinon.spy(control, '_stopIntervalUpdates');
      control._toggleIntervalUpdates({ nextState: EngineState.PAUSED });
      expect(stopSpy.called).to.be.true;
    });

    it('should start interval updates', () => {
      const spy = sinon.spy(window, 'setInterval');
      const stopSpy = sinon.spy(control, '_stopIntervalUpdates');
      control._startIntervalUpdates();
      expect(spy.calledWith(control._updateCurrentTime)).to.be.true;
      expect(stopSpy.called).to.be.false;
      control._startIntervalUpdates();
      expect(stopSpy.called).to.be.true;

      spy.restore();
    });
  });
});
