import { IFullScreenHelper } from './types';

const HAVE_METADATA = 1;

let isFullScreenRequested = false;

export default class IOSFullScreen implements IFullScreenHelper {
  private _$elem: HTMLVideoElement;
  private _callback: EventListener;

  constructor(elem: HTMLVideoElement, callback: EventListener) {
    this._$elem = elem;
    this._callback = callback;

    this._bindEvents();

    this._enterWhenHasMetaData = this._enterWhenHasMetaData.bind(this);
  }

  get isAPIExist() {
    return Boolean(this._$elem && this._$elem.webkitSupportsFullscreen);
  }

  get isInFullScreen() {
    return Boolean(this._$elem && this._$elem.webkitDisplayingFullscreen);
  }

  get isEnabled() {
    return this.isAPIExist;
  }

  private _bindEvents() {
    this._$elem.addEventListener('webkitbeginfullscreen', this._callback);
    this._$elem.addEventListener('webkitendfullscreen', this._callback);
  }

  private _unbindEvents() {
    this._$elem.removeEventListener('webkitbeginfullscreen', this._callback);
    this._$elem.removeEventListener('webkitendfullscreen', this._callback);

    this._$elem.removeEventListener(
      'loadedmetadata',
      this._enterWhenHasMetaData,
    );
  }

  private _enterWhenHasMetaData() {
    this._$elem.removeEventListener(
      'loadedmetadata',
      this._enterWhenHasMetaData,
    );

    isFullScreenRequested = false;

    this.request();
  }

  request() {
    if (!this.isEnabled || this.isInFullScreen || isFullScreenRequested) {
      return false;
    }

    try {
      this._$elem.webkitEnterFullscreen();
    } catch (e) {
      if (this._$elem.readyState < HAVE_METADATA) {
        this._$elem.addEventListener(
          'loadedmetadata',
          this._enterWhenHasMetaData,
        );
        isFullScreenRequested = true;
      }
    }
  }

  exit() {
    if (!this.isEnabled || !this.isInFullScreen) {
      return false;
    }

    this._$elem.webkitExitFullscreen();
  }

  destroy() {
    this._unbindEvents();

    this._$elem = null;
  }
}
