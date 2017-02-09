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

import styles from './controls.scss';

export default class ControlBlock {
  constructor({ vidi, $wrapper, eventEmitter, ...config }) {
    this.eventEmitter = eventEmitter;
    this.vidi = vidi;
    this.$wrapper = $wrapper;
    this.config = config;
    this.fullscreen = fullscreen;

    this._bindControlsCallbacks();
    this._initUI();
    this._initControls();
    this._initEvents();
  }

  get node() {
    return this.view.$node;
  }

  _initUI() {
    this.view = new View();
  }

  _initControls() {
    this._initPlayControl();

    if (this.config.timeIndicator) {
      this._initTimeIndicator();
    }

    if (this.config.progressControl) {
      this._initProgressControl();
    }


    if (this.config.volumeControl) {
      this._initVolumeControl();
    }

    if (this.config.fullscreenControl) {
      this._initFullScreenControl();
    }
  }

  _initPlayControl() {
    this.playControl = new PlayControl({
      onPlayClick: this._playVideo,
      onPauseClick: this._pauseVideo
    });

    this.view.$controlsContainer
      .append(this.playControl.node);
  }

  _initTimeIndicator() {
    this.timeControl = new TimeControl();

    this.view.$controlsContainer
      .append(this.timeControl.node);
  }

  _initProgressControl() {
    this.progressControl = new ProgressControl({
      onProgressChange: this._changeCurrentTimeOfVideo
    });

    this.view.$controlsContainer
      .append(this.progressControl.node);
  }

  _initVolumeControl() {
    const video = this.vidi.getVideoElement();

    this.volumeControl = new VolumeControl({
      onVolumeLevelChange: this._changeVolumeLevel,
      onMuteStatusChange: this._changeMuteStatus
    });

    this.volumeControl.setVolumeLevel(video.volume);

    if (video.getAttribute('muted') === 'true') {
      this.volumeControl.setMuteStatus(true);
    }

    this.view.$controlsContainer
      .append(this.volumeControl.node);
  }

  _initFullScreenControl() {
    this.fullscreenControl = new FullscreenControl({
      onEnterFullScreenClick: this._enterFullScreen,
      onExitFullScreenClick: this._exitFullScreen
    });

    this.$wrapper.on(fullscreen.raw.fullscreenchange, this._updateFullScreenControlStatus);

    this.view.$controlsContainer
      .append(this.fullscreenControl.node);
  }

  _updateFullScreenControlStatus() {
    if (this.fullscreenControl) {
      this.fullscreenControl.toggleControlStatus(fullscreen.isFullscreen);
    }
  }

  _bindControlsCallbacks() {
    this._updateFullScreenControlStatus = this._updateFullScreenControlStatus.bind(this);
    this._updateControlsOnInterval = this._updateControlsOnInterval.bind(this);
    this._playVideo = this._playVideo.bind(this);
    this._pauseVideo = this._pauseVideo.bind(this);
    this._changeCurrentTimeOfVideo = this._changeCurrentTimeOfVideo.bind(this);
    this._changeVolumeLevel = this._changeVolumeLevel.bind(this);
    this._changeMuteStatus = this._changeMuteStatus.bind(this);
    this._enterFullScreen = this._enterFullScreen.bind(this);
    this._exitFullScreen = this._exitFullScreen.bind(this);
  }

  _initEvents() {
    this.eventEmitter.on(VIDEO_EVENTS.SEEK_STARTED, this._updateProgressControl, this);
    this.eventEmitter.on(VIDEO_EVENTS.SEEK_STARTED, this._updateCurrentTime, this);
    this.eventEmitter.on(VIDEO_EVENTS.DURATION_UPDATED, this._updateDurationTime, this);
    this.eventEmitter.on(VIDEO_EVENTS.CHUNK_LOADED, this._updateBufferIndicator, this);
    this.eventEmitter.on(VIDEO_EVENTS.SEEK_ENDED, this._updateBufferIndicator, this);
    this.eventEmitter.on(VIDEO_EVENTS.PLAYBACK_STATUS_CHANGED, this._updatePlayingStatus, this);
    this.eventEmitter.on(VIDEO_EVENTS.VOLUME_STATUS_CHANGED, this._updateVolumeStatus, this);
  }

  _startIntervalUpdates() {
    if (this._interval) {
      this._stopIntervalUpdates();
    }

    this._interval = setInterval(this._updateControlsOnInterval, 1000 / 16);
  }

  _stopIntervalUpdates() {
    clearInterval(this._interval);
    this._interval = null;
  }

  _updateControlsOnInterval() {
    this._updateCurrentTime();
    this._updateProgressControl();
    this._updateBufferIndicator();
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
      this.view.$node.toggleClass(styles['video-paused'], false);
      this.playControl.toggleControlStatus(true);
      this._startIntervalUpdates();
    } else {
      this.view.$node.toggleClass(styles['video-paused'], true);
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

    this.progressControl.updateBuffered(getOverallBufferedPercent(buffered, currentTime, duration));
  }

  _updateProgressControl() {
    if (!this.progressControl) {
      return;
    }
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

  _enterFullScreen() {
    this.fullscreen.request(this.$wrapper[0]);

    this.eventEmitter.emit(UI_EVENTS.FULLSCREEN_ENTER_TRIGGERED);
  }

  _exitFullScreen() {
    this.fullscreen.exit();

    this.eventEmitter.emit(UI_EVENTS.FULLSCREEN_EXIT_TRIGGERED);
  }
}
