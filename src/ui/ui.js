import Vidi from 'vidi';
import $ from 'jbone';

import VIDEO_EVENTS from '../constants/events/video';
import UI_EVENTS from '../constants/events/ui';

import eventEmitter from '../event-emitter';

import Overlay from './overlay';
import ProgressControl from './controls/progress';
import PlayControl from './controls/play';
import TimeControl from './controls/time';
import VolumeControl from './controls/volume';

import styles from './scss/index.scss';


class PlayerUI {
  constructor({ $video, vidi, enableOverlay, enableControls }) {
    this.$video = $video;
    this.vidi = vidi;
    this.config = {
      enableOverlay,
      enableControls
    };

    this._initUICallbacks();
    this._initWrapper();
    this._initEvents();
  }

  _initWrapper() {
    this.$wrapper = $('<div>', {
      class: styles['video-wrapper']
    });

    if (this.config.enableOverlay) {
      this._initOverlay();
      this.$wrapper
        .append(this.overlay.node);
    }

    this.$wrapper
      .append(this.$video);

    if (this.config.enableControls) {
      this._initControls();
      this.$wrapper
        .append(this.$controls);
    }
  }

  _initOverlay() {
    this.overlay = new Overlay({
      src: this.$video.attr('poster'),
      onPlayClick: this._playVideo
    });

    this.$video.removeAttr('poster');
  }

  _initControls() {
    this.playControl = new PlayControl({
      onPlayClick: this._playVideo,
      onPauseClick: this._pauseVideo
    });

    this.progressControl = new ProgressControl({
      onProgressChange: this._changeCurrentTimeOfVideo
    });

    this.timeControl = new TimeControl();

    this.volumeControl = new VolumeControl({
      onVolumeLevelChange: this._changeVolumeLevel,
      onMuteStatusChange: this._changeMuteStatus
    });

    this.volumeControl.setVolumeLevel(this.$video[0].volume);

    const $wrapper = $('<div>', {
      class: styles['controls-wrapper']
    });

    const $innerWrapper = $('<div>', {
      class: styles.controls
    });

    $innerWrapper
      .append(this.playControl.node)
      .append(this.timeControl.node)
      .append(this.progressControl.node)
      .append(this.volumeControl.node);

    $wrapper
      .append($innerWrapper);

    this.$controls = $wrapper;

    this.$video.removeAttr('controls');
  }

  _initEvents() {
    if (this.config.enableControls) {
      eventEmitter.on(VIDEO_EVENTS.SEEK_STARTED, this._updateProgressControl, this);
      eventEmitter.on(VIDEO_EVENTS.SEEK_STARTED, this._updateCurrentTime, this);
      eventEmitter.on(VIDEO_EVENTS.DURATION_UPDATED, this._updateDurationTime, this);
      eventEmitter.on(VIDEO_EVENTS.CHUNK_LOADED, this._updateBufferIndicator, this);
      eventEmitter.on(VIDEO_EVENTS.SEEK_ENDED, this._updateBufferIndicator, this);
    }
    eventEmitter.on(VIDEO_EVENTS.PLAYBACK_STATUS_CHANGED, this._updatePlayingStatus, this);
  }

  _initUICallbacks() {
    this._playVideo = this._playVideo.bind(this);
    this._pauseVideo = this._pauseVideo.bind(this);
    this._changeCurrentTimeOfVideo = this._changeCurrentTimeOfVideo.bind(this);
    this._changeVolumeLevel = this._changeVolumeLevel.bind(this);
    this._changeMuteStatus = this._changeMuteStatus.bind(this);
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

  _updateDurationTime() {
    this.timeControl.setDurationTime(this.$video[0].duration);
  }

  _updateCurrentTime() {
    this.timeControl.setCurrentTime(this.$video[0].currentTime);
  }

  _updatePlayingStatus(status) {
    if (status === Vidi.PlaybackStatus.PLAYING || status === Vidi.PlaybackStatus.PLAYING_BUFFERING) {
      this.$wrapper.toggleClass(styles['video-playing'], true);

      if (this.config.enableControls) {
        this.playControl.toggleControlStatus(true);
        this._startIntervalUpdates();
      }
    } else {
      this.$wrapper.toggleClass(styles['video-playing'], false);

      if (this.config.enableControls) {
        this.playControl.toggleControlStatus(false);
        this._stopIntervalUpdates();
      }

      if (status === Vidi.PlaybackStatus.ENDED && this.config.enableOverlay) {
        this.overlay.showOverlay();
      }
    }
  }

  _updateBufferIndicator() {
    const { currentTime, buffered, duration } = this.$video[0];

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
    const { duration, currentTime } = this.$video[0];
    const percent = currentTime / duration * 100;

    this.progressControl.updatePlayed(percent);
  }

  _playVideo() {
    if (this.overlay && !this.overlay.isHidden) {
      this.overlay.hideOverlay();
    }

    this.vidi.play();

    eventEmitter.emit(UI_EVENTS.PLAY_TRIGGERED);
  }

  _pauseVideo() {
    this.vidi.pause();

    eventEmitter.emit(UI_EVENTS.PAUSE_TRIGGERED);
  }

  _changeCurrentTimeOfVideo(percent) {
    const video = this.$video[0];

    if (video.duration) {
      video.currentTime = video.duration * percent;
    }

    this.timeControl.setCurrentTime(video.currentTime);

    eventEmitter.emit(UI_EVENTS.PROGRESS_CHANGE_TRIGGERED, percent);
  }

  _changeVolumeLevel(level) {
    this.$video[0].volume = level;
    eventEmitter.emit(UI_EVENTS.VOLUME_CHANGE_TRIGGERED, level);
  }

  _changeMuteStatus(isMuted) {
    this.$video[0].muted = isMuted;
    eventEmitter.emit(UI_EVENTS.MUTE_STATUS_TRIGGERED, isMuted);
  }
}

export default PlayerUI;
