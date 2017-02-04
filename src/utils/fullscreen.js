const keyboardAllowed = typeof Element !== 'undefined' && 'ALLOW_KEYBOARD_INPUT' in Element;

const fullscreenFn = (function () {
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

  const ret = {};

  for (let i = 0; i < fnMap.length; i++) {
    if (fnMap[i] && fnMap[i][1] in document) {
      for (let j = 0; j < fnMap[i].length; j++) {
        ret[fnMap[0][j]] = fnMap[i][j];
      }
      return ret;
    }
  }

  return false;
})();

const fullscreen = {
  request: function (elem) {
    const request = fullscreenFn.requestFullscreen;

    elem = elem || document.documentElement;

    // Work around Safari 5.1 bug: reports support for
    // keyboard in fullscreen even though it doesn't.
    // Browser sniffing, since the alternative with
    // setTimeout is even worse.
    if (/5\.1[\.\d]* Safari/.test(navigator.userAgent)) {
      elem[request]();
    } else {
      elem[request](keyboardAllowed && Element.ALLOW_KEYBOARD_INPUT);
    }
  },
  exit: function () {
    document[fullscreenFn.exitFullscreen]();
  },
  toggle: function (elem) {
    if (this.isFullscreen) {
      this.exit();
    } else {
      this.request(elem);
    }
  },
  raw: fullscreenFn
};

Object.defineProperties(fullscreen, {
  isFullscreen: {
    get: function () {
      return Boolean(document[fullscreenFn.fullscreenElement]);
    }
  },
  element: {
    enumerable: true,
    get: function () {
      return document[fullscreenFn.fullscreenElement];
    }
  },
  enabled: {
    enumerable: true,
    get: function () {
      // Coerce to boolean in case of old WebKit
      return Boolean(document[fullscreenFn.fullscreenEnabled]);
    }
  }
});

export const isFullscreenAPIExist = !!fullscreenFn;
export default fullscreen;
