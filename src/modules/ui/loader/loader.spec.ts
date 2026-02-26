import createPlayerTestkit from '../../../testkit';

import { DELAYED_SHOW_TIMEOUT } from './loader';
import { VideoEvent, UIEvent, EngineState } from '../../../constants';

describe('Loader', () => {
  let loader: any;
  let testkit: any;
  let engine: any;
  let eventEmitter: any;
  let emitSpy: any;

  describe('constructor', () => {
    beforeEach(() => {
      testkit = createPlayerTestkit();
    });

    it('should create instance ', () => {
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

      emitSpy = vi.spyOn(eventEmitter, 'emitAsync');
    });

    afterEach(() => {
      eventEmitter.emitAsync.mockRestore();
    });

    describe('public API', () => {
      it('should have method for showing loader', () => {
        const showSpy = vi.spyOn(loader.view, 'showContent');
        loader._showContent();
        expect(emitSpy).toHaveBeenCalledWith(UIEvent.LOADER_SHOW);
        expect(showSpy).toHaveBeenCalled();
        expect(loader.isHidden).toBe(false);
      });

      it('should have method for hiding loader', () => {
        loader._showContent();
        const hideSpy = vi.spyOn(loader.view, 'hideContent');
        loader._hideContent();
        expect(emitSpy).toHaveBeenCalledWith(UIEvent.LOADER_HIDE);
        expect(hideSpy).toHaveBeenCalled();
        expect(loader.isHidden).toBe(true);
      });

      it('should have method for schedule delayed show', () => {
        const setTimeoutSpy = vi.spyOn(window, 'setTimeout');

        loader.startDelayedShow();
        expect(setTimeoutSpy).toHaveBeenCalledWith(
          loader._showContent,
          DELAYED_SHOW_TIMEOUT,
        );
        expect(loader.isDelayedShowScheduled).toBe(true);

        setTimeoutSpy.mockRestore();
      });

      it('should have method for unschedule delayed show', () => {
        loader.startDelayedShow();
        const clearTimeoutSpy = vi.spyOn(window, 'clearTimeout');

        loader.stopDelayedShow();
        expect(clearTimeoutSpy).toHaveBeenCalled();
        expect(loader.isDelayedShowScheduled).toBe(false);

        clearTimeoutSpy.mockRestore();
      });

      it('should stop previous scheduled show if you trigger schedule', () => {
        const stopSpy = vi.spyOn(loader, 'stopDelayedShow');
        loader.startDelayedShow();
        loader.startDelayedShow();
        expect(stopSpy).toHaveBeenCalledTimes(1);
      });
    });

    describe('reaction to event', () => {
      it('should be proper if event is VideoEvent.UPLOAD_SUSPEND', async function() {
        loader.show();
        await eventEmitter.emitAsync(VideoEvent.UPLOAD_SUSPEND);
        expect(loader.isHidden).toBe(true);
      });

      describe('signifying state change', () => {
        let delayedShowSpy: any;
        let stopDelayedShowSpy: any;

        beforeEach(() => {
          delayedShowSpy = vi.spyOn(loader, 'startDelayedShow');
          stopDelayedShowSpy = vi.spyOn(loader, 'stopDelayedShow');
        });

        afterEach(() => {
          loader.startDelayedShow.mockRestore();
          loader.stopDelayedShow.mockRestore();
        });

        it('should be proper if next state is EngineState.SEEK_IN_PROGRESS', async function() {
          await eventEmitter.emitAsync(VideoEvent.STATE_CHANGED, {
            nextState: EngineState.SEEK_IN_PROGRESS,
          });

          expect(delayedShowSpy).toHaveBeenCalled();
        });

        it('should be proper if next state is EngineState.WAITING', async function() {
          await eventEmitter.emitAsync(VideoEvent.STATE_CHANGED, {
            nextState: EngineState.WAITING,
          });

          expect(delayedShowSpy).toHaveBeenCalled();
        });

        it('should be proper if next state is EngineState.LOAD_STARTED', async function() {
          const showSpy = vi.spyOn(loader, '_showContent');
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

        it('should be proper if next state is EngineState.READY_TO_PLAY', async function() {
          const hideSpy = vi.spyOn(loader, '_hideContent');
          loader._showContent();
          await eventEmitter.emitAsync(VideoEvent.STATE_CHANGED, {
            nextState: EngineState.READY_TO_PLAY,
          });

          expect(hideSpy).toHaveBeenCalled();
          expect(stopDelayedShowSpy).toHaveBeenCalled();
        });

        it('should be proper if next state is EngineState.PLAYING', async function() {
          const hideSpy = vi.spyOn(loader, '_hideContent');
          await eventEmitter.emitAsync(VideoEvent.STATE_CHANGED, {
            nextState: EngineState.PLAYING,
          });

          expect(hideSpy).toHaveBeenCalled();
          expect(stopDelayedShowSpy).toHaveBeenCalled();
        });

        it('should be proper if next state is EngineState.PAUSED', async function() {
          const hideSpy = vi.spyOn(loader, '_hideContent');
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
