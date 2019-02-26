import { IPictureInPictureHelper } from './types';

const HAVE_METADATA = 1;
export const PICTURE_IN_PICTURE_MODE = 'picture-in-picture';
export const INLINE_MODE = 'inline';

let isPictureInPictureRequested = false;

interface SafariWebkitHTMLVideo extends HTMLVideoElement {
  webkitSetPresentationMode?: (mode: string) => void;
  webkitPresentationMode: string;
}

export default class SafariPictureInPicture implements IPictureInPictureHelper {
  private _$elem: SafariWebkitHTMLVideo;
  private _callback: EventListener;

  constructor(elem: HTMLVideoElement, callback: EventListener) {
    this._$elem = elem as SafariWebkitHTMLVideo;
    this._callback = callback;

    this._bindEvents();
  }

  get isAPIExist() {
    return Boolean(
      this._$elem &&
        typeof this._$elem.webkitSetPresentationMode === 'function',
    );
  }

  get isInPictureInPicture() {
    return Boolean(
      this._$elem &&
        this._$elem.webkitPresentationMode === PICTURE_IN_PICTURE_MODE,
    );
  }

  get isEnabled() {
    return this.isAPIExist;
  }

  private _bindEvents() {
    this._$elem.addEventListener(
      'webkitpresentationmodechanged',
      this._callback,
    );
  }

  private _unbindEvents() {
    this._$elem.removeEventListener(
      'webkitpresentationmodechanged',
      this._callback,
    );

    this._$elem.removeEventListener(
      'loadedmetadata',
      this._enterWhenHasMetaData,
    );
  }

  private _enterWhenHasMetaData = () => {
    this._$elem.removeEventListener(
      'loadedmetadata',
      this._enterWhenHasMetaData,
    );

    isPictureInPictureRequested = false;

    this.request();
  };

  request() {
    if (
      !this.isEnabled ||
      this.isInPictureInPicture ||
      isPictureInPictureRequested
    ) {
      return false;
    }
    try {
      //NOT FIRING EXEPTION IF NOT TRIGGERED BY USER GESTURE
      this._$elem.webkitSetPresentationMode(PICTURE_IN_PICTURE_MODE);
    } catch (e) {
      if (this._$elem.readyState < HAVE_METADATA) {
        this._$elem.addEventListener(
          'loadedmetadata',
          this._enterWhenHasMetaData,
        );
        isPictureInPictureRequested = true;
      }
    }
  }

  exit() {
    if (!this.isEnabled || !this.isInPictureInPicture) {
      return false;
    }

    this._$elem.webkitSetPresentationMode(INLINE_MODE);
  }

  destroy() {
    this._unbindEvents();

    this._$elem = null;
  }
}
