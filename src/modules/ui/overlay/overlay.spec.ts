import createPlayerTestkit from '../../../testkit';

import { VideoEvent, UIEvent, EngineState } from '../../../constants';

describe('Overlay', () => {
  let testkit: any;
  let overlay: any = {};
  let eventEmitter: any = {};
  let eventEmitterSpy: any = null;

  let mainUIBlock: any;
  let disableShowingContentSpy: any;
  let enableShowingContentSpy: any;

  let loader: any;
  let loaderShowSpy: any;
  let loaderHideSpy: any;

  beforeEach(() => {
    testkit = createPlayerTestkit();
  });

  describe('constructor', () => {
    beforeEach(() => {
      overlay = testkit.getModule('overlay');
    });

    it('should create instance ', () => {
      expect(overlay).toBeDefined();
      expect(overlay.view).toBeDefined();
    });
  });

  describe(`check Loader's and MainUIBlock's API usage`, () => {
    beforeEach(() => {
      overlay = testkit.getModule('overlay');

      mainUIBlock = testkit.getModule('mainUIBlock');
      enableShowingContentSpy = vi.spyOn(mainUIBlock, 'enableShowingContent');

      loader = testkit.getModule('loader');
      loaderShowSpy = vi.spyOn(loader, 'show');

      eventEmitter = testkit.getModule('eventEmitter');
    });

    it(`if Overlay's "_hideContent" method invokes external API`, async () => {
      await eventEmitter.emitAsync(VideoEvent.STATE_CHANGED, {
        nextState: EngineState.PLAY_REQUESTED,
      });
      expect(loaderShowSpy).toHaveBeenCalled();
      expect(enableShowingContentSpy).toHaveBeenCalled();
    });
  });

  describe(`check Loader's and MainUIBlock's API usage v2`, () => {
    beforeEach(() => {
      overlay = testkit.getModule('overlay');

      mainUIBlock = testkit.getModule('mainUIBlock');
      disableShowingContentSpy = vi.spyOn(mainUIBlock, 'disableShowingContent');

      loader = testkit.getModule('loader');
      loaderHideSpy = vi.spyOn(loader, 'hide');

      eventEmitter = testkit.getModule('eventEmitter');
    });

    it(`if Overlay's "_showContent" method invokes external API`, async () => {
      await eventEmitter.emitAsync(VideoEvent.STATE_CHANGED, {
        nextState: EngineState.SRC_SET,
      });
      expect(loaderHideSpy).toHaveBeenCalled();
      expect(disableShowingContentSpy).toHaveBeenCalled();
    });
  });

  describe('instance callbacks to controls', () => {
    beforeEach(() => {
      overlay = testkit.getModule('overlay');
      eventEmitter = testkit.getModule('eventEmitter');

      eventEmitterSpy = vi.spyOn(eventEmitter, 'emitAsync');
    });

    afterEach(() => {
      eventEmitter.emitAsync.mockRestore();
    });

    it('should emit ui event on play', () => {
      const callback = vi.spyOn(overlay._engine, 'play');

      overlay._playVideo();

      expect(callback).toHaveBeenCalled();
      expect(eventEmitterSpy).toHaveBeenCalledWith(UIEvent.PLAY_OVERLAY_CLICK);

      overlay._engine.play.mockRestore();
    });
  });

  describe('instance', () => {
    beforeEach(() => {
      overlay = testkit.getModule('overlay');
      eventEmitter = testkit.getModule('eventEmitter');
    });

    it('should react on video playback state changed on play', async function() {
      const callback = vi.spyOn(overlay, '_updatePlayingState');
      const hideSpy = vi.spyOn(overlay, '_hideContent');

      overlay._bindEvents();

      await eventEmitter.emitAsync(VideoEvent.STATE_CHANGED, {
        nextState: EngineState.PLAY_REQUESTED,
      });

      expect(callback).toHaveBeenCalled();
      expect(hideSpy).toHaveBeenCalled();
    });

    it('should react on video playback state changed on end', async function() {
      const callback = vi.spyOn(overlay, '_updatePlayingState');
      const showSpy = vi.spyOn(overlay, '_showContent');
      overlay._bindEvents();

      await eventEmitter.emitAsync(VideoEvent.STATE_CHANGED, {
        nextState: EngineState.ENDED,
      });

      expect(callback).toHaveBeenCalled();
      expect(showSpy).toHaveBeenCalled();
    });
  });
});
