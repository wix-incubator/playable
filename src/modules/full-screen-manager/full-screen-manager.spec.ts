import * as sinon from 'sinon';
import createPlayerTestkit from '../../testkit';

import DesktopFullScreen from './desktop';
import IOSFullScreen from './ios';

import { setProperty, resetProperty } from '../../testkit';

import { VideoEvent, UIEvent, EngineState } from '../../constants';

declare const navigator: any;

const mockedFullscreenHelper = {
  isInFullScreen: false,
  isEnabled: true,
  request: sinon.spy(),
  exit: sinon.spy(),
  destroy: sinon.spy(),
  _reset() {
    this.isInFullScreen = false;
    this.isEnabled = true;

    this.request.resetHistory();
    this.exit.resetHistory();
    this.destroy.resetHistory();
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

    test('should be for desktop if not on iOS', () => {
      setProperty(navigator, 'userAgent', 'Computer');

      testkit = createPlayerTestkit();
      fullScreenManager = testkit.getModule('fullScreenManager');

      expect(fullScreenManager._helper instanceof DesktopFullScreen).toBe(true);
    });

    test('should be for iPhone', () => {
      setProperty(navigator, 'userAgent', 'iPhone');

      testkit = createPlayerTestkit();
      fullScreenManager = testkit.getModule('fullScreenManager');

      expect(fullScreenManager._helper instanceof IOSFullScreen).toBe(true);
    });

    test('should be for iPod', () => {
      setProperty(navigator, 'userAgent', 'iPod');

      testkit = createPlayerTestkit();
      fullScreenManager = testkit.getModule('fullScreenManager');

      expect(fullScreenManager._helper instanceof IOSFullScreen).toBe(true);
    });

    test('should be for iPad', () => {
      setProperty(navigator, 'userAgent', 'iPad');

      testkit = createPlayerTestkit();
      fullScreenManager = testkit.getModule('fullScreenManager');

      expect(fullScreenManager._helper instanceof IOSFullScreen).toBe(true);
    });
  });

  describe('enable state', () => {
    test('should be based on helper state and config', () => {
      expect(fullScreenManager.isEnabled).toBe(true);
      mockedFullscreenHelper.isEnabled = false;
      expect(fullScreenManager.isEnabled).toBe(false);
    });

    test('should return false in disabled flag passed in config', () => {
      mockedFullscreenHelper.isEnabled = true;
      fullScreenManager._isEnabled = false;
      expect(fullScreenManager.isEnabled).toBe(false);
    });
  });

  describe('full screen state', () => {
    test('should return state of helper', () => {
      mockedFullscreenHelper.isInFullScreen = true;
      expect(fullScreenManager.isInFullScreen).toBe(true);
    });

    test('should return false if disabled', () => {
      mockedFullscreenHelper.isEnabled = false;
      mockedFullscreenHelper.isInFullScreen = true;
      expect(fullScreenManager.isInFullScreen).toBe(false);
    });
  });

  describe('method for entering full screen', () => {
    test("should call helper's method for request full screen", () => {
      fullScreenManager.enterFullScreen();
      expect(mockedFullscreenHelper.request.called).toBe(true);
    });

    test('should do nothing if full screen is not enable', () => {
      mockedFullscreenHelper.isEnabled = false;
      fullScreenManager.enterFullScreen();
      expect(mockedFullscreenHelper.request.called).toBe(false);
    });
  });

  describe('method for exiting full screen', () => {
    test("should call helper's method for request full screen", () => {
      fullScreenManager.exitFullScreen();
      expect(mockedFullscreenHelper.exit.called).toBe(true);
    });

    test('should do nothing if full screen is not enable', () => {
      mockedFullscreenHelper.isEnabled = false;
      fullScreenManager.exitFullScreen();
      expect(mockedFullscreenHelper.exit.called).toBe(false);
    });
  });

  describe('due to reaction on fullscreen change', () => {
    test('should trigger proper event', () => {
      const spy: sinon.SinonSpy = sinon.spy(eventEmitter, 'emitAsync');

      mockedFullscreenHelper.isInFullScreen = true;
      fullScreenManager._onChange({ target: fullScreenManager._element });
      expect(
        spy.calledWith(
          UIEvent.FULL_SCREEN_STATE_CHANGED,
          mockedFullscreenHelper.isInFullScreen,
        ),
      ).toBe(true);

      eventEmitter.emitAsync.restore();
    });
    test('should not trigger if fullscreen target is not proper element', () => {
      const spy: sinon.SinonSpy = sinon.spy(eventEmitter, 'emitAsync');

      mockedFullscreenHelper.isInFullScreen = true;
      fullScreenManager._onChange({ target: null });
      expect(
        spy.calledWith(
          UIEvent.FULL_SCREEN_STATE_CHANGED,
          mockedFullscreenHelper.isInFullScreen,
        ),
      ).toBe(false);

      eventEmitter.emitAsync.restore();
    });

    test('should pause video on exit from full screen if proper config passed', () => {
      const spy = sinon.stub(engine, 'pause');

      fullScreenManager._pauseVideoOnFullScreenExit = true;
      mockedFullscreenHelper.isInFullScreen = false;
      fullScreenManager._onChange({ target: fullScreenManager._element });
      expect(spy.called).toBe(true);

      engine.pause.restore();
    });
  });

  describe('due to reaction on play request', () => {
    test('should enter full screen if proper config passed', async () => {
      const spy = sinon.spy(fullScreenManager, 'enterFullScreen');

      await eventEmitter.emitAsync(VideoEvent.PLAY_REQUEST);

      fullScreenManager._enterFullScreenOnPlay = true;
      mockedFullscreenHelper.isInFullScreen = false;
      await eventEmitter.emitAsync(VideoEvent.PLAY_REQUEST);
      expect(spy.calledOnce).toBe(true);

      fullScreenManager.enterFullScreen.restore();
    });
  });

  describe('due to reaction on state changed', () => {
    describe('to end state', () => {
      test('should exit full screen if config passed', async () => {
        const spy = sinon.spy(fullScreenManager, 'exitFullScreen');

        await eventEmitter.emitAsync(VideoEvent.STATE_CHANGED, {
          nextState: EngineState.ENDED,
        });

        fullScreenManager._exitFullScreenOnEnd = true;
        mockedFullscreenHelper.isInFullScreen = true;

        await eventEmitter.emitAsync(VideoEvent.STATE_CHANGED, {
          nextState: EngineState.ENDED,
        });
        expect(spy.calledOnce).toBe(true);

        fullScreenManager.exitFullScreen.restore();
      });
    });

    describe('to pause state', () => {
      test('should exit full screen if config passed', async () => {
        const spy = sinon.spy(fullScreenManager, 'exitFullScreen');

        await eventEmitter.emitAsync(VideoEvent.STATE_CHANGED, {
          nextState: EngineState.PAUSED,
        });

        fullScreenManager._exitFullScreenOnPause = true;
        mockedFullscreenHelper.isInFullScreen = true;

        await eventEmitter.emitAsync(VideoEvent.STATE_CHANGED, {
          nextState: EngineState.PAUSED,
        });
        expect(spy.calledOnce).toBe(true);

        fullScreenManager.exitFullScreen.restore();
      });
    });
  });
});
