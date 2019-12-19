import * as sinon from 'sinon';

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
      const spy = sinon.spy(control, '_unbindEvents');
      expect(control.destroy).toBeDefined();
      control.destroy();
      expect(spy.called).toBe(true);
    });

    describe('for time indicators', () => {
      const VIDEO_DURATION_TIME = 1000;
      let engineGetDurationTimeStub: sinon.SinonStub;

      beforeEach(() => {
        engineGetDurationTimeStub = (sinon.stub(
          control._engine,
          'getDuration',
        ) as sinon.SinonStub).callsFake(() => VIDEO_DURATION_TIME);
      });

      afterEach(() => {
        engineGetDurationTimeStub.restore();
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
      const spy = sinon.spy(control, '_processStateChange');
      control._bindEvents();
      await eventEmitter.emitAsync(VideoEvent.STATE_CHANGED, {});
      expect(spy.called).toBe(true);
    });

    test('should call callback on seek', async () => {
      const spyPlayed = sinon.spy(control, '_updatePlayedIndicator');
      const spyBuffered = sinon.spy(control, '_updateBufferIndicator');
      control._bindEvents();
      await eventEmitter.emitAsync(VideoEvent.STATE_CHANGED, {
        nextState: EngineState.SEEK_IN_PROGRESS,
      });
      expect(spyPlayed.called).toBe(true);
      expect(spyBuffered.called).toBe(true);
    });

    test('should call callback on duration update', async () => {
      const spy = sinon.spy(control, '_updateBufferIndicator');
      control._bindEvents();
      await eventEmitter.emitAsync(VideoEvent.CHUNK_LOADED);
      expect(spy.called).toBe(true);
    });
  });

  describe('internal methods', () => {
    test('should toggle playback on manipulation change', () => {
      const startSpy = sinon.spy(control, '_pauseVideoOnDragStart');
      const stopSpy = sinon.spy(control, '_playVideoOnDragEnd');
      control._startProcessingUserDrag();
      expect(startSpy.called).toBe(true);
      control._stopProcessingUserDrag();
      expect(stopSpy.called).toBe(true);

      startSpy.restore();
      stopSpy.restore();
    });

    test('should toggle interval updates', () => {
      const startSpy = sinon.spy(control, '_startIntervalUpdates');
      control._processStateChange({ nextState: EngineState.PLAYING });
      expect(startSpy.called).toBe(true);

      const stopSpy = sinon.spy(control, '_stopIntervalUpdates');
      control._processStateChange({ nextState: EngineState.PAUSED });
      expect(stopSpy.called).toBe(true);
    });

    test('should start interval updates', () => {
      const spy = sinon.spy(window, 'setInterval');
      const stopSpy = sinon.spy(control, '_stopIntervalUpdates');
      control._startIntervalUpdates();
      expect(
        spy.calledWith(
          control._updateAllIndicators,
          UPDATE_PROGRESS_INTERVAL_DELAY,
        ),
      ).toBe(true);
      expect(stopSpy.called).toBe(false);
      control._startIntervalUpdates();
      expect(stopSpy.called).toBe(true);

      spy.restore();
    });

    test('should change current time of video', () => {
      const spy = sinon.stub(engine, 'seekTo');
      control._onChangePlayedPercent(10);
      expect(spy.called).toBe(true);
    });

    test('should update view', () => {
      const playedSpy = sinon.spy(control, '_setPlayed');
      const bufferSpy = sinon.spy(control, '_setBuffered');
      control._updatePlayedIndicator();
      expect(playedSpy.called).toBe(true);
      control._updateBufferIndicator();
      expect(bufferSpy.called).toBe(true);
    });

    test('should trigger update of both played and buffered', () => {
      const playedSpy = sinon.spy(control, '_updatePlayedIndicator');
      const bufferSpy = sinon.spy(control, '_updateBufferIndicator');
      control._updateAllIndicators();
      expect(playedSpy.called).toBe(true);
      expect(bufferSpy.called).toBe(true);
    });
  });
});
