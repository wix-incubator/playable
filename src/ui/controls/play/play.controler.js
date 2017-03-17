import View from './play.view';

import VIDEO_EVENTS, { VIDI_PLAYBACK_STATUSES } from '../../../constants/events/video';
import UI_EVENTS from '../../../constants/events/ui';


export default class PlayControl {
  static View = View;

  constructor({ engine, eventEmitter, view }) {
    this._engine = engine;
    this._eventEmitter = eventEmitter;

    this._bindCallbacks();
    this._initUI(view);
    this._bindEvents();

    this.setControlStatus(false);
  }

  get node() {
    return this.view.getNode();
  }

  _bindCallbacks() {
    this._playVideo = this._playVideo.bind(this);
    this._pauseVideo = this._pauseVideo.bind(this);
  }

  _bindEvents() {
    this._eventEmitter.on(VIDEO_EVENTS.PLAYBACK_STATUS_CHANGED, this._updatePlayingStatus, this);
 }

  _playVideo() {
    this._engine.play();

    this._eventEmitter.emit(UI_EVENTS.PLAY_TRIGGERED);
  }

  _pauseVideo() {
    this._engine.pause();

    this._eventEmitter.emit(UI_EVENTS.PAUSE_TRIGGERED);
  }

  _updatePlayingStatus(status) {
    if (status === VIDI_PLAYBACK_STATUSES.PLAYING || status === VIDI_PLAYBACK_STATUSES.PLAYING_BUFFERING) {
      this.setControlStatus(true);
    } else {
      this.setControlStatus(false);
    }
  }

  _initUI(view) {
    const config = {
      callbacks: {
        onPlayButtonClick: this._playVideo,
        onPauseButtonClick: this._pauseVideo
      }
    };

    if (view) {
      this.view = new view(config);
    } else {
      this.view = new PlayControl.View(config);
    }
  }

  setControlStatus(isPlaying) {
    this.view.setPlaybackStatus(isPlaying);
  }

  _unbindEvents() {
    this._eventEmitter.on(VIDEO_EVENTS.PLAYBACK_STATUS_CHANGED, this._updatePlayingStatus, this);
  }

  destroy() {
    this._unbindEvents();
    this.view.destroy();
    delete this.view;

    delete this._eventEmitter;
    delete this._engine;

    delete this._callbacks;
  }
}
