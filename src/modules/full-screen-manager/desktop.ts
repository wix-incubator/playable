import { IFullScreenHelper } from './types';

const fnMap = [
  [
    'requestFullscreen',
    'exitFullscreen',
    'fullscreenElement',
    'fullscreenEnabled',
    'fullscreenchange',
    'fullscreenerror',
  ],
  // new WebKit
  [
    'webkitRequestFullscreen',
    'webkitExitFullscreen',
    'webkitFullscreenElement',
    'webkitFullscreenEnabled',
    'webkitfullscreenchange',
    'webkitfullscreenerror',
  ],
  // old WebKit (Safari 5.1)
  [
    'webkitRequestFullScreen',
    'webkitCancelFullScreen',
    'webkitCurrentFullScreenElement',
    'webkitCancelFullScreen',
    'webkitfullscreenchange',
    'webkitfullscreenerror',
  ],
  [
    'mozRequestFullScreen',
    'mozCancelFullScreen',
    'mozFullScreenElement',
    'mozFullScreenEnabled',
    'mozfullscreenchange',
    'mozfullscreenerror',
  ],
  [
    'msRequestFullscreen',
    'msExitFullscreen',
    'msFullscreenElement',
    'msFullscreenEnabled',
    'MSFullscreenChange',
    'MSFullscreenError',
  ],
];

/* ignore coverage */
function getFullScreenFn() {
  const ret = {};

  for (let i = 0; i < fnMap.length; i += 1) {
    if (fnMap[i][1] in document) {
      for (let j = 0; j < fnMap[i].length; j += 1) {
        ret[fnMap[0][j]] = fnMap[i][j];
      }
      return ret;
    }
  }

  return false;
}

export default class DesktopFullScreen implements IFullScreenHelper {
  private _elem;
  private _callback;
  private _fullscreenFn;

  constructor(elem, callback) {
    this._elem = elem;
    this._callback = callback;
    this._fullscreenFn = getFullScreenFn();

    this._bindEvents();
  }

  get isAPIExist() {
    return Boolean(this._fullscreenFn);
  }

  get isInFullScreen() {
    return Boolean(document[this._fullscreenFn.fullscreenElement]);
  }

  get isEnabled() {
    return this.isAPIExist && document[this._fullscreenFn.fullscreenEnabled];
  }

  private _bindEvents() {
    document.addEventListener(
      this._fullscreenFn.fullscreenchange,
      this._callback,
    );
  }

  private _unbindEvents() {
    document.removeEventListener(
      this._fullscreenFn.fullscreenchange,
      this._callback,
    );
  }

  request() {
    if (!this.isEnabled) {
      return;
    }

    const request = this._fullscreenFn.requestFullscreen;

    // Work around Safari 5.1 bug: reports support for
    // keyboard in fullscreen even though it doesn't.
    // Browser sniffing, since the alternative with
    // setTimeout is even worse.

    if (/5\.1[.\d]* Safari/.test(navigator.userAgent)) {
      this._elem[request]();
    } else {
      this._elem[request]((Element as any).ALLOW_KEYBOARD_INPUT);
    }
  }

  exit() {
    if (!this.isEnabled) {
      return;
    }

    document[this._fullscreenFn.exitFullscreen]();
  }

  destroy() {
    this._unbindEvents();

    this._elem = null;
    this._callback = null;
  }
}
