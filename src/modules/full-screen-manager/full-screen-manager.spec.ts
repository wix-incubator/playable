import createPlayerTestkit from '../../testkit';

import DesktopFullScreen from './desktop';
import IOSFullScreen from './ios';

import { setProperty, resetProperty } from '../../testkit';

import { VideoEvent, UIEvent, EngineState } from '../../constants';

declare const navigator: any;

const mockedFullscreenHelper = {
  isInFullScreen: false,
  isEnabled: true,
  request: vi.fn(),
  exit: vi.fn(),
  destroy: vi.fn(),
  _reset() {
    this.isInFullScreen = false;
    this.isEnabled = true;

    this.request.mockClear();
    this.exit.mockClear();
    this.destroy.mockClear();
  },
};

describe('FullScreenManager', () => {
  let testkit: any;
  let fullScreenManager: any;
  let eventEmitter: any;
  let engine: any;

  beforeEach(() => {
    testkit = createPlayerTestkit();
    eventEmitter = testkit.getModule('eventEmitter');
    engine = testkit.getModule('engine');
    fullScreenManager = testkit.getModule('fullScreenManager');

    fullScreenManager._helper = mockedFullscreenHelper;
  });

  afterEach(() => {
    mockedFullscreenHelper._reset();
  });

  describe('chosen helper', () => {
    afterEach(() => {
      resetProperty(navigator, 'userAgent');
    });

    it('should be for desktop if not on iOS', () => {
      setProperty(navigator, 'userAgent', 'Computer');

      testkit = createPlayerTestkit();
      fullScreenManager = testkit.getModule('fullScreenManager');

      expect(fullScreenManager._helper instanceof DesktopFullScreen).toBe(true);
    });

    it('should be for iPhone', () => {
      setProperty(navigator, 'userAgent', 'iPhone');

      testkit = createPlayerTestkit();
      fullScreenManager = testkit.getModule('fullScreenManager');

      expect(fullScreenManager._helper instanceof IOSFullScreen).toBe(true);
    });

    it('should be for iPod', () => {
      setProperty(navigator, 'userAgent', 'iPod');

      testkit = createPlayerTestkit();
      fullScreenManager = testkit.getModule('fullScreenManager');

      expect(fullScreenManager._helper instanceof IOSFullScreen).toBe(true);
    });

    it('should be for iPad', () => {
      setProperty(navigator, 'userAgent', 'iPad');

      testkit = createPlayerTestkit();
      fullScreenManager = testkit.getModule('fullScreenManager');

      expect(fullScreenManager._helper instanceof IOSFullScreen).toBe(true);
    });
  });

  describe('enable state', () => {
    it('should be based on helper state and config', () => {
      expect(fullScreenManager.isEnabled).toBe(true);
      mockedFullscreenHelper.isEnabled = false;
      expect(fullScreenManager.isEnabled).toBe(false);
    });

    it('should return false in disabled flag passed in config', () => {
      mockedFullscreenHelper.isEnabled = true;
      fullScreenManager._isEnabled = false;
      expect(fullScreenManager.isEnabled).toBe(false);
    });
  });

  describe('full screen state', () => {
    it('should return state of helper', () => {
      mockedFullscreenHelper.isInFullScreen = true;
      expect(fullScreenManager.isInFullScreen).toBe(true);
    });

    it('should return false if disabled', () => {
      mockedFullscreenHelper.isEnabled = false;
      mockedFullscreenHelper.isInFullScreen = true;
      expect(fullScreenManager.isInFullScreen).toBe(false);
    });
  });

  describe('method for entering full screen', () => {
    it("should call helper's method for request full screen", () => {
      fullScreenManager.enterFullScreen();
      expect(mockedFullscreenHelper.request).toHaveBeenCalled();
    });

    it('should do nothing if full screen is not enable', () => {
      mockedFullscreenHelper.isEnabled = false;
      fullScreenManager.enterFullScreen();
      expect(mockedFullscreenHelper.request).not.toHaveBeenCalled();
    });
  });

  describe('method for exiting full screen', () => {
    it("should call helper's method for request full screen", () => {
      fullScreenManager.exitFullScreen();
      expect(mockedFullscreenHelper.exit).toHaveBeenCalled();
    });

    it('should do nothing if full screen is not enable', () => {
      mockedFullscreenHelper.isEnabled = false;
      fullScreenManager.exitFullScreen();
      expect(mockedFullscreenHelper.exit).not.toHaveBeenCalled();
    });
  });

  describe('due to reaction on fullscreen change', () => {
    it('should trigger proper event', () => {
      const spy = vi.spyOn(eventEmitter, 'emitAsync');

      mockedFullscreenHelper.isInFullScreen = true;
      fullScreenManager._onChange({ target: fullScreenManager._element });
      expect(spy).toHaveBeenCalledWith(
        UIEvent.FULL_SCREEN_STATE_CHANGED,
        mockedFullscreenHelper.isInFullScreen,
      );

      eventEmitter.emitAsync.mockRestore();
    });
    it('should not trigger if fullscreen target is not proper element', () => {
      const spy = vi.spyOn(eventEmitter, 'emitAsync');

      mockedFullscreenHelper.isInFullScreen = true;
      fullScreenManager._onChange({ target: null });
      expect(spy).not.toHaveBeenCalledWith(
        UIEvent.FULL_SCREEN_STATE_CHANGED,
        mockedFullscreenHelper.isInFullScreen,
      );

      eventEmitter.emitAsync.mockRestore();
    });

    it('should pause video on exit from full screen if proper config passed', () => {
      const spy = vi.spyOn(engine, 'pause');

      fullScreenManager._pauseVideoOnFullScreenExit = true;
      mockedFullscreenHelper.isInFullScreen = false;
      fullScreenManager._onChange({ target: fullScreenManager._element });
      expect(spy).toHaveBeenCalled();

      engine.pause.mockRestore();
    });
  });

  describe('due to reaction on play request', () => {
    it('should enter full screen if proper config passed', async function() {
      const spy = vi.spyOn(fullScreenManager, 'enterFullScreen');

      await eventEmitter.emitAsync(VideoEvent.PLAY_REQUEST);

      fullScreenManager._enterFullScreenOnPlay = true;
      mockedFullscreenHelper.isInFullScreen = false;
      await eventEmitter.emitAsync(VideoEvent.PLAY_REQUEST);
      expect(spy).toHaveBeenCalledTimes(1);

      fullScreenManager.enterFullScreen.mockRestore();
    });
  });

  describe('due to reaction on state changed', () => {
    describe('to end state', () => {
      it('should exit full screen if config passed', async function() {
        const spy = vi.spyOn(fullScreenManager, 'exitFullScreen');

        await eventEmitter.emitAsync(VideoEvent.STATE_CHANGED, {
          nextState: EngineState.ENDED,
        });

        fullScreenManager._exitFullScreenOnEnd = true;
        mockedFullscreenHelper.isInFullScreen = true;

        await eventEmitter.emitAsync(VideoEvent.STATE_CHANGED, {
          nextState: EngineState.ENDED,
        });
        expect(spy).toHaveBeenCalledTimes(1);

        fullScreenManager.exitFullScreen.mockRestore();
      });
    });

    describe('to pause state', () => {
      it('should exit full screen if config passed', async function() {
        const spy = vi.spyOn(fullScreenManager, 'exitFullScreen');

        await eventEmitter.emitAsync(VideoEvent.STATE_CHANGED, {
          nextState: EngineState.PAUSED,
        });

        fullScreenManager._exitFullScreenOnPause = true;
        mockedFullscreenHelper.isInFullScreen = true;

        await eventEmitter.emitAsync(VideoEvent.STATE_CHANGED, {
          nextState: EngineState.PAUSED,
        });
        expect(spy).toHaveBeenCalledTimes(1);

        fullScreenManager.exitFullScreen.mockRestore();
      });
    });
  });
});
