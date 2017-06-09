const keyboardAllowed = typeof Element !== 'undefined' && 'ALLOW_KEYBOARD_INPUT' in Element;
const mockFullScreenFunction = {
  requestFullscreen: 'none',
  exitFullscreen: 'none',
  fullscreenElement: 'none',
  fullscreenEnabled: 'none',
  fullscreenchange: 'none',
  fullscreenerror: 'none'
};
const fnMap = [
  [
    'requestFullscreen',
    'exitFullscreen',
    'fullscreenElement',
    'fullscreenEnabled',
    'fullscreenchange',
    'fullscreenerror'
  ],
  // new WebKit
  [
    'webkitRequestFullscreen',
    'webkitExitFullscreen',
    'webkitFullscreenElement',
    'webkitFullscreenEnabled',
    'webkitfullscreenchange',
    'webkitfullscreenerror'

  ],
  // old WebKit (Safari 5.1)
  [
    'webkitRequestFullScreen',
    'webkitCancelFullScreen',
    'webkitCurrentFullScreenElement',
    'webkitCancelFullScreen',
    'webkitfullscreenchange',
    'webkitfullscreenerror'

  ],
  [
    'mozRequestFullScreen',
    'mozCancelFullScreen',
    'mozFullScreenElement',
    'mozFullScreenEnabled',
    'mozfullscreenchange',
    'mozfullscreenerror'
  ],
  [
    'msRequestFullscreen',
    'msExitFullscreen',
    'msFullscreenElement',
    'msFullscreenEnabled',
    'MSFullscreenChange',
    'MSFullscreenError'
  ]
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

const fullscreenFn = getFullScreenFn();

export const isFullScreenAPIExist = Boolean(fullscreenFn);

export default {
  request(elem) {
    if (!this.enabled) {
      return;
    }

    const request = fullscreenFn.requestFullscreen;

    elem = elem || document.documentElement;

    // Work around Safari 5.1 bug: reports support for
    // keyboard in fullscreen even though it doesn't.
    // Browser sniffing, since the alternative with
    // setTimeout is even worse.

    if (/5\.1[.\d]* Safari/.test(navigator.userAgent)) {
      elem[request]();
    } else {
      elem[request](keyboardAllowed && Element.ALLOW_KEYBOARD_INPUT);
    }
  },
  exit() {
    document[fullscreenFn.exitFullscreen]();
  },
  toggle(elem) {
    if (this.isFullscreen) {
      this.exit();
    } else {
      this.request(elem);
    }
  },
  raw: fullscreenFn || mockFullScreenFunction,
  get isInFullscreen() {
    return Boolean(document[fullscreenFn.fullscreenElement]);
  },

  get enabled() {
    return Boolean(document[fullscreenFn.fullscreenEnabled]);
  }
};
