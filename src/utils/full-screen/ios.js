const HAVE_METADATA = 1;

let isFullScreenRequested = false;

export default class IOSFullScreen {
  constructor(elem, callback) {
    this._elem = elem;
    this._callback = callback;

    this._bindEvents();
  }

  get isAPIExist() {
    return Boolean(this._elem && this._elem.webkitSupportsFullscreen);
  }

  get isInFullScreen() {
    return Boolean(this._elem && this._elem.webkitDisplayingFullscreen);
  }

  get isEnabled() {
    return this.isAPIExist;
  }

  _bindEvents() {
    this._elem.addEventListener('webkitbeginfullscreen', this._callback);
    this._elem.addEventListener('webkitendfullscreen', this._callback);
  }

  _unbindEvents() {
    this._elem.removeEventListener('webkitbeginfullscreen', this._callback);
    this._elem.removeEventListener('webkitendfullscreen', this._callback);

    this._elem.removeEventListener('loadedmetadata', this._enterWhenHasMetaData);
  }

  _enterWhenHasMetaData() {
    this._elem.removeEventListener('loadedmetadata', this._enterWhenHasMetaData);

    isFullScreenRequested = false;

    this._elem.webkitEnterFullscreen();
  }

  request() {
    if (!this.isAPIExist || this.isInFullScreen) {
      return false;
    }

    try {
      this._elem.webkitEnterFullscreen();
    } catch (e) {
      if (this._elem.readyState < HAVE_METADATA) {
        if (isFullScreenRequested) {
          return;
        }
        this._elem.addEventListener('loadedmetadata', this._enterWhenHasMetaData);
        isFullScreenRequested = true;
      }
    }
  }

  exit() {
    if (!this.isAPIExist || !this.isInFullScreen) {
      return false;
    }

    this._elem.webkitExitFullscreen();
  }

  toggle() {
    if (this.isInFullScreen) {
      this.exit();
    } else {
      this.request();
    }
  }

  destroy() {
    this._unbindEvents();

    delete this._elem;
    delete this._callback;
  }
}
