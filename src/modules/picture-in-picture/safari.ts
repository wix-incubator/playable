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
  private _elem: SafariWebkitHTMLVideo;
  private _callback: EventListener;

  constructor(elem: HTMLVideoElement, callback: EventListener) {
    this._elem = elem as SafariWebkitHTMLVideo;
    this._callback = callback;

    this._bindEvents();
  }

  get isAPIExist() {
    return Boolean(
      this._elem && typeof this._elem.webkitSetPresentationMode === 'function',
    );
  }

  get isInPictureInPicture() {
    return Boolean(
      this._elem &&
        this._elem.webkitPresentationMode === PICTURE_IN_PICTURE_MODE,
    );
  }

  get isEnabled() {
    return this.isAPIExist;
  }

  private _bindEvents() {
    this._elem.addEventListener(
      'webkitpresentationmodechanged',
      this._callback,
    );
  }

  private _unbindEvents() {
    this._elem.removeEventListener(
      'webkitpresentationmodechanged',
      this._callback,
    );

    this._elem.removeEventListener(
      'loadedmetadata',
      this._enterWhenHasMetaData,
    );
  }

  private _enterWhenHasMetaData = () => {
    this._elem.removeEventListener(
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
      this._elem.webkitSetPresentationMode(PICTURE_IN_PICTURE_MODE);
    } catch (e) {
      if (this._elem.readyState < HAVE_METADATA) {
        this._elem.addEventListener(
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

    this._elem.webkitSetPresentationMode(INLINE_MODE);
  }

  destroy() {
    this._unbindEvents();

    this._elem = null;
    this._callback = null;
  }
}
