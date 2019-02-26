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
function getFullScreenFn(): IFullScreenFnMap | boolean {
  const ret: IFullScreenFnMap = {};

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

interface IFullScreenFnMap {
  [fn: string]: string;
}

export default class DesktopFullScreen implements IFullScreenHelper {
  private _$elem: HTMLElement;
  private _callback: EventListener;
  private _fullscreenFn: IFullScreenFnMap | boolean;

  constructor(elem: HTMLElement, callback: EventListener) {
    this._$elem = elem;
    this._callback = callback;
    this._fullscreenFn = getFullScreenFn();

    this._bindEvents();
  }

  get isAPIExist() {
    return Boolean(this._fullscreenFn);
  }

  get isInFullScreen() {
    if (typeof this._fullscreenFn === 'boolean') {
      return false;
    }

    return Boolean((document as any)[this._fullscreenFn.fullscreenElement]);
  }

  get isEnabled() {
    if (typeof this._fullscreenFn === 'boolean') {
      return false;
    }

    return (
      this.isAPIExist && (document as any)[this._fullscreenFn.fullscreenEnabled]
    );
  }

  private _bindEvents() {
    if (typeof this._fullscreenFn === 'boolean') {
      return false;
    }

    document.addEventListener(
      this._fullscreenFn.fullscreenchange,
      this._callback,
    );
  }

  private _unbindEvents() {
    if (typeof this._fullscreenFn === 'boolean') {
      return false;
    }

    document.removeEventListener(
      this._fullscreenFn.fullscreenchange,
      this._callback,
    );
  }

  request() {
    if (!this.isEnabled) {
      return;
    }

    const request = (this._fullscreenFn as IFullScreenFnMap).requestFullscreen;

    // Work around Safari 5.1 bug: reports support for
    // keyboard in fullscreen even though it doesn't.
    // Browser sniffing, since the alternative with
    // setTimeout is even worse.

    if (/5\.1[.\d]* Safari/.test(navigator.userAgent)) {
      (this._$elem as any)[request]();
    } else {
      (this._$elem as any)[request]((Element as any).ALLOW_KEYBOARD_INPUT);
    }
  }

  exit() {
    if (!this.isEnabled) {
      return;
    }

    (document as any)[
      (this._fullscreenFn as IFullScreenFnMap).exitFullscreen
    ]();
  }

  destroy() {
    this._unbindEvents();

    this._$elem = null;
  }
}
