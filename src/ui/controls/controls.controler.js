import fullscreen from '../../utils/fullscreen';
import { getOverallBufferedPercent, getOverallPlayedPercent } from '../../utils/video-data';

import VIDEO_EVENTS, { VIDI_PLAYBACK_STATUSES } from '../../constants/events/video';
import UI_EVENTS from '../../constants/events/ui';

import View from './controls.view';

import ProgressControl from './progress/progress.controler';
import PlayControl from './play/play.controler';
import TimeControl from './time/time.controler';
import VolumeControl from './volume/volume.controler';
import FullscreenControl from './full-screen/full-screen.controler';


const DEFAULT_CONFIG = {
  play: {},
  time: true,
  progress: true,
  volume: true,
  fullscreen: true,
  view: null
};

const PLAYBACK_CHANGE_TIMEOUT = 300;
const HIDE_CONTROLS_BLOCK_TIMEOUT = 2000;
const SPACE_BAR_KEYCODE = 32;

export default class ControlBlock {
  constructor({ vidi, uiView, eventEmitter, config }) {
    this.eventEmitter = eventEmitter;
    this.vidi = vidi;
    this.uiView = uiView;
    this.config = {
      ...DEFAULT_CONFIG,
      ...config
    };
    this.isHidden = false;
    this.isVideoPaused = false;

    this._hideControlsTimeout = null;
    this._updateControlsInterval = null;

    this._isControlsFocused = false;

    this._bindControlsCallbacks();
    this._initUI();
    this._initControls();
    this._bindEvents();
  }

  get node() {
    return this.view.getNode();
  }

  _initUI() {
    const config = {
      controlsWrapperView: this.config && this.config.view,
      callbacks: {
        onWrapperMouseMove: this._startHideControlsTimeout,
        onWrapperMouseOut: this._hideContent,
        onWrapperMouseClick: this._processNodeClick,
        onWrapperKeyPress: this._processKeyboardInput,
        onControlsBlockMouseClick: this._preventClickPropagation,
        onControlsBlockMouseMove: this._setFocusState,
        onControlsBlockMouseOut: this._removeFocusState
      }
    };

    this.view = new View(config);
  }

  _initControls() {
    this._initPlayControl();

    this._initTimeIndicator();

    this._initProgressControl();

    this._initVolumeControl();

    this._initFullScreenControl();
  }

  _initPlayControl() {
    this.playControl = new PlayControl({
      onPlayClick: this._playVideo,
      onPauseClick: this._pauseVideo,
      view: this.config.play && this.config.play.view
    });

    this.view.appendControlNode(this.playControl.node);
  }

  _initTimeIndicator() {
    this.timeControl = new TimeControl({
      view: this.config.time && this.config.time.view
    });

    this.view.appendControlNode(this.timeControl.node);

    if (!this.config.time) {
      this.timeControl.hide();
    }
  }

  _initProgressControl() {
    this.progressControl = new ProgressControl({
      onInteractionStart: this._pauseVideoOnProgressManipulationStart,
      onInteractionEnd: this._playVideoOnProgressManipulationEnd,
      onProgressChange: this._changeCurrentTimeOfVideo,
      view: this.config.progress && this.config.progress.view
    });

    this.view.appendControlNode(this.progressControl.node);

    if (!this.config.progress) {
      this.progressControl.hide();
    }
  }

  _initVolumeControl() {
    const video = this.vidi.getVideoElement();

    this.volumeControl = new VolumeControl({
      onVolumeLevelChange: this._changeVolumeLevel,
      onMuteStatusChange: this._changeMuteStatus,
      view: this.config.volume && this.config.volume.view
    });

    this.volumeControl.setVolumeLevel(video.volume);

    if (video.getAttribute('muted') === 'true') {
      this.volumeControl.setMuteStatus(true);
    }

    this.view.appendControlNode(this.volumeControl.node);

    if (!this.config.volume) {
      this.volumeControl.hide();
    }
  }

  _initFullScreenControl() {
    this.fullscreenControl = new FullscreenControl({
      onEnterFullScreenClick: this._enterFullScreen,
      onExitFullScreenClick: this._exitFullScreen,
      view: this.config.fullscreen && this.config.fullscreen.view
    });

    this.view.appendControlNode(this.fullscreenControl.node);

    if (!this.config.fullscreen) {
      this.fullscreenControl.hide();
    }
  }

  _updateFullScreenControlStatus() {
    this.fullscreenControl.setControlStatus(fullscreen.isFullscreen);
  }

