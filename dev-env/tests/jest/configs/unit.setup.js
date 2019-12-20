const registerJSDom = require('jsdom-global');

registerJSDom();

window.HTMLMediaElement.prototype.play = () => {
  /* stub fn */
};
window.HTMLMediaElement.prototype.pause = () => {
  /* stub fn */
};
