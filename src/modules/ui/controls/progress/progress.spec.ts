import createPlayerTestkit from '../../../../testkit';

import ProgressControl, { UPDATE_PROGRESS_INTERVAL_DELAY } from './progress';

import { VideoEvent, EngineState } from '../../../../constants';

describe('ProgressControl', () => {
  let testkit;
  let control: any;
  let engine: any;
  let eventEmitter: any;

  beforeEach(() => {
    testkit = createPlayerTestkit();

    testkit.registerModule('progressControl', ProgressControl);
    control = testkit.getModule('progressControl');
    eventEmitter = testkit.getModule('eventEmitter');
    engine = testkit.getModule('engine');
  });

  describe('constructor', () => {
    test('should create instance ', () => {
      expect(control).toBeDefined();
      expect(control.view).toBeDefined();
    });
  });

  describe('API', () => {
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

    describe('for time indicators', () => {
      const VIDEO_DURATION_TIME = 1000;
      let engineGetDurationTimeSpy: jest.SpyInstance;

      beforeEach(() => {
        engineGetDurationTimeSpy = jest
          .spyOn(control._engine, 'getDuration')
          .mockImplementation(() => VIDEO_DURATION_TIME);
      });

      afterEach(() => {
        engineGetDurationTimeSpy.mockRestore();
      });

      test('should have methods for adding/deleting indicators', () => {
        // 'addTimeIndicator'
        expect(control.addTimeIndicator).toBeDefined();
        // 'addTimeIndicators'
        expect(control.addTimeIndicators).toBeDefined();
        // 'clearTimeIndicators'
        expect(control.clearTimeIndicators).toBeDefined();
      });

      describe('before `METADATA_LOADED`', () => {
        beforeEach(() => {
          control.clearTimeIndicators();
        });

        test('should add one indicator', async () => {
          const timeIndicatorsNode = control.view._$timeIndicators;

          control.addTimeIndicator(100);

          // '`isMetadataLoaded` before add'
          expect(control._engine.isMetadataLoaded).toBe(false);
          // 'indicator added before `METADATA_LOADED`'
          expect(timeIndicatorsNode.childNodes.length).toBe(0);

          await eventEmitter.emitAsync(VideoEvent.STATE_CHANGED, {
            nextState: EngineState.METADATA_LOADED,
          });

          // 'indicator added after `METADATA_LOADED`'
          expect(timeIndicatorsNode.childNodes.length).toBe(1);
        });

        test('should add multiple indicators', async () => {
          const timeIndicatorsNode = control.view._$timeIndicators;

          control.addTimeIndicators([100, 200, 300]);

          // '`isMetadataLoaded` before add'
          expect(control._engine.isMetadataLoaded).toBe(false);
          // 'indicator added before `METADATA_LOADED`'
          expect(timeIndicatorsNode.childNodes.length).toBe(0);

          await eventEmitter.emitAsync(VideoEvent.STATE_CHANGED, {
            nextState: EngineState.METADATA_LOADED,
          });

          // 'indicators added after `METADATA_LOADED`'
          expect(timeIndicatorsNode.childNodes.length).toBe(3);
        });
      });

      describe('after `METADATA_LOADED`', () => {
        beforeEach(() => {
          control.clearTimeIndicators();
          Reflect.defineProperty(control._engine, 'isMetadataLoaded', {
            ...Reflect.getOwnPropertyDescriptor(
              engine.constructor.prototype,
              'isMetadataLoaded',
            ),
            get: () => true,
          });
        });

        afterEach(() => {
          Reflect.deleteProperty(engine, 'isMetadataLoaded');
        });

        test('should add one indicator', () => {
          const timeIndicatorsNode = control.view._$timeIndicators;

          // 'empty before add'
          expect(timeIndicatorsNode.childNodes.length).toBe(0);

          control.addTimeIndicator(100);

          // 'indicators added'
          expect(timeIndicatorsNode.childNodes.length).toBe(1);
        });

        test('should add multiple indicator', () => {
          const timeIndicatorsNode = control.view._$timeIndicators;

          // 'empty before add'
          expect(timeIndicatorsNode.childNodes.length).toBe(0);

          control.addTimeIndicators([100, 200, 300]);

          // 'indicators added'
          expect(timeIndicatorsNode.childNodes.length).toBe(3);
        });

        test('should ignore time more then video duration time', () => {
          const timeIndicatorsNode = control.view._$timeIndicators;

          // 'empty before add'
          expect(timeIndicatorsNode.childNodes.length).toBe(0);

          control.addTimeIndicator(VIDEO_DURATION_TIME + 1);

          // 'indicators added'
          expect(timeIndicatorsNode.childNodes.length).toBe(0);
        });

        test('should delete all added indicators', () => {
          const timeIndicatorsNode = control.view._$timeIndicators;

          control.addTimeIndicators([100, 200, 300]);

          // 'indicators added'
          expect(timeIndicatorsNode.childNodes.length).toBe(3);

          control.clearTimeIndicators();

          // 'indicators after clear'
          expect(timeIndicatorsNode.childNodes.length).toBe(0);
        });
      });
    });
  });

  describe('video events listeners', () => {
    test('should call callback on playback state change', async () => {
      const spy = jest.spyOn(control, '_processStateChange');
      control._bindEvents();
      await eventEmitter.emitAsync(VideoEvent.STATE_CHANGED, {});
      expect(spy).toHaveBeenCalled();
    });

    test('should call callback on seek', async () => {
      const spyPlayed = jest.spyOn(control, '_updatePlayedIndicator');
      const spyBuffered = jest.spyOn(control, '_updateBufferIndicator');
      control._bindEvents();
      await eventEmitter.emitAsync(VideoEvent.STATE_CHANGED, {
        nextState: EngineState.SEEK_IN_PROGRESS,
      });
      expect(spyPlayed).toHaveBeenCalled();
      expect(spyBuffered).toHaveBeenCalled();
    });

    test('should call callback on duration update', async () => {
      const spy = jest.spyOn(control, '_updateBufferIndicator');
      control._bindEvents();
      await eventEmitter.emitAsync(VideoEvent.CHUNK_LOADED);
      expect(spy).toHaveBeenCalled();
    });
  });

  describe('internal methods', () => {
    test('should toggle playback on manipulation change', () => {
      const startSpy = jest.spyOn(control, '_pauseVideoOnDragStart');
      const stopSpy = jest.spyOn(control, '_playVideoOnDragEnd');
      control._startProcessingUserDrag();
      expect(startSpy).toHaveBeenCalled();
      control._stopProcessingUserDrag();
      expect(stopSpy).toHaveBeenCalled();

      startSpy.mockRestore();
      stopSpy.mockRestore();
    });

    test('should toggle interval updates', () => {
      const startSpy = jest.spyOn(control, '_startIntervalUpdates');
      control._processStateChange({ nextState: EngineState.PLAYING });
      expect(startSpy).toHaveBeenCalled();

      const stopSpy = jest.spyOn(control, '_stopIntervalUpdates');
      control._processStateChange({ nextState: EngineState.PAUSED });
      expect(stopSpy).toHaveBeenCalled();
    });

    test('should start interval updates', () => {
      const spy = jest.spyOn(window, 'setInterval');
      const stopSpy = jest.spyOn(control, '_stopIntervalUpdates');
      control._startIntervalUpdates();
      expect(spy).toHaveBeenCalledWith(
        control._updateAllIndicators,
        UPDATE_PROGRESS_INTERVAL_DELAY,
      );
      expect(stopSpy).not.toHaveBeenCalled();
      control._startIntervalUpdates();
      expect(stopSpy).toHaveBeenCalled();

      spy.mockRestore();
    });

    test('should change current time of video', () => {
      const spy = jest.spyOn(engine, 'seekTo');
      control._onChangePlayedPercent(10);
      expect(spy).toHaveBeenCalled();
    });

    test('should update view', () => {
      const playedSpy = jest.spyOn(control, '_setPlayed');
      const bufferSpy = jest.spyOn(control, '_setBuffered');
      control._updatePlayedIndicator();
      expect(playedSpy).toHaveBeenCalled();
      control._updateBufferIndicator();
      expect(bufferSpy).toHaveBeenCalled();
    });

    test('should trigger update of both played and buffered', () => {
      const playedSpy = jest.spyOn(control, '_updatePlayedIndicator');
      const bufferSpy = jest.spyOn(control, '_updateBufferIndicator');
      control._updateAllIndicators();
      expect(playedSpy).toHaveBeenCalled();
      expect(bufferSpy).toHaveBeenCalled();
    });
  });
});
