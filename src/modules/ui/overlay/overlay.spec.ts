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

    test('should create instance ', () => {
      expect(overlay).toBeDefined();
      expect(overlay.view).toBeDefined();
    });
  });

  describe(`check Loader's and MainUIBlock's API usage`, () => {
    beforeEach(() => {
      overlay = testkit.getModule('overlay');

      mainUIBlock = testkit.getModule('mainUIBlock');
      enableShowingContentSpy = jest.spyOn(mainUIBlock, 'enableShowingContent');

      loader = testkit.getModule('loader');
      loaderShowSpy = jest.spyOn(loader, 'show');

      eventEmitter = testkit.getModule('eventEmitter');
    });

    test(`if Overlay's "_hideContent" method invokes external API`, async () => {
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
      disableShowingContentSpy = jest.spyOn(
        mainUIBlock,
        'disableShowingContent',
      );

      loader = testkit.getModule('loader');
      loaderHideSpy = jest.spyOn(loader, 'hide');

      eventEmitter = testkit.getModule('eventEmitter');
    });

    test(`if Overlay's "_showContent" method invokes external API`, async () => {
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

      eventEmitterSpy = jest.spyOn(eventEmitter, 'emitAsync');
    });

    afterEach(() => {
      eventEmitter.emitAsync.mockRestore();
    });

    test('should emit ui event on play', () => {
      const callback = jest.spyOn(overlay._engine, 'play');

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

    test('should react on video playback state changed on play', async () => {
      const callback = jest.spyOn(overlay, '_updatePlayingState');
      const hideSpy = jest.spyOn(overlay, '_hideContent');

      overlay._bindEvents();

      await eventEmitter.emitAsync(VideoEvent.STATE_CHANGED, {
        nextState: EngineState.PLAY_REQUESTED,
      });

      expect(callback).toHaveBeenCalled();
      expect(hideSpy).toHaveBeenCalled();
    });

    test('should react on video playback state changed on end', async () => {
      const callback = jest.spyOn(overlay, '_updatePlayingState');
      const showSpy = jest.spyOn(overlay, '_showContent');
      overlay._bindEvents();

      await eventEmitter.emitAsync(VideoEvent.STATE_CHANGED, {
        nextState: EngineState.ENDED,
      });

      expect(callback).toHaveBeenCalled();
      expect(showSpy).toHaveBeenCalled();
    });
  });
});
