declare const window: {
  navigator: any;
  MSStream: any;
};

const IPHONE_PATTERN = /iPhone/;
const IPOD_PATTERN = /iPod/;
const IPAD_PATTERN = /iPad/;

// There is some iPhone/iPad/iPod in Windows Phone...
// https://msdn.microsoft.com/en-us/library/hh869301(v=vs.85).aspx
const isIE = !!window.MSStream;

const getUserAgent = () => window.navigator && window.navigator.userAgent;

const isIPhone = () => !isIE && IPHONE_PATTERN.test(getUserAgent());

const isIPod = () => !isIE && IPOD_PATTERN.test(getUserAgent());

const isIPad = () => !isIE && IPAD_PATTERN.test(getUserAgent());

const isIOS = () => isIPhone() || isIPod() || isIPad();

const isAndroid = () => /(android)/i.test(getUserAgent());

export { isIPhone, isIPod, isIPad, isIOS, isAndroid };
