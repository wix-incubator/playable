import 'jsdom-global/register';

import { expect } from 'chai';
import sinon from 'sinon';

import $ from 'jbone';
import Vidi from 'vidi';

import ControlsBlock from './controls.controler';

import VIDEO_EVENTS from '../../constants/events/video';
import UI_EVENTS from '../../constants/events/ui';

import eventEmitter from '../../event-emitter';

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

  beforeEach(() => {
    $wrapper = new $('<div>');
    $video = new $('<video>', {
      controls: 'true',
    });
    vidi = new Vidi($video[0]);
  });

  describe('constructor', () => {
    beforeEach(() => {
      controls = new ControlsBlock({
        $wrapper,
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
        timeIndicator: false
      };

      controls = new ControlsBlock({
        $wrapper,
        vidi,
        ...controlsConfig
      });

      expect(controls.timeControl).to.not.exist;
    });

    it('should create instance without progress control', () => {
      const controlsConfig = {
        progressControl: false
      };

      controls = new ControlsBlock({
        $wrapper,
        vidi,
        ...controlsConfig
      });

      expect(controls.progressControl).to.not.exist;
    });

    it('should create instance without time indicator', () => {
      const controlsConfig = {
        volumeControl: false
      };

      controls = new ControlsBlock({
        $wrapper,
        vidi,
        ...controlsConfig
      });

      expect(controls.volumeControl).to.not.exist;
    });

    it('should create instance without time indicator', () => {
      const controlsConfig = {
        fullscreenControl: false
      };

      controls = new ControlsBlock({
        $wrapper,
        vidi,
        ...controlsConfig
      });

      expect(controls.fullscreenControl).to.not.exist;
    });
  });

  describe('instance callbacks to controls', () => {
    beforeEach(() => {
      controls = new ControlsBlock({
        $wrapper,
        vidi
      });

      eventEmitterSpy = sinon.spy(eventEmitter, 'emit');
    });

    afterEach(() => {
      eventEmitter.emit.restore();
    });

    it('should emit ui event on play', () => {
      controls._playVideo();
      expect(eventEmitterSpy.calledWith(UI_EVENTS.PLAY_TRIGGERED)).to.be.true;
    });

    it('should emit ui event on pause', () => {
      controls._pauseVideo();
      expect(eventEmitterSpy.calledWith(UI_EVENTS.PAUSE_TRIGGERED)).to.be.true;
    });

    it('should emit ui event on progress change', () => {
      controls._changeCurrentTimeOfVideo(10);
      expect(eventEmitterSpy.calledWith(UI_EVENTS.PROGRESS_CHANGE_TRIGGERED)).to.be.true;
    });

    it('should emit ui event on volume change', () => {
      controls._changeVolumeLevel(1);
      expect(eventEmitterSpy.calledWith(UI_EVENTS.VOLUME_CHANGE_TRIGGERED)).to.be.true;
    });

    it('should emit ui event on mute change', () => {
      controls._changeMuteStatus(true);
      expect(eventEmitterSpy.calledWith(UI_EVENTS.MUTE_STATUS_TRIGGERED)).to.be.true;
    });

    it('should emit ui event on enter full screen', () => {
      controls._enterFullScreen($wrapper);
      expect(eventEmitterSpy.calledWith(UI_EVENTS.FULLSCREEN_ENTER_TRIGGERED)).to.be.true;
    });

    it('should emit ui event on exit full screen', () => {
      controls._exitFullScreen();
      expect(eventEmitterSpy.calledWith(UI_EVENTS.FULLSCREEN_EXIT_TRIGGERED)).to.be.true;
    });
  });

  describe('instance', () => {
    beforeEach(() => {
      controls = new ControlsBlock({
        $wrapper,
        vidi
      });
    });

    it('should react on video playback status changes', () => {
      const callback = sinon.spy(controls, "_updatePlayingStatus");
      controls._initEvents();

      eventEmitter.emit(VIDEO_EVENTS.PLAYBACK_STATUS_CHANGED);
      expect(callback.called).to.be.true;
    });

    it('should react on video seek start', () => {
      const callbackProgress = sinon.spy(controls, "_updateProgressControl");
      const callbackTime = sinon.spy(controls, "_updateCurrentTime");

      controls._initEvents();

      eventEmitter.emit(VIDEO_EVENTS.SEEK_STARTED);
      expect(callbackProgress.called).to.be.true;
      expect(callbackTime.called).to.be.true;
    });

    it('should react on video seek end', () => {
      const callback = sinon.spy(controls, "_updateBufferIndicator");
      controls._initEvents();

      eventEmitter.emit(VIDEO_EVENTS.SEEK_ENDED);
      expect(callback.called).to.be.true;
    });

    it('should react on video duration update', () => {
      const callback = sinon.spy(controls, "_updateDurationTime");
      controls._initEvents();

      eventEmitter.emit(VIDEO_EVENTS.DURATION_UPDATED);
      expect(callback.called).to.be.true;
    });

    it('should react on video chunk load', () => {
      const callback = sinon.spy(controls, "_updateBufferIndicator");
      controls._initEvents();

      eventEmitter.emit(VIDEO_EVENTS.CHUNK_LOADED);
      expect(callback.called).to.be.true;
    });

    it('should react on video volume status change', () => {
      const callback = sinon.spy(controls, "_updateVolumeStatus");
      controls._initEvents();

      eventEmitter.emit(VIDEO_EVENTS.VOLUME_STATUS_CHANGED);
      expect(callback.called).to.be.true;
    });
  });
});
