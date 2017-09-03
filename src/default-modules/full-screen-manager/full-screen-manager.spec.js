import 'jsdom-global/register';

import { expect } from 'chai';
import sinon from 'sinon';

import FullScreenManager from './full-screen-manager';
import DesktopFullScreen from './desktop';
import IOSFullScreen from './ios';
import Engine from '../playback-engine/playback-engine';
import EventEmitter from '../event-emitter/event-emitter';

import { VIDEO_EVENTS, UI_EVENTS } from '../../constants/index';


const mockedFullscreenHelper = {
  isInFullScreen: false,
  isEnabled: true,
  request: sinon.spy(),
  exit: sinon.spy(),
  destroy: sinon.spy(),
  _reset: function() {
    this.isInFullScreen = false;
    this.isEnabled = true;

    this.request.reset();
    this.exit.reset();
    this.destroy.reset();
  }
};

describe('FullScreenManager' , () => {
  let fullScreenManager;
  let eventEmitter;
  let engine;
  let rootNode;
  const config = {};

  beforeEach(() => {
    eventEmitter = new EventEmitter();
    engine = new Engine({
      config,
      eventEmitter
    });
    rootNode = document.createElement('div');
    fullScreenManager = new FullScreenManager({
      eventEmitter,
      engine,
      rootNode,
      config
    });

    fullScreenManager._helper = mockedFullscreenHelper;
  });

  afterEach(() => {
    mockedFullscreenHelper._reset();
  });

  describe('chosen helper', () => {
    beforeEach(() => {
      Reflect.defineProperty(navigator, 'userAgent', {
        ...Reflect.getOwnPropertyDescriptor(navigator.constructor.prototype, 'userAgent'),
        get: function() { return this.____navigator },
        set: function(v) { this.____navigator = v; }
      });
    });

    afterEach(() => {
      Reflect.deleteProperty(navigator, 'userAgent');
    });

    it('should be for desktop if not on iOS', () => {
      navigator.userAgent = 'Computer';

      fullScreenManager = new FullScreenManager({
        eventEmitter,
        engine,
        rootNode,
        config
      });

      expect(fullScreenManager._helper instanceof DesktopFullScreen).to.be.true;
    });

    it('should be for iOS if device use it', () => {
      navigator.userAgent = 'iPhone';

      fullScreenManager = new FullScreenManager({
        eventEmitter,
        engine,
        rootNode,
        config
      });

      expect(fullScreenManager._helper instanceof IOSFullScreen).to.be.true;

      navigator.userAgent = 'iPod';

      fullScreenManager = new FullScreenManager({
        eventEmitter,
        engine,
        rootNode,
        config
      });

      expect(fullScreenManager._helper instanceof IOSFullScreen).to.be.true;

      navigator.userAgent = 'iPad';

      fullScreenManager = new FullScreenManager({
        eventEmitter,
        engine,
        rootNode,
        config
      });

      expect(fullScreenManager._helper instanceof IOSFullScreen).to.be.true;
    });

  });

  describe('enable status', () => {
    it('should be based on helper status and config', () => {
      expect(fullScreenManager.isEnabled).to.be.true;
      mockedFullscreenHelper.isEnabled = false;
      expect(fullScreenManager.isEnabled).to.be.false;
      mockedFullscreenHelper.isEnabled = true;
      fullScreenManager._config.disabled = true;
      expect(fullScreenManager.isEnabled).to.be.false;
    });
  });

  describe('full screen status', () => {
    it('should return status of helper', () => {
      mockedFullscreenHelper.isInFullScreen = true;
      expect(fullScreenManager.isInFullScreen).to.be.true;
      mockedFullscreenHelper.isInFullScreen = false;
      expect(fullScreenManager.isInFullScreen).to.be.false;
    });

    it('should return false if disabled', () => {
      mockedFullscreenHelper.isEnabled = false;
      mockedFullscreenHelper.isInFullScreen = true;
      expect(fullScreenManager.isInFullScreen).to.be.false;
    });
  });

  describe('method for entering full screen', () => {
    it('should call helper\'s method for request full screen', () => {
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
    it('should call helper\'s method for request full screen', () => {
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
      const spy = sinon.spy(eventEmitter, 'emit');

      mockedFullscreenHelper.isInFullScreen = true;
      fullScreenManager._onChange();
      expect(spy.calledWith(UI_EVENTS.FULLSCREEN_STATUS_CHANGED, mockedFullscreenHelper.isInFullScreen)).to.be.true;

      eventEmitter.emit.restore();
    });

    it('should pause video on exit from full screen if proper config passed', () => {
      const spy = sinon.spy(engine, 'pause');

      fullScreenManager._config.pauseOnExit = true;
      mockedFullscreenHelper.isInFullScreen = false;
      fullScreenManager._onChange();
      expect(spy.called).to.be.true;

      engine.pause.restore();
    });
  });

  describe('due to reaction on play request', () => {
    it('should enter full screen if proper config passed', () => {
      const spy = sinon.spy(fullScreenManager, 'enterFullScreen');

      eventEmitter.emit(VIDEO_EVENTS.PLAY_REQUEST_TRIGGERED);
      expect(spy.called).to.be.false;

      fullScreenManager._config.enterOnPlay = true;
      mockedFullscreenHelper.isInFullScreen = false;
      eventEmitter.emit(VIDEO_EVENTS.PLAY_REQUEST_TRIGGERED);
      expect(spy.called).to.be.true;

      fullScreenManager.enterFullScreen.restore();
    });
  });

  describe('due to reaction on state changed', () => {
    describe('to end state', () => {
      it('should exit full screen if config passed', () => {
        const { STATES } = engine;

        const spy = sinon.spy(fullScreenManager, 'exitFullScreen');

        eventEmitter.emit(VIDEO_EVENTS.STATE_CHANGED, {
          nextState: STATES.ENDED
        });
        expect(spy.called).to.be.false;

        fullScreenManager._config.exitOnEnd = true;
        mockedFullscreenHelper.isInFullScreen = true;

        eventEmitter.emit(VIDEO_EVENTS.STATE_CHANGED, {
          nextState: STATES.ENDED
        });
        expect(spy.called).to.be.true;

        fullScreenManager.exitFullScreen.restore();
      });
    });

    describe('to pause state', () => {
      it('should exit full screen if config passed', () => {
        const { STATES } = engine;

        const spy = sinon.spy(fullScreenManager, 'exitFullScreen');

        eventEmitter.emit(VIDEO_EVENTS.STATE_CHANGED, {
          nextState: STATES.PAUSED
        });
        expect(spy.called).to.be.false;

        fullScreenManager._config.exitOnPause = true;
        mockedFullscreenHelper.isInFullScreen = true;

        eventEmitter.emit(VIDEO_EVENTS.STATE_CHANGED, {
          nextState: STATES.PAUSED
        });
        expect(spy.called).to.be.true;

        fullScreenManager.exitFullScreen.restore();
      });
    });
  });
});
