import { resolveAdapters } from './playback-resolution';
import { detectStreamType } from './detect-stream-type';


export default class AdaptersStrategy {
  private _eventEmitter;
  private _video;
  private _playableAdapters;
  private _availableAdapters;
  private _attachedAdapter;

  constructor(eventEmitter, video, playbackAdapters = []) {
    this._video = video;
    this._eventEmitter = eventEmitter;

    this._playableAdapters = [];
    this._availableAdapters = [];
    this._attachedAdapter = null;

    playbackAdapters.forEach(
      adapter =>
        adapter.isSupported() &&
        this._availableAdapters.push(new adapter(eventEmitter)),
    );
  }

  _autoDetectSourceTypes(mediaSources) {
    return mediaSources.map(mediaSource => {
      if (typeof mediaSource === 'string') {
        return { url: mediaSource, type: detectStreamType(mediaSource) };
      }

      return mediaSource;
    });
  }

  _resolvePlayableAdapters(src) {
    if (!src) {
      this._playableAdapters = [];
      return;
    }

    const mediaSources = [].concat(src);
    const mediaStreams = this._autoDetectSourceTypes(mediaSources);
    this._playableAdapters = resolveAdapters(mediaStreams, this._availableAdapters);
  }

  _connectAdapterToVideo() {
    if (this._playableAdapters.length > 0) {
      // Use the first PlayableStream for now
      // Later, we can use the others as fallback
      this._attachedAdapter = this._playableAdapters[0];
      this._attachedAdapter.attach(this._video);
    }
  }

  _detachCurrentAdapter() {
    if (this._attachedAdapter) {
      this._attachedAdapter.detach(this._video);
      this._attachedAdapter = null;
    }
  }

  get attachedAdapter() {
    return this._attachedAdapter;
  }

  connectAdapter(src) {
    this._detachCurrentAdapter();
    this._resolvePlayableAdapters(src);
    this._connectAdapterToVideo();
  }

  destroy() {
    this._detachCurrentAdapter();

    delete this._attachedAdapter;
    delete this._availableAdapters;
    delete this._playableAdapters;

    delete this._video;
  }
}
