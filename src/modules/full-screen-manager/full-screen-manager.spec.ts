import 'jsdom-global/register';

import { expect } from 'chai';

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

    it('should be for desktop if not on iOS', () => {
      setProperty(navigator, 'userAgent', 'Computer');

      testkit = createPlayerTestkit();
      fullScreenManager = testkit.getModule('fullScreenManager');

      expect(fullScreenManager._helper instanceof DesktopFullScreen).to.be.true;
    });

    it('should be for iPhone', () => {
      setProperty(navigator, 'userAgent', 'iPhone');

      testkit = createPlayerTestkit();
      fullScreenManager = testkit.getModule('fullScreenManager');

      expect(fullScreenManager._helper instanceof IOSFullScreen).to.be.true;
    });

    it('should be for iPod', () => {
      setProperty(navigator, 'userAgent', 'iPod');

      testkit = createPlayerTestkit();
      fullScreenManager = testkit.getModule('fullScreenManager');

      expect(fullScreenManager._helper instanceof IOSFullScreen).to.be.true;
    });

    it('should be for iPad', () => {
      setProperty(navigator, 'userAgent', 'iPad');

      testkit = createPlayerTestkit();
      fullScreenManager = testkit.getModule('fullScreenManager');

      expect(fullScreenManager._helper instanceof IOSFullScreen).to.be.true;
    });
  });

  describe('enable state', () => {
    it('should be based on helper state and config', () => {
      expect(fullScreenManager.isEnabled).to.be.true;
      mockedFullscreenHelper.isEnabled = false;
      expect(fullScreenManager.isEnabled).to.be.false;
    });

    it('should return false in disabled flag passed in config', () => {
      mockedFullscreenHelper.isEnabled = true;
      fullScreenManager._isEnabled = false;
      expect(fullScreenManager.isEnabled).to.be.false;
    });
  });

  describe('full screen state', () => {
    it('should return state of helper', () => {
      mockedFullscreenHelper.isInFullScreen = true;
      expect(fullScreenManager.isInFullScreen).to.be.true;
    });

    it('should return false if disabled', () => {
      mockedFullscreenHelper.isEnabled = false;
      mockedFullscreenHelper.isInFullScreen = true;
      expect(fullScreenManager.isInFullScreen).to.be.false;
    });
  });

  describe('method for entering full screen', () => {
    it("should call helper's method for request full screen", () => {
      fullScreenManager.enterFullScreen();
      expect(mockedFullscreenHelper.request.called).to.be.true;
    });

    it('should do nothing if full screen is not enable', () => {
      mockedFullscreenHelper.isEnabled = false;
      fullScreenManager.enterFullScreen();
      expect(mockedFullscreenHelper.request.called).to.be.false;
    });
  });

  describe('method for exiting full screen', () => {
    it("should call helper's method for request full screen", () => {
      fullScreenManager.exitFullScreen();
      expect(mockedFullscreenHelper.exit.called).to.be.true;
    });

    it('should do nothing if full screen is not enable', () => {
      mockedFullscreenHelper.isEnabled = false;
      fullScreenManager.exitFullScreen();
      expect(mockedFullscreenHelper.exit.called).to.be.false;
    });
  });

  describe('due to reaction on fullscreen change', () => {
    it('should trigger proper event', () => {
      const spy: sinon.SinonSpy = sinon.spy(eventEmitter, 'emitAsync');

      mockedFullscreenHelper.isInFullScreen = true;
      fullScreenManager._onChange();
      expect(
        spy.calledWith(
          UIEvent.FULL_SCREEN_STATE_CHANGED,
          mockedFullscreenHelper.isInFullScreen,
        ),
      ).to.be.true;

      eventEmitter.emitAsync.restore();
    });

    it('should pause video on exit from full screen if proper config passed', () => {
      const spy = sinon.stub(engine, 'pause');

      fullScreenManager._pauseVideoOnFullScreenExit = true;
      mockedFullscreenHelper.isInFullScreen = false;
      fullScreenManager._onChange();
      expect(spy.called).to.be.true;

      engine.pause.restore();
    });
  });

  describe('due to reaction on play request', () => {
    it('should enter full screen if proper config passed', async function() {
      const spy = sinon.spy(fullScreenManager, 'enterFullScreen');

      await eventEmitter.emitAsync(VideoEvent.PLAY_REQUEST);

      fullScreenManager._enterFullScreenOnPlay = true;
      mockedFullscreenHelper.isInFullScreen = false;
      await eventEmitter.emitAsync(VideoEvent.PLAY_REQUEST);
      expect(spy.calledOnce).to.be.true;

      fullScreenManager.enterFullScreen.restore();
    });
  });

  describe('due to reaction on state changed', () => {
    describe('to end state', () => {
      it('should exit full screen if config passed', async function() {
        const spy = sinon.spy(fullScreenManager, 'exitFullScreen');

        await eventEmitter.emitAsync(VideoEvent.STATE_CHANGED, {
          nextState: EngineState.ENDED,
        });

        fullScreenManager._exitFullScreenOnEnd = true;
        mockedFullscreenHelper.isInFullScreen = true;

        await eventEmitter.emitAsync(VideoEvent.STATE_CHANGED, {
          nextState: EngineState.ENDED,
        });
        expect(spy.calledOnce).to.be.true;

        fullScreenManager.exitFullScreen.restore();
      });
    });

    describe('to pause state', () => {
      it('should exit full screen if config passed', async function() {
        const spy = sinon.spy(fullScreenManager, 'exitFullScreen');

        await eventEmitter.emitAsync(VideoEvent.STATE_CHANGED, {
          nextState: EngineState.PAUSED,
        });

        fullScreenManager._exitFullScreenOnPause = true;
        mockedFullscreenHelper.isInFullScreen = true;

        await eventEmitter.emitAsync(VideoEvent.STATE_CHANGED, {
          nextState: EngineState.PAUSED,
        });
        expect(spy.calledOnce).to.be.true;

        fullScreenManager.exitFullScreen.restore();
      });
    });
  });
});
