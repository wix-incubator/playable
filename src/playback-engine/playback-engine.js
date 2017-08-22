import HlsStream from './media-streams/hls-stream';
import DashStream from './media-streams/dash-stream';
import getNativeStreamCreator from './media-streams/native-stream';
import { NativeEnvironmentSupport } from '../utils/environment-detection';
import { resolvePlayableStreams } from '../utils/playback-resolution';
import { detectStreamType } from '../utils/detect-stream-type';

import StateEngine, { STATES } from './state-engine';
import NativeEventsBroadcast from './native-events-broadcast';

import { iPhone, iPod, Android, iPad } from '../utils/device-detection';

import { VIDEO_EVENTS, MEDIA_STREAM_TYPES, MEDIA_STREAM_DELIVERY_TYPE } from '../constants';


const DEFAULT_INITIAL_BITRATE = 1750; // 1750kbps, can be modified via setInitialBitrate()

const streamCreators = [
  getNativeStreamCreator(MEDIA_STREAM_TYPES.HLS, MEDIA_STREAM_DELIVERY_TYPE.NATIVE_ADAPTIVE),
  DashStream,
  HlsStream,
  getNativeStreamCreator(MEDIA_STREAM_TYPES.MP4, MEDIA_STREAM_DELIVERY_TYPE.NATIVE_PROGRESSIVE),
  getNativeStreamCreator(MEDIA_STREAM_TYPES.WEBM, MEDIA_STREAM_DELIVERY_TYPE.NATIVE_PROGRESSIVE) // Native WebM (Chrome, Firefox)
];

//TODO: Find source of problem with native HLS on Safari, when playing state triggered but actual playing is delayed
export default class Engine {
  static dependencies = ['eventEmitter', 'config'];

  constructor({ eventEmitter, config }) {
    this._eventEmitter = eventEmitter;

    this.STATES = STATES;

    this.initialBitrate = DEFAULT_INITIAL_BITRATE;

    this.playableStreamCreators = [];
    this.currentSrc = null;
    this.playableStreams = null;
    this.attachedStream = null;

    // Only add supported handlers
    streamCreators.forEach(
      streamCreator =>
      streamCreator.isSupported(NativeEnvironmentSupport) &&
      this.playableStreamCreators.push(streamCreator)
    );

    this._createVideoTag(config.engine);

    this._stateEngine = new StateEngine(this._eventEmitter, this._video);
    this._nativeEventsBroadcast = new NativeEventsBroadcast(this._eventEmitter, this._video);

    this._applyConfig(config.engine);
  }

  _createVideoTag() {
    this._video = document.createElement('video');
  }

  _applyConfig(config = {}) {
    const { preload, autoPlay, loop, muted, volume, playInline, src } = config;

    this.setPreload(preload);
    this.setAutoPlay(autoPlay);
    this.setLoop(loop);
    this.setMute(muted);
    this.setVolume(volume);
    this.setPlayInline(playInline);
    this.setSrc(src);
  }

  getNode() {
    return this._video;
  }

  _connectStreamToVideo() {
    if (!this.playableStreams) {
      return;
    }
    if (this.playableStreams.length > 0) {
      // Use the first PlayableStream for now
      // Later, we can use the others as fallback
      this.attachedStream = this.playableStreams[0];
      this.attachedStream.attach(this._video, this.initialBitrate);
    }
  }

  _detachCurrentStream() {
    if (this.attachedStream) {
      this.attachedStream.detach(this._video);
      this.attachedStream = null;
    }
  }

  _autoDetectSourceTypes(mediaSources) {
    return mediaSources.map(mediaSource => {
      if (typeof mediaSource === 'string') {
        return { url: mediaSource, type: detectStreamType(mediaSource) };
      }

      return mediaSource;
    });
  }

  _resolvePlayableStreams() {
    if (!this.currentSrc) {
      this.playableStreams = [];
      return;
    }

    const mediaSources = [].concat(this.currentSrc);
    const mediaStreams = this._autoDetectSourceTypes(mediaSources);
    this.playableStreams = resolvePlayableStreams(mediaStreams, this.playableStreamCreators, this._eventEmitter);
  }

  getDebugInfo() {
    const { duration, currentTime } = this._video;
    let data;

    if (this.attachedStream) {
      data = this.attachedStream.getDebugInfo();
    }

    return {
      ...data,
      viewDimensions: this._getViewDimensions(),
      currentTime,
      duration,
      loadingStateTimestamps: this._stateEngine.getStateTimestamps()
    };
  }

