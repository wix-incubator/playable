import HlsStream from './media-streams/hls-stream';
import DashStream from './media-streams/dash-stream';
import getNativeStreamCreator from './media-streams/native-stream';

import { NativeEnvironmentSupport } from '../../utils/environment-detection';
import { resolvePlayableStreams } from '../../utils/playback-resolution';
import { detectStreamType } from '../../utils/detect-stream-type';
import { MEDIA_STREAM_TYPES, MEDIA_STREAM_DELIVERY_TYPE } from '../../constants/index';

const streamCreators = [
  getNativeStreamCreator(MEDIA_STREAM_TYPES.HLS, MEDIA_STREAM_DELIVERY_TYPE.NATIVE_ADAPTIVE),
  DashStream,
  HlsStream,
  getNativeStreamCreator(MEDIA_STREAM_TYPES.MP4, MEDIA_STREAM_DELIVERY_TYPE.NATIVE_PROGRESSIVE),
  getNativeStreamCreator(MEDIA_STREAM_TYPES.WEBM, MEDIA_STREAM_DELIVERY_TYPE.NATIVE_PROGRESSIVE) // Native WebM (Chrome, Firefox)
];


const DEFAULT_INITIAL_BITRATE = 1750;

export default class MediaStreamsStrategy {
  constructor(eventEmitter, video) {
    this._eventEmitter = eventEmitter;
    this._video = video;

    this._initialBitrate = DEFAULT_INITIAL_BITRATE;

    this._playableStreamCreators = [];
    this._playableStreams = null;
    this._attachedStream = null;

    streamCreators.forEach(
      streamCreator =>
        streamCreator.isSupported(NativeEnvironmentSupport) &&
        this._playableStreamCreators.push(streamCreator)
    );
  }

  _autoDetectSourceTypes(mediaSources) {
    return mediaSources.map(mediaSource => {
      if (typeof mediaSource === 'string') {
        return { url: mediaSource, type: detectStreamType(mediaSource) };
      }

      return mediaSource;
    });
  }

  _resolvePlayableStreams(src) {
    if (!src) {
      this._playableStreams = [];
      return;
    }

    const mediaSources = [].concat(src);
    const mediaStreams = this._autoDetectSourceTypes(mediaSources);
    this._playableStreams = resolvePlayableStreams(mediaStreams, this._playableStreamCreators, this._eventEmitter);
  }

  _connectStreamToVideo() {
    if (!this._playableStreams) {
      return;
    }

    if (this._playableStreams.length > 0) {
      // Use the first PlayableStream for now
      // Later, we can use the others as fallback
      this._attachedStream = this._playableStreams[0];
      this._attachedStream.attach(this._video, this._initialBitrate);
    }
  }

  _detachCurrentStream() {
    if (this._attachedStream) {
      this._attachedStream.detach(this._video);
      this._attachedStream = null;
    }
  }

  get attachedStream() {
    return this._attachedStream;
  }

  setInitialBitrate(bitrate) {
    this.initialBitrate = bitrate;
  }

  connectMediaStream(src) {
    this._detachCurrentStream();
    this._resolvePlayableStreams(src);
    this._connectStreamToVideo();
  }

  destroy() {
    this._detachCurrentStream();

    delete this._attachedStream;
    delete this._playableStreamCreators;
    delete this._playableStreams;

    delete this._eventEmitter;
    delete this._video;
  }
}
