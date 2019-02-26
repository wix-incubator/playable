import { CrossOriginValue, IVideoOutput } from '../types';

type Preload = 'auto' | 'metadata' | 'none';

export default class NativeOutput implements IVideoOutput {
  private _video: HTMLVideoElement;

  constructor(videoElement?: HTMLVideoElement) {
    this.on = this.on.bind(this);
    this.off = this.off.bind(this);

    this._createVideoTag(videoElement);
  }

  private _createVideoTag(videoElement?: HTMLVideoElement) {
    if (videoElement && videoElement.tagName === 'VIDEO') {
      this._video = videoElement;
    } else {
      this._video = document.createElement('video');
    }
  }

  play() {
    return this._video.play();
  }

  pause() {
    return this._video.pause();
  }

  setMute(mute: boolean) {
    this._video.muted = mute;
  }

  setAutoplay(isAutoplay: boolean) {
    this._video.autoplay = isAutoplay;
  }

  setInline(isPlaysinline: boolean) {
    if (isPlaysinline) {
      this._video.setAttribute('playsinline', 'true');
    } else {
      this._video.removeAttribute('playsinline');
    }
  }

  setCrossOrigin(crossOrigin?: 'anonymous' | 'use-credentials') {
    if (crossOrigin) {
      this._video.setAttribute('crossorigin', crossOrigin);
    } else {
      this._video.removeAttribute('crossorigin');
    }
  }

  setCurrentTime(time: number) {
    this._video.currentTime = time;
  }

  setVolume(volume: number) {
    this._video.volume = volume;
  }

  setLoop(isLoop: boolean) {
    this._video.loop = isLoop;
  }

  setPlaybackRate(rate: number) {
    this._video.playbackRate = rate;
  }

  setPreload(preload: Preload = 'auto') {
    this._video.preload = preload || 'auto';
  }

  setSrc(src?: string) {
    if (!src) {
      this._video.removeAttribute('src');

      return;
    }

    this._video.src = src;
  }

  getElement() {
    return this._video;
  }

  getViewDimensions() {
    return {
      width: this._video.offsetWidth,
      height: this._video.offsetHeight,
    };
  }

  on(event: string, cb: (event?: Event) => void) {
    this._video.addEventListener(event, cb);
  }

  off(event: string, cb: (event?: Event) => void) {
    this._video.removeEventListener(event, cb);
  }

  get length() {
    return this._video.played.length;
  }

  get volume() {
    return this._video.volume;
  }

  get currentTime() {
    return this._video.currentTime;
  }

  get duration() {
    return this._video.duration;
  }

  get autoplay() {
    return this._video.autoplay;
  }

  get crossOrigin() {
    return this._video.getAttribute('crossorigin') as CrossOriginValue;
  }

  get playbackRate() {
    return this._video.playbackRate;
  }

  get buffered() {
    return this._video.buffered;
  }

  get preload() {
    return this._video.preload as Preload;
  }

  get isPaused() {
    return this._video.paused;
  }

  get isMuted() {
    return Boolean(this._video.muted);
  }

  get isEnded() {
    return this._video.ended;
  }

  get isInline() {
    return Boolean(this._video.getAttribute('playsinline'));
  }

  get isAutoplay() {
    return this._video.autoplay;
  }

  get isLoop() {
    return this._video.loop;
  }

  get videoHeight() {
    return this._video.videoHeight;
  }

  get videoWidth() {
    return this._video.videoWidth;
  }

  get error() {
    return this._video.error;
  }

  get src() {
    return this._video.src;
  }

  destroy() {
    this._video.parentNode && this._video.parentNode.removeChild(this._video);

    this._video = null;
  }
}