  _bindControlsCallbacks() {
    this._pauseVideoOnProgressManipulationStart = this._pauseVideoOnProgressManipulationStart.bind(this);
    this._playVideoOnProgressManipulationEnd = this._playVideoOnProgressManipulationEnd.bind(this);
    this._processNodeClick = this._processNodeClick.bind(this);
    this._toggleFullScreen = this._toggleFullScreen.bind(this);
    this._toggleVideoPlayback = this._toggleVideoPlayback.bind(this);
    this._processKeyboardInput = this._processKeyboardInput.bind(this);
    this._startHideControlsTimeout = this._startHideControlsTimeout.bind(this);
    this._setFocusState = this._setFocusState.bind(this);
    this._removeFocusState = this._removeFocusState.bind(this);
    this._showContent = this._showContent.bind(this);
    this._hideContent = this._hideContent.bind(this);
    this._updateControlsOnInterval = this._updateControlsOnInterval.bind(this);
    this._playVideo = this._playVideo.bind(this);
    this._pauseVideo = this._pauseVideo.bind(this);
    this._changeCurrentTimeOfVideo = this._changeCurrentTimeOfVideo.bind(this);
    this._changeVolumeLevel = this._changeVolumeLevel.bind(this);
    this._changeMuteStatus = this._changeMuteStatus.bind(this);
    this._enterFullScreen = this._enterFullScreen.bind(this);
    this._exitFullScreen = this._exitFullScreen.bind(this);
  }

  _bindEvents() {
    this.eventEmitter.on(VIDEO_EVENTS.SEEK_STARTED, this._updateProgressControl, this);
    this.eventEmitter.on(VIDEO_EVENTS.SEEK_STARTED, this._updateCurrentTime, this);
    this.eventEmitter.on(VIDEO_EVENTS.DURATION_UPDATED, this._updateDurationTime, this);
    this.eventEmitter.on(VIDEO_EVENTS.CHUNK_LOADED, this._updateBufferIndicator, this);
    this.eventEmitter.on(VIDEO_EVENTS.SEEK_ENDED, this._updateBufferIndicator, this);
    this.eventEmitter.on(VIDEO_EVENTS.PLAYBACK_STATUS_CHANGED, this._updatePlayingStatus, this);
    this.eventEmitter.on(VIDEO_EVENTS.VOLUME_STATUS_CHANGED, this._updateVolumeStatus, this);

    this.eventEmitter.on(UI_EVENTS.FULLSCREEN_STATUS_CHANGED, this._updateFullScreenControlStatus, this);
  }

  _processKeyboardInput(e) {
    if (e.keyCode === SPACE_BAR_KEYCODE) {
      this._toggleVideoPlayback();
    }
  }

  _preventClickPropagation(e) {
    e.stopPropagation();
  }

  _processNodeClick() {
    if (this._delayedToggleVideoPlaybackTimeout) {
      clearTimeout(this._delayedToggleVideoPlaybackTimeout);
      this._delayedToggleVideoPlaybackTimeout = null;

      this._toggleFullScreen();
    } else {
      this._delayedToggleVideoPlaybackTimeout = setTimeout(this._toggleVideoPlayback, PLAYBACK_CHANGE_TIMEOUT);
    }
  }

  _toggleVideoPlayback() {
    this._delayedToggleVideoPlaybackTimeout = null;
    const playbackState = this.vidi.getPlaybackState();

    if (playbackState.status === VIDI_PLAYBACK_STATUSES.PLAYING || playbackState.status.PLAYING_BUFFERING) {
      this._pauseVideo();
    } else {
      this._playVideo();
    }
  }

  _startHideControlsTimeout() {
    if (this._hideControlsTimeout) {
      clearTimeout(this._hideControlsTimeout);
    }

    this._showContent();

    if (!this._isControlsFocused) {
      this._hideControlsTimeout = setTimeout(this._hideContent, HIDE_CONTROLS_BLOCK_TIMEOUT);
    }
  }

  _setFocusState() {
    this._isControlsFocused = true;
  }

  _removeFocusState() {
    this._isControlsFocused = false;
  }

  _showContent() {
    this.view.showControlsBlock();
  }

  _hideContent() {
    if (!this.isVideoPaused) {
      this.view.hideControlsBlock();
    }
  }

  _startIntervalUpdates() {
    if (this._updateControlsInterval) {
      this._stopIntervalUpdates();
    }

    this._updateControlsInterval = setInterval(this._updateControlsOnInterval, 1000 / 16);
  }

  _stopIntervalUpdates() {
    clearInterval(this._updateControlsInterval);
    this._updateControlsInterval = null;
  }

  _updateControlsOnInterval() {
    this._updateCurrentTime();
    this._updateProgressControl();
    this._updateBufferIndicator();
  }

  _updateVolumeStatus() {
    const video = this.vidi.getVideoElement();

    this.volumeControl.setVolumeLevel(video.volume);
    this.volumeControl.setMuteStatus(video.muted);
  }

  _updateDurationTime() {
    const video = this.vidi.getVideoElement();

    this.timeControl.setDurationTime(video.duration);
  }

  _updateCurrentTime() {
    const video = this.vidi.getVideoElement();

    this.timeControl.setCurrentTime(video.currentTime);
  }

