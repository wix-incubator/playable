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
      const spy = jest.spyOn(control.view, 'setCurrentTime');
      control._setCurrentTime();
      expect(spy).toHaveBeenCalled();
    });

    test('should have method for setting duration time', () => {
      const spy = jest.spyOn(control.view, 'setDurationTime');
      control._setDurationTime();
      expect(spy).toHaveBeenCalled();
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
      const spy = jest.spyOn(control, '_unbindEvents');
      expect(control.destroy).toBeDefined();
      control.destroy();
      expect(spy).toHaveBeenCalled();
    });
  });

  describe('video events listeners', () => {
    test('should call callback on playback state change', async () => {
      const spy = jest.spyOn(control, '_toggleIntervalUpdates');
      control._bindEvents();
      await eventEmitter.emitAsync(VideoEvent.STATE_CHANGED, {});
      expect(spy).toHaveBeenCalled();
    });

    test('should call callback on seek', async () => {
      const spy = jest.spyOn(control, '_startIntervalUpdates');
      control._bindEvents();
      await eventEmitter.emitAsync(VideoEvent.STATE_CHANGED, {
        nextState: EngineState.SEEK_IN_PROGRESS,
      });
      expect(spy).toHaveBeenCalled();
    });

    test('should call callback on duration update', async () => {
      const spy = jest.spyOn(control, '_updateDurationTime');
      control._bindEvents();
      await eventEmitter.emitAsync(VideoEvent.DURATION_UPDATED);
      expect(spy).toHaveBeenCalled();
    });
  });

  describe('internal methods', () => {
    test('should toggle interval updates', () => {
      const startSpy = jest.spyOn(control, '_startIntervalUpdates');
      control._toggleIntervalUpdates({ nextState: EngineState.PLAYING });
      expect(startSpy).toHaveBeenCalled();

      const stopSpy = jest.spyOn(control, '_stopIntervalUpdates');
      control._toggleIntervalUpdates({ nextState: EngineState.PAUSED });
      expect(stopSpy).toHaveBeenCalled();
    });

    test('should start interval updates', () => {
      const spy = jest.spyOn(window, 'setInterval');
      const stopSpy = jest.spyOn(control, '_stopIntervalUpdates');
      control._startIntervalUpdates();
      expect(spy).toHaveBeenCalledWith(
        control._updateCurrentTime,
        UPDATE_TIME_INTERVAL_DELAY,
      );
      expect(stopSpy).not.toHaveBeenCalled();
      control._startIntervalUpdates();
      expect(stopSpy).toHaveBeenCalled();

      spy.mockRestore();
    });
  });
});
