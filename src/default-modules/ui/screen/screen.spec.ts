import 'jsdom-global/register';
import * as $ from 'jbone';

import { expect } from 'chai';
import * as sinon from 'sinon';

import { STATES } from '../../../constants';

import EventEmitter from '../../event-emitter/event-emitter';
import RootContainer from '../../root-container/root-container.controler';
import Engine from '../../playback-engine/playback-engine';
import Screen from './screen.controler';
import ManipulationIndicator from '../manipulation-indicator/manipulation-indicator.controler';

describe('Loader', () => {
  let screen: any = {};
  let engine: any = {};
  let ui: any = {};
  let eventEmitter: any = {};
  let spiedVideo = {};
  let eventEmitterSpy = null;
  let config = {};
  let fullScreenManager: any = {};
  let rootContainer;
  let manipulationIndicator;

  function generateVideoObjectWithSpies() {
    const video = {
      duration: 100,
      _currentTimeSpy: sinon.spy(),
      _volumeSpy: sinon.spy(),
      _mutedSpy: sinon.spy(),
    };

    Object.defineProperties(video, {
      currentTime: {
        set: video._currentTimeSpy,
      },
      volume: {
        enumerable: true,
        set: video._volumeSpy,
      },
      muted: {
        enumerable: true,
        set: video._mutedSpy,
      },
    });

    return video;
  }

  beforeEach(() => {
    config = {
      ui: {},
    };
    fullScreenManager = {
      enterFullScreen: sinon.spy(),
      exitFullScreen: sinon.spy(),
      isActive: true,
      _config: {},
    };
    ui = {
      setFullScreenStatus() {},
      get node() {
        return new $('<video>');
      },
      get isInFullScreen() {
        return;
      },
      exitFullScreen() {},
      enterFullScreen() {},
    };
    eventEmitter = new EventEmitter();
    engine = new Engine({
      eventEmitter,
      config,
    });
    rootContainer = new RootContainer({
      eventEmitter,
      engine,
      config,
    });
    manipulationIndicator = new ManipulationIndicator({
      eventEmitter,
      engine,
      // TODO: do we need `config` here?
      // config
    });
    screen = new Screen({
      engine,
      fullScreenManager,
      // TODO: do we need `ui` here?
      // ui,
      config,
      rootContainer,
      manipulationIndicator,
      eventEmitter,
    });
  });

  describe('constructor', () => {
    it('should create instance ', () => {
      expect(screen).to.exist;
      expect(screen.view).to.exist;
    });
  });

  describe('instance callbacks', () => {
    beforeEach(() => {
      spiedVideo = generateVideoObjectWithSpies();

      eventEmitterSpy = sinon.spy(screen._eventEmitter, 'emit');
    });

    afterEach(() => {
      screen._eventEmitter.emit.restore();
    });

    it('should trigger _toggleVideoPlayback on node click', () => {
      const processClickSpy = sinon.spy(screen, '_processNodeClick');
      screen._bindCallbacks();
      screen._initUI();

      screen.view.$node.trigger('click');
      expect(processClickSpy.called).to.be.true;
    });

    it('should remove timeout of delayed playback change on _processNodeClick and call _toggleFullScreen on _processNodeDblClick', () => {
      const timeoutClearSpy = sinon.spy(global, 'clearTimeout');
      const toggleFullScreenSpy = sinon.spy(screen, '_toggleFullScreen');
      const id = setTimeout(() => {}, 0);
      screen._delayedToggleVideoPlaybackTimeout = id;
      screen.fullscreen = {
        request: () => {},
      };

      screen._processNodeClick();
      expect(timeoutClearSpy.calledWith(id)).to.be.true;
      screen._processNodeDblClick();
      expect(toggleFullScreenSpy.called).to.be.true;

      timeoutClearSpy.restore();
    });

    it('should add native controls if config passed', () => {
      config = {
        ui: {
          screen: {
            nativeControls: true,
          },
        },
      };

      const video = $('<video>')[0];

      video.setAttribute = sinon.spy();

      engine.getNode = () => video;

      screen = new Screen({
        engine,
        fullScreenManager,
        // TODO: do we need `ui` here?
        // ui,
        config,
        rootContainer,
        manipulationIndicator,
        eventEmitter,
      });

      expect(video.setAttribute.calledWith('controls', 'true')).to.be.true;
    });

    it('should emit ui event on enter full screen', () => {
      screen._enterFullScreen();

      expect(fullScreenManager.enterFullScreen.called).to.be.true;
    });

    it('should emit ui event on exit full screen', () => {
      screen._exitFullScreen();

      expect(fullScreenManager.exitFullScreen.called).to.be.true;
    });

    it('should have method for toggling playback', () => {
      let state = STATES.PLAYING;
      const playSpy = sinon.spy();
      const pauseSpy = sinon.spy();
      screen._engine = {
        getCurrentState: () => state,
        play: playSpy,
        pause: pauseSpy,
      };
      screen._toggleVideoPlayback();
      expect(pauseSpy.called).to.be.true;
    });
  });
});
