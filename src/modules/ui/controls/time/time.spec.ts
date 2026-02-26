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
    it('should create instance ', () => {
      expect(control).toBeDefined();
      expect(control.view).toBeDefined();
    });
  });

  describe('API', () => {
    it('should have method for setting current time', () => {
      const spy = vi.spyOn(control.view, 'setCurrentTime');
      control._setCurrentTime();
      expect(spy).toHaveBeenCalled();
    });

    it('should have method for setting duration time', () => {
      const spy = vi.spyOn(control.view, 'setDurationTime');
      control._setDurationTime();
      expect(spy).toHaveBeenCalled();
    });

    it('should have method for showing whole view', () => {
      expect(control.show).toBeDefined();
      control.show();
      expect(control.isHidden).toBe(false);
    });

    it('should have method for hiding whole view', () => {
      expect(control.hide).toBeDefined();
      control.hide();
      expect(control.isHidden).toBe(true);
    });

    it('should have method for destroying', () => {
      const spy = vi.spyOn(control, '_unbindEvents');
      expect(control.destroy).toBeDefined();
      control.destroy();
      expect(spy).toHaveBeenCalled();
    });
  });

  describe('video events listeners', () => {
    it('should call callback on playback state change', async function() {
      const spy = vi.spyOn(control, '_toggleIntervalUpdates');
      control._bindEvents();
      await eventEmitter.emitAsync(VideoEvent.STATE_CHANGED, {});
      expect(spy).toHaveBeenCalled();
    });

    it('should call callback on seek', async function() {
      const spy = vi.spyOn(control, '_startIntervalUpdates');
      control._bindEvents();
      await eventEmitter.emitAsync(VideoEvent.STATE_CHANGED, {
        nextState: EngineState.SEEK_IN_PROGRESS,
      });
      expect(spy).toHaveBeenCalled();
    });

    it('should call callback on duration update', async function() {
      const spy = vi.spyOn(control, '_updateDurationTime');
      control._bindEvents();
      await eventEmitter.emitAsync(VideoEvent.DURATION_UPDATED);
      expect(spy).toHaveBeenCalled();
    });
  });

  describe('internal methods', () => {
    it('should toggle interval updates', () => {
      const startSpy = vi.spyOn(control, '_startIntervalUpdates');
      control._toggleIntervalUpdates({ nextState: EngineState.PLAYING });
      expect(startSpy).toHaveBeenCalled();

      const stopSpy = vi.spyOn(control, '_stopIntervalUpdates');
      control._toggleIntervalUpdates({ nextState: EngineState.PAUSED });
      expect(stopSpy).toHaveBeenCalled();
    });

    it('should start interval updates', () => {
      const spy = vi.spyOn(window, 'setInterval');
      const stopSpy = vi.spyOn(control, '_stopIntervalUpdates');
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