  _updatePlayingStatus(status) {
    if (status === VIDI_PLAYBACK_STATUSES.PLAYING || status === VIDI_PLAYBACK_STATUSES.PLAYING_BUFFERING) {
      this._startHideControlsTimeout();
      this.isVideoPaused = false;
      this.playControl.setControlStatus(true);
      this._startIntervalUpdates();
    } else {
      if (status === VIDI_PLAYBACK_STATUSES.ENDED) {
        this._hideContent();
        this.isVideoPaused = false;
      } else {
        this._showContent();
        this.isVideoPaused = true;
      }
      this.playControl.setControlStatus(false);
      this._stopIntervalUpdates();
    }
  }

  _updateBufferIndicator() {
    const video = this.vidi.getVideoElement();
    const { currentTime, buffered, duration } = video;

    this.progressControl.updateBuffered(getOverallBufferedPercent(buffered, currentTime, duration));
  }

  _updateProgressControl() {
    const video = this.vidi.getVideoElement();

    const { duration, currentTime } = video;

    this.progressControl.updatePlayed(getOverallPlayedPercent(currentTime, duration));
  }

  _playVideo() {
    this.vidi.play();

    this.eventEmitter.emit(UI_EVENTS.PLAY_TRIGGERED);
  }

  _pauseVideo() {
    this.vidi.pause();

    this.eventEmitter.emit(UI_EVENTS.PAUSE_TRIGGERED);
  }

  _pauseVideoOnProgressManipulationStart() {
    this.vidi.pause();

    this.eventEmitter.emit(UI_EVENTS.PROGRESS_MANIPULATION_STARTED);
  }

  _playVideoOnProgressManipulationEnd() {
    this.vidi.play();

    this.eventEmitter.emit(UI_EVENTS.PROGRESS_MANIPULATION_ENDED);
  }

  _changeCurrentTimeOfVideo(percent) {
    const video = this.vidi.getVideoElement();

    if (video.duration) {
      video.currentTime = video.duration * percent;
    }

    this.eventEmitter.emit(UI_EVENTS.PROGRESS_CHANGE_TRIGGERED, percent);
  }

  _changeVolumeLevel(level) {
    const video = this.vidi.getVideoElement();

    video.volume = level;
    this.eventEmitter.emit(UI_EVENTS.VOLUME_CHANGE_TRIGGERED, level);
  }

  _changeMuteStatus(isMuted) {
    const video = this.vidi.getVideoElement();

    video.muted = isMuted;
    this.eventEmitter.emit(UI_EVENTS.MUTE_STATUS_TRIGGERED, isMuted);
  }

  _toggleFullScreen() {
    if (fullscreen.isFullscreen) {
      this._exitFullScreen();
    } else {
      this._enterFullScreen();
    }
  }

  _enterFullScreen() {
    this.eventEmitter.emit(UI_EVENTS.FULLSCREEN_ENTER_TRIGGERED);

    this.uiView.enterFullScreen();
  }

  _exitFullScreen() {
    this.eventEmitter.emit(UI_EVENTS.FULLSCREEN_EXIT_TRIGGERED);

    this.uiView.exitFullScreen();
  }

  hide() {
    this.isHidden = true;
    this.view.hide();
  }

  show() {
    this.isHidden = false;
    this.view.show();
  }

  _unbindEvents() {
    this.eventEmitter.off(VIDEO_EVENTS.SEEK_STARTED, this._updateProgressControl, this);
    this.eventEmitter.off(VIDEO_EVENTS.SEEK_STARTED, this._updateCurrentTime, this);
    this.eventEmitter.off(VIDEO_EVENTS.DURATION_UPDATED, this._updateDurationTime, this);
    this.eventEmitter.off(VIDEO_EVENTS.CHUNK_LOADED, this._updateBufferIndicator, this);
    this.eventEmitter.off(VIDEO_EVENTS.SEEK_ENDED, this._updateBufferIndicator, this);
    this.eventEmitter.off(VIDEO_EVENTS.PLAYBACK_STATUS_CHANGED, this._updatePlayingStatus, this);
    this.eventEmitter.off(VIDEO_EVENTS.VOLUME_STATUS_CHANGED, this._updateVolumeStatus, this);

    this.eventEmitter.off(UI_EVENTS.FULLSCREEN_STATUS_CHANGED, this._updateFullScreenControlStatus, this);
  }

  destroy() {
    this._unbindEvents();
    this.view.destroy();
    delete this.view;

    delete this.isHidden;

    this.fullscreenControl.destroy();
    delete this.fullscreenControl;

    this.volumeControl.destroy();
    delete this.volumeControl;

    this.progressControl.destroy();
    delete this.progressControl;

    this.playControl.destroy();
    delete this.playControl;

    this.timeControl.destroy();
    delete this.timeControl;

    delete this.eventEmitter;
    delete this.vidi;
    delete this.uiView;
    delete this.config;
  }
}
