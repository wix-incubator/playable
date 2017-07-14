import { geOverallBufferLength, getNearestBufferSegmentInfo } from '../../utils/video-data';


export function getNativeStreamCreator(streamType, deliveryType) {
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
      this.eventEmitter.emit('levels',
        this.mediaStreams.map(
          mediaStream => ({ name: mediaStream.name || mediaStream.url })
        )
      );
      this.eventEmitter.emit('currentLevel', this.currentLevel);
    }

    detach(videoElement) {
      this.videoElement = null;
      videoElement.src = '';
    }

    getMediaStreamDeliveryType() {
      return deliveryType;
    }

    setMediaLevel(newLevel, videoElement) {
      if (newLevel < this.mediaStreams.length) {
        this.currentLevel = newLevel;
        const timeBeforeSwitch = videoElement.currentTime;
        videoElement.src = this.mediaStreams[this.currentLevel].url;
        videoElement.currentTime = timeBeforeSwitch;
        this.eventEmitter.emit('currentLevel', this.currentLevel);
      }
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
