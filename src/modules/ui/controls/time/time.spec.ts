import * as sinon from 'sinon';

import createPlayerTestkit from '../../../../testkit';

import { VideoEvent, EngineState } from '../../../../constants';
import { UPDATE_TIME_INTERVAL_DELAY } from './time';

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
    test('should create instance ', () => {
      expect(control).toBeDefined();
      expect(control.view).toBeDefined();
    });
  });

  describe('API', () => {
    test('should have method for setting current time', () => {
      const spy = sinon.spy(control.view, 'setCurrentTime');
      control._setCurrentTime();
      expect(spy.called).toBe(true);
    });

    test('should have method for setting duration time', () => {
      const spy = sinon.spy(control.view, 'setDurationTime');
      control._setDurationTime();
      expect(spy.called).toBe(true);
    });

    test('should have method for showing whole view', () => {
      expect(control.show).toBeDefined();
      control.show();
      expect(control.isHidden).toBe(false);
    });

    test('should have method for hiding whole view', () => {
      expect(control.hide).toBeDefined();
      control.hide();
      expect(control.isHidden).toBe(true);
    });

    test('should have method for destroying', () => {
      const spy = sinon.spy(control, '_unbindEvents');
      expect(control.destroy).toBeDefined();
      control.destroy();
      expect(spy.called).toBe(true);
    });
  });

  describe('video events listeners', () => {
    test('should call callback on playback state change', async () => {
      const spy = sinon.spy(control, '_toggleIntervalUpdates');
      control._bindEvents();
      await eventEmitter.emitAsync(VideoEvent.STATE_CHANGED, {});
      expect(spy.called).toBe(true);
    });

    test('should call callback on seek', async () => {
      const spy = sinon.spy(control, '_startIntervalUpdates');
      control._bindEvents();
      await eventEmitter.emitAsync(VideoEvent.STATE_CHANGED, {
        nextState: EngineState.SEEK_IN_PROGRESS,
      });
      expect(spy.called).toBe(true);
    });

    test('should call callback on duration update', async () => {
      const spy = sinon.spy(control, '_updateDurationTime');
      control._bindEvents();
      await eventEmitter.emitAsync(VideoEvent.DURATION_UPDATED);
      expect(spy.called).toBe(true);
    });
  });

  describe('internal methods', () => {
    test('should toggle interval updates', () => {
      const startSpy = sinon.spy(control, '_startIntervalUpdates');
      control._toggleIntervalUpdates({ nextState: EngineState.PLAYING });
      expect(startSpy.called).toBe(true);

      const stopSpy = sinon.spy(control, '_stopIntervalUpdates');
      control._toggleIntervalUpdates({ nextState: EngineState.PAUSED });
      expect(stopSpy.called).toBe(true);
    });

    test('should start interval updates', () => {
      const spy = sinon.spy(window, 'setInterval');
      const stopSpy = sinon.spy(control, '_stopIntervalUpdates');
      control._startIntervalUpdates();
      expect(
        spy.calledWith(control._updateCurrentTime, UPDATE_TIME_INTERVAL_DELAY),
      ).toBe(true);
      expect(stopSpy.called).toBe(false);
      control._startIntervalUpdates();
      expect(stopSpy.called).toBe(true);

      spy.restore();
    });
  });
});
