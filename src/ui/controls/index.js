import $ from 'jbone';

import fullscreen, { isFullscreenAPIExist } from '../../utils/fullscreen';

import VIDEO_EVENTS, { VIDI_PLAYBACK_STATUSES } from '../../constants/events/video';
import UI_EVENTS from '../../constants/events/ui';

import eventEmitter from '../../event-emitter';

import ProgressControl from './progress';
import PlayControl from './play';
import TimeControl from './time';
import VolumeControl from './volume';
import FullscreenControl from './fullscreen';

import styles from '../scss/index.scss';


export default class ControlBlock {
  constructor({ vidi, $wrapper, ...config }) {
    this.vidi = vidi;
    this.$wrapper = $wrapper;
    this.config = config;

    this._bindControlsCallbacks();
    this._initControls();
    this._initEvents();
  }

  get node() {
    return this.$node;
  }

  _initControls() {
    const video = this.vidi.getVideoElement();

    this.$node = $('<div>', {
      class: styles['controls-wrapper']
    });

    const $innerWrapper = $('<div>', {
      class: styles.controls
    });

    this.playControl = new PlayControl({
      onPlayClick: this._playVideo,
      onPauseClick: this._pauseVideo
    });

    $innerWrapper
      .append(this.playControl.node);

    if (this.config.timeIndicator) {
      this.timeControl = new TimeControl();

      $innerWrapper
        .append(this.timeControl.node);
    }

    if (this.config.progressControl) {
      this.progressControl = new ProgressControl({
        onProgressChange: this._changeCurrentTimeOfVideo
      });

      $innerWrapper
        .append(this.progressControl.node);
    }


    if (this.config.volumeControl) {
      this.volumeControl = new VolumeControl({
        onVolumeLevelChange: this._changeVolumeLevel,
        onMuteStatusChange: this._changeMuteStatus
      });

      this.volumeControl.setVolumeLevel(this.config.volume || video.volume);

      if (video.getAttribute('muted') === 'true') {
        this.volumeControl.setMuteStatus(true);
      }

      $innerWrapper
        .append(this.volumeControl.node);
    }

    if (this.config.fullscreenControl && isFullscreenAPIExist) {

      this.fullscreenControl = new FullscreenControl({
        onEnterFullscreenClick: this._enterFullscreen,
        onExitFullscreenClick: this._exitFullscreen
      });
      this.$wrapper.on(fullscreen.raw.fullscreenchange, event => {
        this.fullscreenControl.toggleControlStatus(fullscreen.isFullscreen);
      });

      $innerWrapper
        .append(this.fullscreenControl.node);
    }

    this.$node
      .append($innerWrapper);
  }

  _bindControlsCallbacks() {
    this._playVideo = this._playVideo.bind(this);
    this._pauseVideo = this._pauseVideo.bind(this);
    this._changeCurrentTimeOfVideo = this._changeCurrentTimeOfVideo.bind(this);
    this._changeVolumeLevel = this._changeVolumeLevel.bind(this);
    this._changeMuteStatus = this._changeMuteStatus.bind(this);
    this._enterFullscreen = this._enterFullscreen.bind(this);
    this._exitFullscreen = this._exitFullscreen.bind(this);
  }

  _initEvents() {
    eventEmitter.on(VIDEO_EVENTS.SEEK_STARTED, this._updateProgressControl, this);
    eventEmitter.on(VIDEO_EVENTS.SEEK_STARTED, this._updateCurrentTime, this);
    eventEmitter.on(VIDEO_EVENTS.DURATION_UPDATED, this._updateDurationTime, this);
    eventEmitter.on(VIDEO_EVENTS.CHUNK_LOADED, this._updateBufferIndicator, this);
    eventEmitter.on(VIDEO_EVENTS.SEEK_ENDED, this._updateBufferIndicator, this);
    eventEmitter.on(VIDEO_EVENTS.PLAYBACK_STATUS_CHANGED, this._updatePlayingStatus, this);
    eventEmitter.on(VIDEO_EVENTS.VOLUME_STATUS_CHANGED, this._updateVolumeStatus, this);
  }

