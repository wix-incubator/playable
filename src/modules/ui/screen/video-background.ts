import { VideoOrientation } from './types';

import styles from './video-background.scss';

// NOTE: `CANVAS_BACKGROUND_PADDING` used to get rid of blur filter blurry edges
// https://medium.com/@Archie22is/css-background-image-blur-without-blurry-edges-d20e4739f425

const CANVAS_BACKGROUND_PADDING = 20;

class VideoBackground {
  private _video: HTMLVideoElement;
  private _bgCanvas: HTMLCanvasElement;
  private _bgCtx: CanvasRenderingContext2D;

  private _videoOrientation: VideoOrientation;
  private _requestAnimationFrameID;

  constructor(video: HTMLVideoElement) {
    this._video = video;
    this._videoOrientation = VideoOrientation.LANDSCAPE;

    this._initDOM();
  }

  private _initDOM() {
    this._bgCanvas = document.createElement('canvas');
    this._bgCtx = this._bgCanvas.getContext('2d');

    this._bgCanvas.classList.add(styles.videoBackgroundCanvas);

    // TODO: blur radius could be configurable and passed as inline style, but it should be autoprefixed
    this._bgCanvas.style.top = `-${CANVAS_BACKGROUND_PADDING}px`;
    this._bgCanvas.style.bottom = `${CANVAS_BACKGROUND_PADDING}px`;
    this._bgCanvas.style.left = `-${CANVAS_BACKGROUND_PADDING}px`;
    this._bgCanvas.style.right = `${CANVAS_BACKGROUND_PADDING}px`;
  }

  getNode() {
    return this._bgCanvas;
  }

  setSize(width: number, height: number) {
    this._bgCanvas.width = width + 2 * CANVAS_BACKGROUND_PADDING;
    this._bgCanvas.height = height + 2 * CANVAS_BACKGROUND_PADDING;
  }

  setVideoOrientation(videoOrientation: VideoOrientation) {
    // TODO: mb videoOrientation could be calculated here from video videoWidth/videoHeight?
    this._videoOrientation = videoOrientation;
  }

  private _clear() {
    this._bgCtx.clearRect(0, 0, this._bgCanvas.width, this._bgCanvas.height);
  }

  private _drawPortrait() {
    const videoWidth = this._video.videoWidth;
    const videoHeight = this._video.videoHeight;
    const canvasWidth = this._bgCanvas.width;
    const canvasHeight = this._bgCanvas.height;

    this._bgCtx.drawImage(this._video, 0, 0, canvasWidth, canvasHeight);
    this._bgCtx.drawImage(
      this._video,
      0,
      0,
      1,
      videoHeight,
      CANVAS_BACKGROUND_PADDING,
      CANVAS_BACKGROUND_PADDING,
      canvasWidth / 2 - CANVAS_BACKGROUND_PADDING,
      canvasHeight - 2 * CANVAS_BACKGROUND_PADDING,
    );
    this._bgCtx.drawImage(
      this._video,
      videoWidth - 1,
      0,
      1,
      videoHeight,
      canvasWidth / 2,
      CANVAS_BACKGROUND_PADDING,
      canvasWidth / 2 - CANVAS_BACKGROUND_PADDING,
      canvasHeight - 2 * CANVAS_BACKGROUND_PADDING,
    );
  }

  private _drawLandscape() {
    const videoWidth = this._video.videoWidth;
    const videoHeight = this._video.videoHeight;
    const canvasWidth = this._bgCanvas.width;
    const canvasHeight = this._bgCanvas.height;

    this._bgCtx.drawImage(this._video, 0, 0, canvasWidth, canvasHeight);
    this._bgCtx.drawImage(
      this._video,
      0,
      0,
      videoWidth,
      1,
      CANVAS_BACKGROUND_PADDING,
      CANVAS_BACKGROUND_PADDING,
      canvasWidth - 2 * CANVAS_BACKGROUND_PADDING,
      canvasHeight / 2 - CANVAS_BACKGROUND_PADDING,
    );
    this._bgCtx.drawImage(
      this._video,
      0,
      videoHeight - 1,
      videoWidth,
      1,
      CANVAS_BACKGROUND_PADDING,
      canvasHeight / 2,
      canvasWidth - 2 * CANVAS_BACKGROUND_PADDING,
      canvasHeight / 2 - CANVAS_BACKGROUND_PADDING,
    );
  }

  private _draw() {
    if (this._videoOrientation === VideoOrientation.PORTRAIT) {
      this._drawPortrait();
    } else {
      this._drawLandscape();
    }
  }

  startSync() {
    if (!this._requestAnimationFrameID) {
      const sync = () => {
        this._draw();

        this._requestAnimationFrameID = requestAnimationFrame(sync);
      };

      sync();
    }
  }

  stopSync() {
    if (this._requestAnimationFrameID) {
      cancelAnimationFrame(this._requestAnimationFrameID);
      this._clear();
      this._requestAnimationFrameID = null;
    }
  }

  destroy() {
    this.stopSync();

    this._video = null;
    this._bgCanvas = null;
    this._bgCtx = null;
  }
}

export default VideoBackground;
