enum PreloadTypes {
  NONE = 'none',
  METADATA = 'metadata',
  AUTO = 'auto',
}

interface IMediaSource {
  url: string;
  type: string;
}

type MediaSource = string | IMediaSource | Array<string | IMediaSource>;

/**
 * @property type - Name of current attached stream.
 * @property viewDimensions - Current size of view port provided by engine (right now - actual size of video tag)
 * @property url - Url of current source
 * @property currentTime - Current time of playback
 * @property duration - Duration of current video
 * @property loadingStateTimestamps - Object with time spend for different initial phases
 * @property bitrates - List of all available bitrates. Internal structure different for different type of streams
 * @property currentBitrate - Current bitrate. Internal structure different for different type of streams
 * @property bwEstimate - Estimation of bandwidth
 * @property overallBufferLength - Overall length of buffer
 * @property nearestBufferSegInfo - Object with start and end for current buffer segment
 */
interface IDebugInfo {
  type: 'HLS' | 'DASH' | 'MP4' | 'WEBM';
  viewDimensions: Object;
  url: string;
  currentTime: number;
  duration: number;
  loadingStateTimestamps: Object;
  bitrates: string[];
  currentBitrate: string;
  bwEstimate: number;
  overallBufferLength: number;
  nearestBufferSegInfo: Object;
}

export { IDebugInfo, IMediaSource, MediaSource, PreloadTypes };