  _startIntervalUpdates() {
    if (this._interval) {
      this._stopIntervalUpdates();
    }

    this._interval = setInterval(() => {
      this._updateCurrentTime();
      this._updateProgressControl();
      this._updateBufferIndicator();
    }, 1000 / 16);
  }

  _stopIntervalUpdates() {
    clearInterval(this._interval);
    this._interval = null;
  }

  _updateVolumeStatus() {
    if (!this.volumeControl) {
      return;
    }

    const video = this.vidi.getVideoElement();

    this.volumeControl.setVolumeLevel(video.volume);
    this.volumeControl.setMuteStatus(video.muted);
  }

  _updateDurationTime() {
    if (!this.timeControl) {
      return;
    }

    const video = this.vidi.getVideoElement();

    this.timeControl.setDurationTime(video.duration);
  }

  _updateCurrentTime() {
    if (!this.timeControl) {
      return;
    }

    const video = this.vidi.getVideoElement();

    this.timeControl.setCurrentTime(video.currentTime);
  }

  _updatePlayingStatus(status) {
    if (status === VIDI_PLAYBACK_STATUSES.PLAYING || status === VIDI_PLAYBACK_STATUSES.PLAYING_BUFFERING) {
      this.playControl.toggleControlStatus(true);
      this._startIntervalUpdates();
    } else {
      this.playControl.toggleControlStatus(false);
      this._stopIntervalUpdates();
    }
  }

  _updateBufferIndicator() {
    if (!this.progressControl) {
      return;
    }

    const video = this.vidi.getVideoElement();
    const { currentTime, buffered, duration } = video;

    if (!buffered.length) {
      return;
    }

    let i = 0;
    while (i < buffered.length - 1 && !(buffered.start(i) < currentTime && currentTime < buffered.end(i))) {
      i += 1;
    }

    const percent = (buffered.end(i) / duration * 100).toFixed(1);

    this.progressControl.updateBuffered(percent);
  }

  _updateProgressControl() {
    if (!this.progressControl) {
      return;
    }
    const video = this.vidi.getVideoElement();

    const { duration, currentTime } = video;
    const percent = currentTime / duration * 100;

    this.progressControl.updatePlayed(percent);
  }

  _playVideo() {
    this.vidi.play();

    eventEmitter.emit(UI_EVENTS.PLAY_TRIGGERED);
  }

  _pauseVideo() {
    this.vidi.pause();

    eventEmitter.emit(UI_EVENTS.PAUSE_TRIGGERED);
  }

  _changeCurrentTimeOfVideo(percent) {
    const video = this.vidi.getVideoElement();

    if (video.duration) {
      video.currentTime = video.duration * percent;
    }

    this.timeControl.setCurrentTime(video.currentTime);

    eventEmitter.emit(UI_EVENTS.PROGRESS_CHANGE_TRIGGERED, percent);
  }

  _changeVolumeLevel(level) {
    const video = this.vidi.getVideoElement();

    video.volume = level;
    eventEmitter.emit(UI_EVENTS.VOLUME_CHANGE_TRIGGERED, level);
  }

  _changeMuteStatus(isMuted) {
    const video = this.vidi.getVideoElement();

    video.muted = isMuted;
    eventEmitter.emit(UI_EVENTS.MUTE_STATUS_TRIGGERED, isMuted);
  }

  _enterFullscreen() {
    fullscreen.request(this.$wrapper[0]);
    eventEmitter.emit(UI_EVENTS.FULLSCREEN_ENTER_TRIGGERED);
  }

  _exitFullscreen() {
    fullscreen.exit();
    eventEmitter.emit(UI_EVENTS.FULLSCREEN_EXIT_TRIGGERED);
  }
}
