import createPlayerTestkit from '../../../../testkit';

import ProgressControl, { UPDATE_PROGRESS_INTERVAL_DELAY } from './progress';

import { VideoEvent, EngineState } from '../../../../constants';
import { MockInstance } from 'vitest';

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
    it('should create instance ', () => {
      expect(control).toBeDefined();
      expect(control.view).toBeDefined();
    });
  });

  describe('API', () => {
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

    describe('for time indicators', () => {
      const VIDEO_DURATION_TIME = 1000;
      let engineGetDurationTimeStub: MockInstance;

      beforeEach(() => {
        engineGetDurationTimeStub = vi
          .spyOn(control._engine, 'getDuration')
          .mockImplementation(() => VIDEO_DURATION_TIME);
      });

      afterEach(() => {
        engineGetDurationTimeStub.mockRestore();
      });

      it('should have methods for adding/deleting indicators', () => {
        expect(control.addTimeIndicator, 'addTimeIndicator').toBeDefined();
        expect(control.addTimeIndicators, 'addTimeIndicators').toBeDefined();
        expect(
          control.clearTimeIndicators,
          'clearTimeIndicators',
        ).toBeDefined();
      });

      describe('before `METADATA_LOADED`', () => {
        beforeEach(() => {
          control.clearTimeIndicators();
        });

        it('should add one indicator', async function() {
          const timeIndicatorsNode = control.view._$timeIndicators;

          control.addTimeIndicator(100);

          expect(
            control._engine.isMetadataLoaded,
            '`isMetadataLoaded` before add',
          ).toBe(false);
          expect(
            timeIndicatorsNode.childNodes.length,
            'indicator added before `METADATA_LOADED`',
          ).toBe(0);

          await eventEmitter.emitAsync(VideoEvent.STATE_CHANGED, {
            nextState: EngineState.METADATA_LOADED,
          });

          expect(
            timeIndicatorsNode.childNodes.length,
            'indicator added after `METADATA_LOADED`',
          ).toBe(1);
        });

        it('should add multiple indicators', async function() {
          const timeIndicatorsNode = control.view._$timeIndicators;

          control.addTimeIndicators([100, 200, 300]);

          expect(
            control._engine.isMetadataLoaded,
            '`isMetadataLoaded` before add',
          ).toBe(false);
          expect(
            timeIndicatorsNode.childNodes.length,
            'indicator added before `METADATA_LOADED`',
          ).toBe(0);

          await eventEmitter.emitAsync(VideoEvent.STATE_CHANGED, {
            nextState: EngineState.METADATA_LOADED,
          });

          expect(
            timeIndicatorsNode.childNodes.length,
            'indicators added after `METADATA_LOADED`',
          ).toBe(3);
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

        it('should add one indicator', () => {
          const timeIndicatorsNode = control.view._$timeIndicators;

          expect(timeIndicatorsNode.childNodes.length, 'empty before add').toBe(
            0,
          );

          control.addTimeIndicator(100);

          expect(timeIndicatorsNode.childNodes.length, 'indicators added').toBe(
            1,
          );
        });

        it('should add multiple indicator', () => {
          const timeIndicatorsNode = control.view._$timeIndicators;

          expect(timeIndicatorsNode.childNodes.length, 'empty before add').toBe(
            0,
          );

          control.addTimeIndicators([100, 200, 300]);

          expect(timeIndicatorsNode.childNodes.length, 'indicators added').toBe(
            3,
          );
        });

        it('should ignore time more then video duration time', () => {
          const timeIndicatorsNode = control.view._$timeIndicators;

          expect(timeIndicatorsNode.childNodes.length, 'empty before add').toBe(
            0,
          );

          control.addTimeIndicator(VIDEO_DURATION_TIME + 1);

          expect(timeIndicatorsNode.childNodes.length, 'indicators added').toBe(
            0,
          );
        });

        it('should delete all added indicators', () => {
          const timeIndicatorsNode = control.view._$timeIndicators;

          control.addTimeIndicators([100, 200, 300]);

          expect(timeIndicatorsNode.childNodes.length, 'indicators added').toBe(
            3,
          );

          control.clearTimeIndicators();

          expect(
            timeIndicatorsNode.childNodes.length,
            'indicators after clear',
          ).toBe(0);
        });
      });
    });
  });

  describe('video events listeners', () => {
    it('should call callback on playback state change', async function() {
      const spy = vi.spyOn(control, '_processStateChange');
      control._bindEvents();
      await eventEmitter.emitAsync(VideoEvent.STATE_CHANGED, {});
      expect(spy).toHaveBeenCalled();
    });

    it('should call callback on seek', async function() {
      const spyPlayed = vi.spyOn(control, '_updatePlayedIndicator');
      const spyBuffered = vi.spyOn(control, '_updateBufferIndicator');
      control._bindEvents();
      await eventEmitter.emitAsync(VideoEvent.STATE_CHANGED, {
        nextState: EngineState.SEEK_IN_PROGRESS,
      });
      expect(spyPlayed).toHaveBeenCalled();
      expect(spyBuffered).toHaveBeenCalled();
    });

    it('should call callback on duration update', async function() {
      const spy = vi.spyOn(control, '_updateBufferIndicator');
      control._bindEvents();
      await eventEmitter.emitAsync(VideoEvent.CHUNK_LOADED);
      expect(spy).toHaveBeenCalled();
    });
  });

  describe('internal methods', () => {
    it('should toggle playback on manipulation change', () => {
      const startSpy = vi.spyOn(control, '_pauseVideoOnDragStart');
      const stopSpy = vi.spyOn(control, '_playVideoOnDragEnd');
      control._startProcessingUserDrag();
      expect(startSpy).toHaveBeenCalled();
      control._stopProcessingUserDrag();
      expect(stopSpy).toHaveBeenCalled();

      startSpy.mockRestore();
      stopSpy.mockRestore();
    });

    it('should toggle interval updates', () => {
      const startSpy = vi.spyOn(control, '_startIntervalUpdates');
      control._processStateChange({ nextState: EngineState.PLAYING });
      expect(startSpy).toHaveBeenCalled();

      const stopSpy = vi.spyOn(control, '_stopIntervalUpdates');
      control._processStateChange({ nextState: EngineState.PAUSED });
      expect(stopSpy).toHaveBeenCalled();
    });

    it('should start interval updates', () => {
      const spy = vi.spyOn(window, 'setInterval');
      const stopSpy = vi.spyOn(control, '_stopIntervalUpdates');
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

    it('should change current time of video', () => {
      const spy = vi.spyOn(engine, 'seekTo');
      control._onChangePlayedPercent(10);
      expect(spy).toHaveBeenCalled();
    });

    it('should update view', () => {
      const playedSpy = vi.spyOn(control, '_setPlayed');
      const bufferSpy = vi.spyOn(control, '_setBuffered');
      control._updatePlayedIndicator();
      expect(playedSpy).toHaveBeenCalled();
      control._updateBufferIndicator();
      expect(bufferSpy).toHaveBeenCalled();
    });

    it('should trigger update of both played and buffered', () => {
      const playedSpy = vi.spyOn(control, '_updatePlayedIndicator');
      const bufferSpy = vi.spyOn(control, '_updateBufferIndicator');
      control._updateAllIndicators();
      expect(playedSpy).toHaveBeenCalled();
      expect(bufferSpy).toHaveBeenCalled();
    });
  });
});
