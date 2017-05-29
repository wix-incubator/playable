import View from './play.view';

import VIDEO_EVENTS, { VIDI_PLAYBACK_STATUSES } from '../../../constants/events/video';
import UI_EVENTS from '../../../constants/events/ui';


export default class PlayControl {
  static View = View;

  constructor({ engine, eventEmitter, view }) {
    this._engine = engine;
    this._eventEmitter = eventEmitter;

    this._isPlaying = null;

    this._bindCallbacks();
    this._initUI(view);
    this._bindEvents();

    this.setControlStatus(false);
  }

  get node() {
    return this.view.getNode();
  }

  _bindCallbacks() {
    this._togglePlayback = this._togglePlayback.bind(this);
  }

  _bindEvents() {
    this._eventEmitter.on(VIDEO_EVENTS.PLAYBACK_STATUS_CHANGED, this._updatePlayingStatus, this);
    this._eventEmitter.on(VIDEO_EVENTS.CHANGE_SRC_TRIGGERED, this.reset, this);
  }

  _togglePlayback() {
    if (this._isPlaying) {
      this._pauseVideo();
    } else {
      this._playVideo();
    }
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
        onTogglePlaybackButtonClick: this._togglePlayback
      }
    };

    if (view) {
      this.view = new view(config);
    } else {
      this.view = new PlayControl.View(config);
    }
  }

  setControlStatus(isPlaying) {
    this._isPlaying = isPlaying;
    this.view.setPlaybackStatus(this._isPlaying);
  }

  _unbindEvents() {
    this._eventEmitter.off(VIDEO_EVENTS.PLAYBACK_STATUS_CHANGED, this._updatePlayingStatus, this);
    this._eventEmitter.off(VIDEO_EVENTS.CHANGE_SRC_TRIGGERED, this.reset, this);
  }

  reset() {
    this.setControlStatus(false);
  }

  destroy() {
    this._unbindEvents();
    this.view.destroy();
    delete this.view;

    delete this._eventEmitter;
    delete this._engine;
  }
}
