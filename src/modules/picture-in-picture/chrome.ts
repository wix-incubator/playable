import { IPictureInPictureHelper } from './types';

const HAVE_METADATA = 1;

let isPictureInPictureRequested = false;

export interface ChromeWebkitHTMLVideo extends HTMLVideoElement {
  requestPictureInPicture: () => Promise<void>;
}

export interface ChromeDocument extends Document {
  pictureInPictureEnabled?: boolean;
  pictureInPictureElement?: Element;
  exitPictureInPicture: () => Promise<void>;
}

export default class ChromePictureInPicture implements IPictureInPictureHelper {
  private _elem: ChromeWebkitHTMLVideo;
  private _callback: EventListener;

  constructor(elem: HTMLVideoElement, callback: EventListener) {
    this._elem = elem as ChromeWebkitHTMLVideo;
    this._callback = callback;

    this._bindEvents();
  }

  get isAPIExist() {
    return Boolean('pictureInPictureEnabled' in document);
  }

  get isAPIEnabled() {
    return Boolean((document as ChromeDocument).pictureInPictureEnabled);
  }

  get isInPictureInPicture() {
    return Boolean(
      this._elem &&
        this._elem === (document as ChromeDocument).pictureInPictureElement,
    );
  }

  get isEnabled() {
    return this.isAPIExist && this.isAPIEnabled;
  }

  private _bindEvents() {
    this._elem.addEventListener('enterpictureinpicture', this._callback);
    this._elem.addEventListener('leavepictureinpicture', this._callback);
  }

  private _unbindEvents() {
    this._elem.removeEventListener('enterpictureinpicture', this._callback);
    this._elem.removeEventListener('leavepictureinpicture', this._callback);

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

  private catchException = () => {
    if (this._elem && this._elem.readyState < HAVE_METADATA) {
      this._elem.addEventListener('loadedmetadata', this._enterWhenHasMetaData);
      isPictureInPictureRequested = true;
    }
  };

  request() {
    if (
      !this.isEnabled ||
      this.isInPictureInPicture ||
      isPictureInPictureRequested
    ) {
      return false;
    }
    return this._elem.requestPictureInPicture().catch(this.catchException);
  }

  exit() {
    if (!this.isEnabled || !this.isInPictureInPicture) {
      return false;
    }

    (document as ChromeDocument).exitPictureInPicture();
  }

  destroy() {
    this._unbindEvents();

    this._elem = null;
    this._callback = null;
  }
}
