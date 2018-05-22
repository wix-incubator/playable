declare const window: {
  navigator: any;
  MSStream: any;
};

const IPHONE_PATTERN = /iphone/i;
const IPOD_PATTERN = /ipod/i;
const IPAD_PATTERN = /ipad/i;
const ANDROID_PATTERN = /(android)/i;
const SAFARI_PATTERN = /^((?!chrome|android).)*safari/i;
const DESKTOP_SAFARI_PATTERN = /^((?!chrome|android|iphone|ipod|ipad).)*safari/i;

// There is some iPhone/iPad/iPod in Windows Phone...
// https://msdn.microsoft.com/en-us/library/hh869301(v=vs.85).aspx
const isIE = () => !!window.MSStream;

const getUserAgent = () => window.navigator && window.navigator.userAgent;

const isIPhone = () => !isIE() && IPHONE_PATTERN.test(getUserAgent());

const isIPod = () => !isIE() && IPOD_PATTERN.test(getUserAgent());

const isIPad = () => !isIE() && IPAD_PATTERN.test(getUserAgent());

const isIOS = () => isIPhone() || isIPod() || isIPad();

const isAndroid = () => ANDROID_PATTERN.test(getUserAgent());

const isDesktopSafari = () => DESKTOP_SAFARI_PATTERN.test(getUserAgent());

const isSafari = () => SAFARI_PATTERN.test(getUserAgent());

export {
  isIPhone,
  isIPod,
  isIPad,
  isIOS,
  isAndroid,
  isDesktopSafari,
  isSafari,
};
