import createPlayerTestkit from '../../../testkit';

import { DELAYED_SHOW_TIMEOUT } from './loader';
import { VideoEvent, UIEvent, EngineState } from '../../../constants';

describe('Loader', () => {
  let loader: any;
  let testkit: any;
  let engine: any;
  let eventEmitter: any;
  let emitSpy: jest.SpyInstance;

  describe('constructor', () => {
    beforeEach(() => {
      testkit = createPlayerTestkit();
    });

    test('should create instance ', () => {
      loader = testkit.getModule('loader');

      expect(loader).toBeDefined();
      expect(loader.view).toBeDefined();
    });
  });

  describe('instance', () => {
    beforeEach(() => {
      testkit = createPlayerTestkit();
      loader = testkit.getModule('loader');

      engine = testkit.getModule('engine');
      eventEmitter = testkit.getModule('eventEmitter');

      emitSpy = jest.spyOn(eventEmitter, 'emitAsync');
    });

    afterEach(() => {
      eventEmitter.emitAsync.mockRestore();
    });

    describe('public API', () => {
      test('should have method for showing loader', () => {
        const showSpy = jest.spyOn(loader.view, 'showContent');
        loader._showContent();
        expect(emitSpy).toHaveBeenCalledWith(UIEvent.LOADER_SHOW);
        expect(showSpy).toHaveBeenCalled();
        expect(loader.isHidden).toBe(false);
      });

      test('should have method for hiding loader', () => {
        loader._showContent();
        const hideSpy = jest.spyOn(loader.view, 'hideContent');
        loader._hideContent();
        expect(emitSpy).toHaveBeenCalledWith(UIEvent.LOADER_HIDE);
        expect(hideSpy).toHaveBeenCalled();
        expect(loader.isHidden).toBe(true);
      });

      test('should have method for schedule delayed show', () => {
        const setTimeoutSpy = jest.spyOn(window, 'setTimeout');

        loader.startDelayedShow();
        expect(setTimeoutSpy).toHaveBeenCalledWith(
          loader._showContent,
          DELAYED_SHOW_TIMEOUT,
        );
        expect(loader.isDelayedShowScheduled).toBe(true);

        setTimeoutSpy.mockRestore();
      });

      test('should have method for unschedule delayed show', () => {
        loader.startDelayedShow();
        const clearTimeoutSpy = jest.spyOn(window, 'clearTimeout');

        loader.stopDelayedShow();
        expect(clearTimeoutSpy).toHaveBeenCalled();
        expect(loader.isDelayedShowScheduled).toBe(false);

        clearTimeoutSpy.mockRestore();
      });

      test('should stop previous scheduled show if you trigger schedule', () => {
        const stopSpy = jest.spyOn(loader, 'stopDelayedShow');
        loader.startDelayedShow();
        loader.startDelayedShow();
        expect(stopSpy).toHaveBeenCalledTimes(1);
      });
    });

    describe('reaction to event', () => {
      test('should be proper if event is VideoEvent.UPLOAD_SUSPEND', async () => {
        loader.show();
        await eventEmitter.emitAsync(VideoEvent.UPLOAD_SUSPEND);
        expect(loader.isHidden).toBe(true);
      });

      describe('signifying state change', () => {
        let delayedShowSpy: any;
        let stopDelayedShowSpy: any;

        beforeEach(() => {
          delayedShowSpy = jest.spyOn(loader, 'startDelayedShow');
          stopDelayedShowSpy = jest.spyOn(loader, 'stopDelayedShow');
        });

        afterEach(() => {
          loader.startDelayedShow.mockRestore();
          loader.stopDelayedShow.mockRestore();
        });

        test('should be proper if next state is EngineState.SEEK_IN_PROGRESS', async () => {
          await eventEmitter.emitAsync(VideoEvent.STATE_CHANGED, {
            nextState: EngineState.SEEK_IN_PROGRESS,
          });

          expect(delayedShowSpy).toHaveBeenCalled();
        });

        test('should be proper if next state is EngineState.WAITING', async () => {
          await eventEmitter.emitAsync(VideoEvent.STATE_CHANGED, {
            nextState: EngineState.WAITING,
          });

          expect(delayedShowSpy).toHaveBeenCalled();
        });

        test('should be proper if next state is EngineState.LOAD_STARTED', async () => {
          const showSpy = jest.spyOn(loader, '_showContent');
          engine.setPreload('none');
          await eventEmitter.emitAsync(VideoEvent.STATE_CHANGED, {
            nextState: EngineState.LOAD_STARTED,
          });

          expect(showSpy).not.toHaveBeenCalled();

          engine.setPreload('auto');
          await eventEmitter.emitAsync(VideoEvent.STATE_CHANGED, {
            nextState: EngineState.LOAD_STARTED,
          });

          expect(showSpy).toHaveBeenCalled();
        });

        test('should be proper if next state is EngineState.READY_TO_PLAY', async () => {
          const hideSpy = jest.spyOn(loader, '_hideContent');
          loader._showContent();
          await eventEmitter.emitAsync(VideoEvent.STATE_CHANGED, {
            nextState: EngineState.READY_TO_PLAY,
          });

          expect(hideSpy).toHaveBeenCalled();
          expect(stopDelayedShowSpy).toHaveBeenCalled();
        });

        test('should be proper if next state is EngineState.PLAYING', async () => {
          const hideSpy = jest.spyOn(loader, '_hideContent');
          await eventEmitter.emitAsync(VideoEvent.STATE_CHANGED, {
            nextState: EngineState.PLAYING,
          });

          expect(hideSpy).toHaveBeenCalled();
          expect(stopDelayedShowSpy).toHaveBeenCalled();
        });

        test('should be proper if next state is EngineState.PAUSED', async () => {
          const hideSpy = jest.spyOn(loader, '_hideContent');
          await eventEmitter.emitAsync(VideoEvent.STATE_CHANGED, {
            nextState: EngineState.PAUSED,
          });

          expect(hideSpy).toHaveBeenCalled();
          expect(stopDelayedShowSpy).toHaveBeenCalled();
        });
      });
    });
  });
});
