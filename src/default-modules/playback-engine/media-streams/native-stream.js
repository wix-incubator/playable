import { geOverallBufferLength, getNearestBufferSegmentInfo } from '../../../utils/video-data';


export default function getNativeStreamCreator(streamType, deliveryType) {
  class NativeStream {
    static isSupported(env) {
      return env[streamType];
    }

    static canPlay(mediaType) {
      return mediaType === streamType;
    }

    constructor(mediaStreams, eventEmitter) {
      this.mediaStreams = mediaStreams;
      this.eventEmitter = eventEmitter;
      this.currentLevel = 0;
    }

    attach(videoElement) {
      this.videoElement = videoElement;
      videoElement.src = this.mediaStreams[this.currentLevel].url;
    }

    detach(videoElement) {
      this.videoElement = null;
      videoElement.src = '';
    }

    getMediaStreamDeliveryType() {
      return deliveryType;
    }

    getMediaStreamType() {
      return streamType;
    }

    getDebugInfo() {
      if (this.videoElement) {
        const { buffered, currentTime } = this.videoElement;

        const overallBufferLength = geOverallBufferLength(buffered);
        const nearestBufferSegInfo = getNearestBufferSegmentInfo(buffered, currentTime);

        return {
          ...this.mediaStreams[0],
          deliveryType: this.getMediaStreamDeliveryType(),
          overallBufferLength,
          nearestBufferSegInfo
        };
      }

      return {};
    }
  }

  return NativeStream;
}
