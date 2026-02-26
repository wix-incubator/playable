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

    emitSpy = vi.spyOn(eventEmitter, 'emitAsync');
  });

  afterEach(() => {
    eventEmitter.emitAsync.mockRestore();
  });

  describe('constructor', () => {
    it('should create instance ', () => {
      expect(loadingCover).toBeDefined();
      expect(loadingCover.view).toBeDefined();
    });
  });

  describe('instance', () => {
    describe('public API', () => {
      it('should have method for getting view node', () => {
        const getElementSpy = vi.spyOn(loadingCover.view, 'getElement');
        loadingCover.getElement();
        expect(getElementSpy).toHaveBeenCalled();
      });

      it('should have method for setting cover', () => {
        const url = 'url';
        const setCoverSpy: ReturnType<typeof vi.fn> = vi.spyOn(
          loadingCover.view,
          'setCover',
        );
        loadingCover.setLoadingCover(url);
        expect(setCoverSpy).toHaveBeenCalledWith(url);
      });

      it('should have method for showing loader', () => {
        const showSpy = vi.spyOn(loadingCover.view, 'show');
        loadingCover.show();
        expect(emitSpy).toHaveBeenCalledWith(UIEvent.LOADING_COVER_SHOW);
        expect(showSpy).toHaveBeenCalled();
        expect(loadingCover.isHidden).toBe(false);
      });

      it('should have method for hiding loader', () => {
        loadingCover.show();
        const hideSpy = vi.spyOn(loadingCover.view, 'hide');
        loadingCover.hide();
        expect(emitSpy).toHaveBeenCalledWith(UIEvent.LOADING_COVER_HIDE);
        expect(hideSpy).toHaveBeenCalled();
        expect(loadingCover.isHidden).toBe(true);
      });
    });

    describe('reaction to event', () => {
      it('should be proper if event is VideoEvent.UPLOAD_SUSPEND', async function() {
        loadingCover.show();
        await eventEmitter.emitAsync(VideoEvent.UPLOAD_SUSPEND);
        expect(loadingCover.isHidden).toBe(true);
      });

      describe('signifying state change', () => {
        let showSpy: any;
        let hideSpy: any;

        beforeEach(() => {
          showSpy = vi.spyOn(loadingCover, 'show');
          hideSpy = vi.spyOn(loadingCover, 'hide');
        });

        afterEach(() => {
          loadingCover.show.mockRestore();
          loadingCover.hide.mockRestore();
        });

        it('should be proper if next state is EngineState.LOAD_STARTED', async function() {
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

        it('should be proper if next state is EngineState.WAITING', async function() {
          engine._output._stateEngine._isMetadataLoaded = true;
          await eventEmitter.emitAsync(VideoEvent.STATE_CHANGED, {
            nextState: EngineState.WAITING,
          });

          expect(showSpy).not.toHaveBeenCalled();

          engine._output._stateEngine._isMetadataLoaded = false;
          engine.setPreload('auto');
          await eventEmitter.emitAsync(VideoEvent.STATE_CHANGED, {
            nextState: EngineState.WAITING,
          });

          expect(showSpy).toHaveBeenCalled();
        });

        it('should be proper if next state is EngineState.READY_TO_PLAY', async function() {
          await eventEmitter.emitAsync(VideoEvent.STATE_CHANGED, {
            nextState: EngineState.READY_TO_PLAY,
          });

          expect(hideSpy).toHaveBeenCalled();
        });
      });
    });
  });
});
