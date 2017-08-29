/* ignore coverage */
export const iPhone = /iPhone/.test(navigator.userAgent) && !window.MSStream;

/* ignore coverage */
export const iPod = /iPod/.test(navigator.userAgent) && !window.MSStream;

/* ignore coverage */
export const iPad = /iPad/.test(navigator.userAgent) && !window.MSStream;

/* ignore coverage */
export const Android = /(android)/i.test(navigator.userAgent);
