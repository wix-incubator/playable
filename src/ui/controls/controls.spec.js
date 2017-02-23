import 'jsdom-global/register';

import { expect } from 'chai';
import sinon from 'sinon';

import $ from 'jbone';
import Vidi from 'vidi';

import ControlsBlock from './controls.controler';

import VIDEO_EVENTS, { VIDI_PLAYBACK_STATUSES } from '../../constants/events/video';
import UI_EVENTS from '../../constants/events/ui';

import EventEmitter from 'eventemitter3';

describe('ControlsBlock', () => {
  const DEFAULT_CONFIG = {
    timeIndicator: true,
    progressControl: true,
    volumeControl: true,
    fullscreenControl: true
  };

  let controls = {};
  let $wrapper = {};
  let $video = {};
  let vidi = {};
  let eventEmitterSpy = null;
  let eventEmitter = null;
  let spiedVideo = null;

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
    $wrapper = new $('<div>');
    $video = new $('<video>', {
      controls: 'true',
    });
    vidi = new Vidi($video[0]);
    eventEmitter = new EventEmitter();
  });

  describe('constructor', () => {
    beforeEach(() => {
      controls = new ControlsBlock({
        $wrapper,
        eventEmitter,
        vidi
      });
    });
    it('should create instance ', () => {
      expect(controls).to.exists;
      expect(controls.view).to.exists;
    });
  });

  describe('instance created with default config', () => {
    beforeEach(() => {
      controls = new ControlsBlock({
        $wrapper,
        vidi,
        eventEmitter,
        ...DEFAULT_CONFIG
      });
    });

    it('should have play control', () => {
      expect(controls.playControl).to.exist;
    });

    it('should have time indicator', () =>{
      expect(controls.timeControl).to.exist;
    });

    it('should have progress control', () =>{
      expect(controls.progressControl).to.exist;
    });

    it('should have volume control', () =>{
      expect(controls.volumeControl).to.exist;
    });

    it('should set mute status and volume level of video tag to volume control', () => {
      $video[0].volume = 0.5;
      $video.attr('muted','true');
      controls._initVolumeControl();

      expect(controls.volumeControl.volumeLevel).to.be.equal(50);
      expect(controls.volumeControl.isMuted).to.be.true;
    });

    it('should have full screen control', () =>{
      expect(controls.fullscreenControl).to.exist;
    });
  });

  describe('instance created with extended config', () => {
    it('should create instance without time indicator', () => {
      const controlsConfig = {
        time: false
      };

      controls = new ControlsBlock({
        $wrapper,
        vidi,
        eventEmitter,
        config: controlsConfig
      });

      controls._updateCurrentTime();
      controls._updateDurationTime();

      expect(controls.timeControl.isHidden).to.be.true;
    });

    it('should create instance without progress control', () => {
      const controlsConfig = {
        progress: false
      };

      controls = new ControlsBlock({
        $wrapper,
        vidi,
        eventEmitter,
        config: controlsConfig
      });

      controls._updateProgressControl();
      controls._updateBufferIndicator();

      expect(controls.progressControl.isHidden).to.be.true;
    });

    it('should create instance without volume control', () => {
      const controlsConfig = {
        volume: false
      };

      controls = new ControlsBlock({
        $wrapper,
        vidi,
        eventEmitter,
        config: controlsConfig
      });

      controls._updateVolumeStatus();

      expect(controls.volumeControl.isHidden).to.be.true;
    });

    it('should create instance without full screen control', () => {
      const controlsConfig = {
        fullscreen: false
      };

      controls = new ControlsBlock({
        $wrapper,
        vidi,
        eventEmitter,
        config: controlsConfig
      });

      controls._updateFullScreenControlStatus();

      expect(controls.fullscreenControl.isHidden).to.be.true;
    });
  });

  describe('instance callbacks to controls', () => {
    beforeEach(() => {
      controls = new ControlsBlock({
        $wrapper,
        vidi,
        eventEmitter,
        ...DEFAULT_CONFIG
      });
      spiedVideo = generateVideoObjectWithSpies();

      eventEmitterSpy = sinon.spy(controls.eventEmitter, 'emit');
    });

    afterEach(() => {
      controls.eventEmitter.emit.restore();
    });

    it('should emit ui event on play', () => {
      const callback = sinon.spy(controls.vidi, 'play');

      controls._playVideo();

      expect(callback.called).to.be.true;
      expect(eventEmitterSpy.calledWith(UI_EVENTS.PLAY_TRIGGERED)).to.be.true;

      controls.vidi.play.restore();
    });

    it('should emit ui event on pause', () => {
      const callback = sinon.spy(controls.vidi, 'pause');

      controls._pauseVideo();

      expect(callback.called).to.be.true;
      expect(eventEmitterSpy.calledWith(UI_EVENTS.PAUSE_TRIGGERED)).to.be.true;

      controls.vidi.pause.restore();
    });

    it('should trigger _toggleVideoPlayback on keyboard input', () => {
      controls.vidi.getPlaybackState = () => ({ status: 0 });
      const togglePlaybackSpy = sinon.spy(controls, '_toggleVideoPlayback');

      controls._processKeyboardInput({ keyCode: 32 });
      expect(togglePlaybackSpy.called).to.be.true;
    });

    it('should stop propagation on control block click', () => {
      const preventSpy = sinon.spy(controls, '_preventClickPropagation');
      const eventStopPropSpy = sinon.spy();

      controls._bindEvents();

      controls.view.$controlsContainer.trigger('click');
      expect(preventSpy.called).to.be.true;

      controls._preventClickPropagation({
        stopPropagation: eventStopPropSpy
      });

      expect(eventStopPropSpy.called).to.be.true;
    });

    it('should trigger _toggleVideoPlayback on node click', () => {
      const processClickSpy = sinon.spy(controls, '_processNodeClick');

      controls._bindEvents();
      controls.view.$node.trigger('click');
      expect(processClickSpy.called).to.be.true;
    });

    it('should remove timeout of delayed playback change and call _toggleFullScreen on _processNodeClick ', () => {
      const timeoutClearSpy = sinon.spy(global, 'clearTimeout');
      const toggleFullscreenSpy = sinon.spy(controls, '_toggleFullScreen');
      const id = setTimeout(()=>{}, 0);
      controls._delayedToggleVideoPlaybackTimeout = id;
      controls.fullscreen = {
        request: ()=>{}
      };

      controls._processNodeClick();
      expect(timeoutClearSpy.calledWith(id)).to.be.true;
      expect(toggleFullscreenSpy.called).to.be.true;
    });

    it('should toggle fullscreen on _toggleFullScreen', () => {
      const requestMock = sinon.spy();
      const exitMock = sinon.spy();
      controls.fullscreen = {
        request: requestMock,
        exit: exitMock,
        isFullscreen: false
      };

      controls._toggleFullScreen();
      expect(requestMock.called).to.be.true;

      controls.fullscreen.isFullscreen = true;

      controls._toggleFullScreen();
      expect(exitMock.called).to.be.true;
    });

    it('should trigger play or pause on _toggleVideoPlayback', () => {
      const playCallback = sinon.spy(controls, '_playVideo');
      const pauseCallback = sinon.spy(controls, '_pauseVideo');

      controls.vidi.getPlaybackState = () => ({ status: 0 });
      controls._toggleVideoPlayback();
      expect(playCallback.called).to.be.true;

      controls.vidi.getPlaybackState = () => ({ status: 2 });
      controls._toggleVideoPlayback();
      expect(pauseCallback.called).to.be.true;
    });

    it ('should stop video on seek manipulation start', () => {
      const callback = sinon.spy(controls.vidi, 'pause');

      controls._pauseVideoOnProgressManipulationStart()
      expect(callback.called).to.be.true;
      expect(eventEmitterSpy.calledWith(UI_EVENTS.PROGRESS_MANIPULATION_STARTED)).to.be.true;
    });

    it ('should stop video on seek manipulation stop', () => {
      const callback = sinon.spy(controls.vidi, 'play');

      controls._playVideoOnProgressManipulationEnd()
      expect(callback.called).to.be.true;
      expect(eventEmitterSpy.calledWith(UI_EVENTS.PROGRESS_MANIPULATION_ENDED)).to.be.true;
    });

    it('should emit ui event on progress change', () => {
      vidi.getVideoElement = () => spiedVideo;

      controls._changeCurrentTimeOfVideo(10);

      expect(spiedVideo._currentTimeSpy.called).to.be.true;
      expect(eventEmitterSpy.calledWith(UI_EVENTS.PROGRESS_CHANGE_TRIGGERED)).to.be.true;
    });

    it('should emit ui event on volume change', () => {
      vidi.getVideoElement = () => spiedVideo;

      controls._changeVolumeLevel(1);

      expect(spiedVideo._volumeSpy.called).to.be.true;
      expect(eventEmitterSpy.calledWith(UI_EVENTS.VOLUME_CHANGE_TRIGGERED)).to.be.true;
    });

    it('should emit ui event on mute change', () => {
      vidi.getVideoElement = () => spiedVideo;

      controls._changeMuteStatus(true);

      expect(spiedVideo._mutedSpy.called).to.be.true;
      expect(eventEmitterSpy.calledWith(UI_EVENTS.MUTE_STATUS_TRIGGERED)).to.be.true;
    });

    it('should emit ui event on enter full screen', () => {
      const requestMock = sinon.spy();
      controls.fullscreen.request = requestMock;

      controls._enterFullScreen($wrapper);

      expect(requestMock.called).to.be.true;
      expect(eventEmitterSpy.calledWith(UI_EVENTS.FULLSCREEN_ENTER_TRIGGERED)).to.be.true;
    });

    it('should emit ui event on exit full screen', () => {
      const exitMock = sinon.spy();
      controls.fullscreen.exit = exitMock;

      controls._exitFullScreen();

      expect(exitMock.called).to.be.true;
      expect(eventEmitterSpy.calledWith(UI_EVENTS.FULLSCREEN_EXIT_TRIGGERED)).to.be.true;
    });

    it('should update controls on interval trigger', () => {
      const updateCurrentTimeSpy = sinon.spy(controls, "_updateCurrentTime");
      const updateProgressControl = sinon.spy(controls, "_updateProgressControl");
      const updateBufferIndicator = sinon.spy(controls, "_updateBufferIndicator");

      controls._updateControlsOnInterval();

      expect(updateCurrentTimeSpy.called).to.be.true;
      expect(updateProgressControl.called).to.be.true;
      expect(updateBufferIndicator.called).to.be.true;
    });

    it('should update controls on interval trigger', () => {
      const fullScreenControlToggleStatusSpy = sinon.spy(controls.fullscreenControl, "toggleControlStatus");

      controls._updateFullScreenControlStatus();

      expect(fullScreenControlToggleStatusSpy.called).to.be.true;
    });
  });

  describe('instance', () => {
    beforeEach(() => {
      controls = new ControlsBlock({
        $wrapper,
        vidi,
        eventEmitter,
        ...DEFAULT_CONFIG
      });
    });

    it('should react on video playback status changed on play', () => {
      const updatePlayingStatusSpy = sinon.spy(controls, "_updatePlayingStatus");
      const startIntervalSpy = sinon.spy(controls, "_startIntervalUpdates");

      const playControlToggleStatusSpy = sinon.spy(controls.playControl, "toggleControlStatus");

      controls._bindEvents();

      eventEmitter.emit(VIDEO_EVENTS.PLAYBACK_STATUS_CHANGED, VIDI_PLAYBACK_STATUSES.PLAYING);

      expect(updatePlayingStatusSpy.called).to.be.true;
      expect(playControlToggleStatusSpy.calledWith(true)).to.be.true;
      expect(startIntervalSpy.called).to.be.true;
    });

    it('should react on video playback status changed on paused', () => {
      const updatePlayingStatusSpy = sinon.spy(controls, "_updatePlayingStatus");
      const stopIntervalSpy = sinon.spy(controls, "_stopIntervalUpdates");

      const playControlToggleStatusSpy = sinon.spy(controls.playControl, "toggleControlStatus");

      controls._bindEvents();

      eventEmitter.emit(VIDEO_EVENTS.PLAYBACK_STATUS_CHANGED, VIDI_PLAYBACK_STATUSES.PAUSED);

      expect(updatePlayingStatusSpy.called).to.be.true;
      expect(playControlToggleStatusSpy.calledWith(false)).to.be.true;
      expect(stopIntervalSpy.called).to.be.true;
    });

    it('should react on video playback status changed on ended', () => {
      const updatePlayingStatusSpy = sinon.spy(controls, "_updatePlayingStatus");
      const stopIntervalSpy = sinon.spy(controls, "_stopIntervalUpdates");

      const playControlToggleStatusSpy = sinon.spy(controls.playControl, "toggleControlStatus");

      controls._bindEvents();

      eventEmitter.emit(VIDEO_EVENTS.PLAYBACK_STATUS_CHANGED, VIDI_PLAYBACK_STATUSES.ENDED);

      expect(updatePlayingStatusSpy.called).to.be.true;
      expect(playControlToggleStatusSpy.calledWith(false)).to.be.true;
      expect(stopIntervalSpy.called).to.be.true;
    });

    it('should react on video seek start', () => {
      const updateProgressControlSpy = sinon.spy(controls, "_updateProgressControl");
      const updateCurrentTimeSpy = sinon.spy(controls, "_updateCurrentTime");

      const progressControlUpdatePlayedSpy = sinon.spy(controls.progressControl, "updatePlayed");
      const timeIndicatorSetCurrentTimeSpy = sinon.spy(controls.timeControl, "setCurrentTime");

      controls._bindEvents();

      eventEmitter.emit(VIDEO_EVENTS.SEEK_STARTED);

      expect(updateProgressControlSpy.called).to.be.true;
      expect(updateCurrentTimeSpy.called).to.be.true;
      expect(progressControlUpdatePlayedSpy.called).to.be.true;
      expect(timeIndicatorSetCurrentTimeSpy.called).to.be.true;
    });

    it('should react on video seek end', () => {
      const updateBufferIndicatorSpy = sinon.spy(controls, "_updateBufferIndicator");

      const progressControlUpdateBufferedSpy = sinon.spy(controls.progressControl, "updateBuffered");

      controls._bindEvents();

      eventEmitter.emit(VIDEO_EVENTS.SEEK_ENDED);

      expect(updateBufferIndicatorSpy.called).to.be.true;
      expect(progressControlUpdateBufferedSpy.called).to.be.true;

    });

    it('should react on video duration update', () => {
      const updateDurationTimeSpy = sinon.spy(controls, "_updateDurationTime");

      const timeIndicatorSetDurationTimeSpy = sinon.spy(controls.timeControl, "setDurationTime");

      controls._bindEvents();

      eventEmitter.emit(VIDEO_EVENTS.DURATION_UPDATED);

      expect(updateDurationTimeSpy.called).to.be.true;
      expect(timeIndicatorSetDurationTimeSpy.called).to.be.true;
    });

    it('should react on video chunk load', () => {
      const updateBufferIndicatorSpy = sinon.spy(controls, "_updateBufferIndicator");

      const progressControlUpdateBufferedSpy = sinon.spy(controls.progressControl, "updateBuffered");

      controls._bindEvents();

      eventEmitter.emit(VIDEO_EVENTS.CHUNK_LOADED);
      expect(updateBufferIndicatorSpy.called).to.be.true;
      expect(progressControlUpdateBufferedSpy.called).to.be.true;
    });

    it('should react on video volume status change', () => {
      const updateVolumeStatusSpy = sinon.spy(controls, "_updateVolumeStatus");

      const volumeControlSetVolumeSpy = sinon.spy(controls.volumeControl, "setVolumeLevel");
      const volumeControlSetMuteSpy = sinon.spy(controls.volumeControl, "setMuteStatus");


      controls._bindEvents();

      eventEmitter.emit(VIDEO_EVENTS.VOLUME_STATUS_CHANGED);

      expect(updateVolumeStatusSpy.called).to.be.true;
      expect(volumeControlSetVolumeSpy.called).to.be.true;
      expect(volumeControlSetMuteSpy.called).to.be.true;
    });

    it('should have method for setting controls focused state', () => {
      expect(controls._setFocusState).to.exist;
      controls._setFocusState();
      expect(controls._isControlsFocused).to.be.true;
    });

    it('should have method for removing controls focused state', () => {
      expect(controls._removeFocusState).to.exist;
      controls._setFocusState();
      controls._removeFocusState();
      expect(controls._isControlsFocused).to.be.false;
    });

    it('should have method for showing inner block with controls', () => {
      const spy = sinon.spy(controls.view.$node, 'toggleClass');

      expect(controls._showContent).to.exist;
      controls._showContent();
      expect(spy.called).to.be.true;
    });

    it('should have method for hiding inner block with controls', () => {
      const spy = sinon.spy(controls.view.$node, 'toggleClass');

      expect(controls._hideContent).to.exist;
      controls._hideContent();
      expect(spy.called).to.be.true;
    });
  });

  describe('API', () => {
    beforeEach(() => {
      controls = new ControlsBlock({
        $wrapper,
        vidi,
        eventEmitter,
        ...DEFAULT_CONFIG
      });
    });

    it('should have method for showing whole view', () => {
      expect(controls.show).to.exist;
      controls.show();
      expect(controls.isHidden).to.be.false;
    });

    it('should have method for hiding whole view', () => {
      expect(controls.hide).to.exist;
      controls.hide();
      expect(controls.isHidden).to.be.true;
    });
  });
});