  _getViewDimensions() {
    return {
      width: this._video.offsetWidth,
      height: this._video.offsetHeight
    };
  }

  get isMetadataLoaded() {
    return this._stateEngine.isMetadataLoaded;
  }

  get isPreloadAvailable() {
    if (iPad || iPhone || iPod || Android) {
      return false;
    }

    return this.getPreload() !== 'none';
  }

  get isAutoPlayAvailable() {
    if (iPad || iPhone || iPod || Android) {
      return false;
    }

    return this.getAutoPlay();
  }

  setSrc(src) {
    if (src === this.currentSrc) {
      return;
    }

    this._stateEngine.clearTimestamps();

    this._detachCurrentStream();
    this.currentSrc = src;
    this._resolvePlayableStreams();
    this._connectStreamToVideo();

    this._stateEngine.setState(STATES.SRC_SET);
  }

  getSrc() {
    return this.currentSrc;
  }

  getState() {
    return this._stateEngine.getState();
  }

  goForward(sec) {
    const duration = this.getDurationTime();

    if (duration) {
      const current = this.getCurrentTime();
      this.setCurrentTime(Math.min(current + sec, duration));
    }
  }

  goBackward(sec) {
    const duration = this.getDurationTime();

    if (duration) {
      const current = this.getCurrentTime();
      this.setCurrentTime(Math.max(current - sec, 0));
    }
  }

  decreaseVolume(value) {
    this.setVolume(this.getVolume() - value);
  }

  increaseVolume(value) {
    this.setVolume(this.getVolume() + value);
  }

  setInitialBitrate(bitrate) {
    this.initialBitrate = bitrate;
  }

  setAutoPlay(isAutoPlay) {
    this._video.autoplay = Boolean(isAutoPlay);
  }

  getAutoPlay() {
    return this._video.autoplay;
  }

  setLoop(isLoop) {
    this._video.loop = Boolean(isLoop);
  }

  getLoop() {
    return this._video.loop;
  }

  setMute(isMuted) {
    this._video.muted = Boolean(isMuted);
  }

  getMute() {
    return this._video.muted;
  }

  setVolume(volume) {
    const parsedVolume = Number(volume);
    this._video.volume = isNaN(parsedVolume) ? 1 : Math.max(0, Math.min(Number(volume) / 100, 1));
  }

  getVolume() {
    return this._video.volume * 100;
  }

  setPlaybackRate(rate) {
    this._video.playbackRate = rate;
  }

  getPlaybackRate() {
    return this._video.playbackRate;
  }

  setPreload(preload) {
    this._video.preload = preload || 'auto';
  }

  getPreload() {
    return this._video.preload;
  }

  getCurrentTime() {
    return this._video.currentTime;
  }

  setCurrentTime(time) {
    this._video.currentTime = time;
  }

  getDurationTime() {
    return this._video.duration || 0;
  }

  getBuffered() {
    return this._video.buffered;
  }

  setPlayInline(isPlayInline) {
    if (isPlayInline) {
      this._video.setAttribute('playsInline', isPlayInline);
    }
  }

  getPlayInline() {
    return this._video.getAttribute('playsInline');
  }

  getCurrentState() {
    return this._stateEngine.getState();
  }

  play() {
    //Workaround for triggering functionality that requires user event pipe
    this._eventEmitter.emit(VIDEO_EVENTS.PLAY_REQUEST_TRIGGERED);

    this._pauseRequested = false;

    if (!this._playPromise) {
      this._playPromise = this._video.play();
      if (this._playPromise !== undefined) {
        this._playPromise
          .then(() => {
            this._playPromise = null;

            if (this._pauseRequested) {
              this.pause();
            }
          })
          .catch(() => {
            this._playPromise = null;
          });
      }
    }
  }

  pause() {
    if (this._playPromise) {
      this._pauseRequested = true;
    } else {
      this._video.pause();
      this._pauseRequested = false;
    }
  }

  destroy() {
    this._detachCurrentStream();

    this._stateEngine.destroy();
    this._nativeEventsBroadcast.destroy();
    this._video.parentNode && this._video.parentNode.removeChild(this._video);

    delete this._eventEmitter;
    delete this._video;
  }
}
