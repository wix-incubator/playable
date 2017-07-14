import { MediaPlayer } from 'dashjs';

import { MEDIA_STREAM_TYPES, MEDIA_STREAM_DELIVERY_TYPE } from '../../constants/media-stream';
import Errors from '../../constants/errors';
import { getNearestBufferSegmentInfo } from '../../utils/video-data';


const DashEvents = MediaPlayer.events;

export class DashStream {
  static isSupported(env) {
    return env.MSE;
  }

  static canPlay(mediaType) {
    return mediaType === MEDIA_STREAM_TYPES.DASH;
  }

  constructor(mediaStreams, eventEmitter) {
    this.eventEmitter = eventEmitter;
    this.dashPlayer = null;
    this.mediaStream = null;
    this.onError = errorEvent => {
      if (!errorEvent) {
        return;
      }
      if (errorEvent.error === 'manifestError' || (errorEvent.error === 'download' && errorEvent.event.id === 'manifest')) {
        this.eventEmitter.emit('error', Errors.SRC_LOAD_ERROR, this.mediaStream && this.mediaStream.url, errorEvent);
      }
    };
    this.onStreamInitialized = () => {
      this.eventEmitter.emit('levels', this.getMediaLevels());
    };
    if (mediaStreams.length === 1) {
      this.mediaStream = mediaStreams[0];
    } else {
      throw new Error(`Vidi can only handle a single DASH stream. Received ${mediaStreams.length} streams.`);
    }
  }

  attach(videoElement, initialBitrate) {
    if (!this.mediaStream) {
      return;
    }
    this.dashPlayer = MediaPlayer().create();
    this.dashPlayer.getDebug().setLogToBrowserConsole(false);
    this.dashPlayer.on(DashEvents.STREAM_INITIALIZED, this.onStreamInitialized);
    this.dashPlayer.on(DashEvents.ERROR, this.onError);
    this.dashPlayer.initialize(videoElement, this.mediaStream.url, videoElement.autoplay);
    if (initialBitrate) {
      this.dashPlayer.setInitialBitrateFor('video', initialBitrate);
    }
  }

  detach() {
    if (!this.mediaStream) {
      return;
    }
    this.dashPlayer.reset();
    this.dashPlayer.off(DashEvents.STREAM_INITIALIZED, this.onStreamInitialized);
    this.dashPlayer.off(DashEvents.ERROR, this.onError);
    this.dashPlayer = null;
  }

  getMediaStreamDeliveryType() {
    return MEDIA_STREAM_DELIVERY_TYPE.ADAPTIVE_VIA_MSE;
  }

  getMediaLevels() {
    if (!this.dashPlayer) {
      return [];
    }
    const bitrates = this.dashPlayer.getBitrateInfoListFor('video') || [];
    return bitrates.map(bitrateInfo =>
      ({ bitrate: bitrateInfo.bitrate, width: bitrateInfo.width, height: bitrateInfo.height })
    );
  }

  getDebugInfo() {
    const currentStream = this.dashPlayer.getActiveStream();
    let currentTime = 0;
    if (currentStream) {
      currentTime = this.dashPlayer.time(currentStream.getId());
    }

    const bitrates = this.dashPlayer.getBitrateInfoListFor('video');
    let currentBitrate = null;
    if (this.dashPlayer.getQualityFor('video') && bitrates) {
      currentBitrate = bitrates[this.dashPlayer.getQualityFor('video')];
    }

    const overallBufferLength = this.dashPlayer.getBufferLength('video');
    const currentTrack = this.dashPlayer.getCurrentTrackFor('video');
    const nearestBufferSegInfo = getNearestBufferSegmentInfo(this.dashPlayer.getVideoElement().buffered, currentTime);

    return {
      ...this.mediaStream,
      deliveryType: this.getMediaStreamDeliveryType(),
      bitrates,
      currentBitrate,
      overallBufferLength,
      currentTrack,
      nearestBufferSegInfo
    };
  }
}
