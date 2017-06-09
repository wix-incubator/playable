const HAVE_METADATA = 1;

let isFullScreenRequested = false;


export const isFullScreenAPIExist = videoRef => videoRef && videoRef.webkitEnterFullscreen ? true : false;

export default {
  request(videoRef) {
    if (!isFullScreenAPIExist(videoRef) || isInFullscreen(videoRef)) {
      return false;
    }

    try {
      videoRef.webkitEnterFullscreen();
    } catch (e) {
      if (videoRef.readyState < HAVE_METADATA) {
        if (isFullScreenRequested) {
          return;
        }
        const enterWhenHasMetaData = () => {
          videoRef.removeEventListener('loadedmetadata', enterWhenHasMetaData);
          isFullScreenRequested = false;
          videoRef.webkitEnterFullscreen();
        };
        videoRef.addEventListener('loadedmetadata', enterWhenHasMetaData);
        isFullScreenRequested = true;
      }
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

  isInFullscreen(videoRef) {
    return Boolean(videoRef && videoRef.webkitDisplayingFullscreen);
  },

  get enabled() {
    return Boolean(document[fullscreenFn.fullscreenEnabled]);
  }
}
