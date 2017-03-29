export const iPhone = /iPhone/.test(navigator.userAgent) && !window.MSStream;
export const iPod = /iPod/.test(navigator.userAgent) && !window.MSStream;
export const iPad = /iPad/.test(navigator.userAgent) && !window.MSStream;
export const Android = /(android)/i.test(navigator.userAgent);
