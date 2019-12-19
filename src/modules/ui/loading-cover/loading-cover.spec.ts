import * as sinon from 'sinon';

import createPlayerTestkit from '../../../testkit';
import LoadingCover from './loading-cover';

import { VideoEvent, UIEvent, EngineState } from '../../../constants';

describe('LoadingCover', () => {
  let testkit;
  let loadingCover: any;
  let engine: any;
  let eventEmitter: any;
  let emitSpy: any;

  beforeEach(() => {
    testkit = createPlayerTestkit();

    engine = testkit.getModule('engine');
    eventEmitter = testkit.getModule('eventEmitter');
    testkit.registerModule('loadingCover', LoadingCover);
    loadingCover = testkit.getModule('loadingCover');

    emitSpy = sinon.spy(eventEmitter, 'emitAsync');
  });

  afterEach(() => {
    eventEmitter.emitAsync.restore();
  });

  describe('constructor', () => {
    test('should create instance ', () => {
      expect(loadingCover).toBeDefined();
      expect(loadingCover.view).toBeDefined();
    });
  });

  describe('instance', () => {
    describe('public API', () => {
      test('should have method for getting view node', () => {
        const getElementSpy = sinon.spy(loadingCover.view, 'getElement');
        loadingCover.getElement();
        expect(getElementSpy.called).toBe(true);
      });

      test('should have method for setting cover', () => {
        const url = 'url';
        const setCoverSpy: sinon.SinonSpy = sinon.spy(
          loadingCover.view,
          'setCover',
        );
        loadingCover.setLoadingCover(url);
        expect(setCoverSpy.calledWith(url)).toBe(true);
      });

      test('should have method for showing loader', () => {
        const showSpy = sinon.spy(loadingCover.view, 'show');
        loadingCover.show();
        expect(emitSpy.calledWith(UIEvent.LOADING_COVER_SHOW)).toBe(true);
        expect(showSpy.called).toBe(true);
        expect(loadingCover.isHidden).toBe(false);
      });

      test('should have method for hiding loader', () => {
        loadingCover.show();
        const hideSpy = sinon.spy(loadingCover.view, 'hide');
        loadingCover.hide();
        expect(emitSpy.calledWith(UIEvent.LOADING_COVER_HIDE)).toBe(true);
        expect(hideSpy.called).toBe(true);
        expect(loadingCover.isHidden).toBe(true);
      });
    });

    describe('reaction to event', () => {
      test('should be proper if event is VideoEvent.UPLOAD_SUSPEND', async () => {
        loadingCover.show();
        await eventEmitter.emitAsync(VideoEvent.UPLOAD_SUSPEND);
        expect(loadingCover.isHidden).toBe(true);
      });

      describe('signifying state change', () => {
        let showSpy: any;
        let hideSpy: any;

        beforeEach(() => {
          showSpy = sinon.spy(loadingCover, 'show');
          hideSpy = sinon.spy(loadingCover, 'hide');
        });

        afterEach(() => {
          loadingCover.show.restore();
          loadingCover.hide.restore();
        });

        test('should be proper if next state is EngineState.LOAD_STARTED', async () => {
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

        test('should be proper if next state is EngineState.WAITING', async () => {
          engine._output._stateEngine._isMetadataLoaded = true;
          await eventEmitter.emitAsync(VideoEvent.STATE_CHANGED, {
            nextState: EngineState.WAITING,
          });

          expect(showSpy.called).toBe(false);

          engine._output._stateEngine._isMetadataLoaded = false;
          engine.setPreload('auto');
          await eventEmitter.emitAsync(VideoEvent.STATE_CHANGED, {
            nextState: EngineState.WAITING,
          });

          expect(showSpy.called).toBe(true);
        });

        test('should be proper if next state is EngineState.READY_TO_PLAY', async () => {
          await eventEmitter.emitAsync(VideoEvent.STATE_CHANGED, {
            nextState: EngineState.READY_TO_PLAY,
          });

          expect(hideSpy.called).toBe(true);
        });
      });
    });
  });
});
