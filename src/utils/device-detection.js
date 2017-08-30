const getNavigator = () => window.navigator || {};

/* ignore coverage */
export const isIPhone = () => /iPhone/.test(getNavigator().userAgent) && !window.MSStream;

/* ignore coverage */
export const isIPod = () => /iPod/.test(getNavigator().userAgent) && !window.MSStream;

/* ignore coverage */
export const isIPad = () => /iPad/.test(getNavigator().userAgent) && !window.MSStream;

/* ignore coverage */
export const isAndroid = () => /(android)/i.test(getNavigator().userAgent);
