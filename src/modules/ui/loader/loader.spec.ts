import * as sinon from 'sinon';

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

      emitSpy = sinon.spy(eventEmitter, 'emitAsync');
    });

    afterEach(() => {
      eventEmitter.emitAsync.restore();
    });

    describe('public API', () => {
      test('should have method for showing loader', () => {
        const showSpy = sinon.spy(loader.view, 'showContent');
        loader._showContent();
        expect(emitSpy.calledWith(UIEvent.LOADER_SHOW)).toBe(true);
        expect(showSpy.called).toBe(true);
        expect(loader.isHidden).toBe(false);
      });

      test('should have method for hiding loader', () => {
        loader._showContent();
        const hideSpy = sinon.spy(loader.view, 'hideContent');
        loader._hideContent();
        expect(emitSpy.calledWith(UIEvent.LOADER_HIDE)).toBe(true);
        expect(hideSpy.called).toBe(true);
        expect(loader.isHidden).toBe(true);
      });

      test('should have method for schedule delayed show', () => {
        const setTimeoutSpy = sinon.spy(window, 'setTimeout');

        loader.startDelayedShow();
        expect(
          setTimeoutSpy.calledWith(loader._showContent, DELAYED_SHOW_TIMEOUT),
        ).toBe(true);
        expect(loader.isDelayedShowScheduled).toBe(true);

        setTimeoutSpy.restore();
      });

      test('should have method for unschedule delayed show', () => {
        loader.startDelayedShow();
        const clearTimeoutSpy = sinon.spy(window, 'clearTimeout');

        loader.stopDelayedShow();
        expect(clearTimeoutSpy.called).toBe(true);
        expect(loader.isDelayedShowScheduled).toBe(false);

        clearTimeoutSpy.restore();
      });

      test('should stop previous scheduled show if you trigger schedule', () => {
        const stopSpy = sinon.spy(loader, 'stopDelayedShow');
        loader.startDelayedShow();
        loader.startDelayedShow();
        expect(stopSpy.calledOnce).toBe(true);
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
          delayedShowSpy = sinon.spy(loader, 'startDelayedShow');
          stopDelayedShowSpy = sinon.spy(loader, 'stopDelayedShow');
        });

        afterEach(() => {
          loader.startDelayedShow.restore();
          loader.stopDelayedShow.restore();
        });

        test('should be proper if next state is EngineState.SEEK_IN_PROGRESS', async () => {
          await eventEmitter.emitAsync(VideoEvent.STATE_CHANGED, {
            nextState: EngineState.SEEK_IN_PROGRESS,
          });

          expect(delayedShowSpy.called).toBe(true);
        });

        test('should be proper if next state is EngineState.WAITING', async () => {
          await eventEmitter.emitAsync(VideoEvent.STATE_CHANGED, {
            nextState: EngineState.WAITING,
          });

          expect(delayedShowSpy.called).toBe(true);
        });

        test('should be proper if next state is EngineState.LOAD_STARTED', async () => {
          const showSpy = sinon.spy(loader, '_showContent');
          engine.setPreload('none');
          await eventEmitter.emitAsync(VideoEvent.STATE_CHANGED, {
            nextState: EngineState.LOAD_STARTED,
          });

          expect(showSpy.called).toBe(false);

          engine.setPreload('auto');
          await eventEmitter.emitAsync(VideoEvent.STATE_CHANGED, {
            nextState: EngineState.LOAD_STARTED,
          });

          expect(showSpy.called).toBe(true);
        });

        test('should be proper if next state is EngineState.READY_TO_PLAY', async () => {
          const hideSpy = sinon.spy(loader, '_hideContent');
          loader._showContent();
          await eventEmitter.emitAsync(VideoEvent.STATE_CHANGED, {
            nextState: EngineState.READY_TO_PLAY,
          });

          expect(hideSpy.called).toBe(true);
          expect(stopDelayedShowSpy.called).toBe(true);
        });

        test('should be proper if next state is EngineState.PLAYING', async () => {
          const hideSpy = sinon.spy(loader, '_hideContent');
          await eventEmitter.emitAsync(VideoEvent.STATE_CHANGED, {
            nextState: EngineState.PLAYING,
          });

          expect(hideSpy.called).toBe(true);
          expect(stopDelayedShowSpy.called).toBe(true);
        });

        test('should be proper if next state is EngineState.PAUSED', async () => {
          const hideSpy = sinon.spy(loader, '_hideContent');
          await eventEmitter.emitAsync(VideoEvent.STATE_CHANGED, {
            nextState: EngineState.PAUSED,
          });

          expect(hideSpy.called).toBe(true);
          expect(stopDelayedShowSpy.called).toBe(true);
        });
      });
    });
  });
});
