import 'jsdom-global/register';

import { expect } from 'chai';
import sinon from 'sinon';

import EventEmitter from 'eventemitter3';

import UI_EVENTS from '../../constants/events/ui';

import Engine from '../../playback-engine/playback-engine';
import Screen from './screen.controler';


describe('Loader', () => {
  let screen = {};
  let engine = {};
  let ui = {};
  let eventEmitter = {};
  let spiedVideo = {};
  let eventEmitterSpy = null;

  function generateVideoObjectWithSpies() {
    const video = {
      duration: 100,
      _currentTimeSpy: sinon.spy(),
      _volumeSpy: sinon.spy(),
      _mutedSpy: sinon.spy()
    };

    Object.defineProperties(video, {
      currentTime: {
        set: video._currentTimeSpy
      },
      volume: {
        enumerable: true,
        set: video._volumeSpy
      },
      muted: {
        enumerable: true,
        set: video._mutedSpy
      }
    });

    return video;
  }


  beforeEach(() => {
    ui = {
      setFullScreenStatus() {

      },
      get node() {
        return new $('<video>');
      },
      get isInFullScreen() {},
      exitFullScreen() {},
      enterFullScreen() {}
    };
    eventEmitter = new EventEmitter();
    engine = new Engine({
      eventEmitter
    });

    screen = new Screen({
      engine,
      ui,
      eventEmitter
    });
  });

  describe('constructor', () => {
    it('should create instance ', () => {
      expect(screen).to.exists;
      expect(screen.view).to.exists;
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

    it('should trigger _toggleVideoPlayback on keyboard input', () => {
      screen._engine.getPlaybackState = () => ({status: 0});
      const togglePlaybackSpy = sinon.spy(screen, '_toggleVideoPlayback');

      screen._processKeyboardInput({keyCode: 32});
      expect(togglePlaybackSpy.called).to.be.true;
    });

    it('should trigger _toggleVideoPlayback on node click', () => {
      const processClickSpy = sinon.spy(screen, '_processNodeClick');
      screen._bindCallbacks();
      screen._initUI();

      screen.view.$node.trigger('click');
      expect(processClickSpy.called).to.be.true;
    });

    it('should remove timeout of delayed playback change and call _toggleFullScreen on _processNodeClick ', () => {
      const timeoutClearSpy = sinon.spy(global, 'clearTimeout');
      const toggleFullscreenSpy = sinon.spy(screen, '_toggleFullScreen');
      const id = setTimeout(()=> {
      }, 0);
      screen._delayedToggleVideoPlaybackTimeout = id;
      screen.fullscreen = {
        request: ()=> {
        }
      };

      screen._processNodeClick();
      expect(timeoutClearSpy.calledWith(id)).to.be.true;
      expect(toggleFullscreenSpy.called).to.be.true;

      timeoutClearSpy.restore();
    });


    it('should emit ui event on enter full screen', () => {
      screen._enterFullScreen();

      expect(eventEmitterSpy.calledWith(UI_EVENTS.FULLSCREEN_ENTER_TRIGGERED)).to.be.true;
    });

    it('should emit ui event on exit full screen', () => {
      screen._exitFullScreen();

      expect(eventEmitterSpy.calledWith(UI_EVENTS.FULLSCREEN_EXIT_TRIGGERED)).to.be.true;
    });


    it('should have method for toggling playback', () => {
      let status = engine.STATUSES.PLAYING;
      const playSpy = sinon.spy();
      const pauseSpy = sinon.spy();
      screen._engine = {
        getPlaybackState: () => ({ status }),
        play: playSpy,
        pause: pauseSpy,
        STATUSES: engine.STATUSES
      };
      screen._toggleVideoPlayback();
      expect(pauseSpy.called).to.be.true;
    });
  });
});
