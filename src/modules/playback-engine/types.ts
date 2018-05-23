import { IPlaybackAdapter } from './adapters/types';
import { EngineState, MediaStreamDeliveryPriority } from '../../constants';

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
 * @property deliveryPriority - Priority of current adapter
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
  deliveryPriority: MediaStreamDeliveryPriority;
}

interface IPlaybackEngine {
  getNode(): HTMLVideoElement;

  isDynamicContent: boolean;
  isDynamicContentEnded: boolean;
  isSeekAvailable: boolean;
  isMetadataLoaded: boolean;
  isPreloadAvailable: boolean;
  isAutoPlayAvailable: boolean;
  isSyncWithLive: boolean;
  isVideoPaused: boolean;
  isVideoEnded: boolean;

  attachedAdapter: IPlaybackAdapter;

  setSrc(src: MediaSource): void;
  getSrc(): MediaSource;

  play(): void;
  pause(): void;
  togglePlayback(): void;
  syncWithLive(): void;

  goForward(sec: number): void;
  goBackward(sec: number): void;

  setVolume(volume: number): void;
  getVolume(): number;
  increaseVolume(value: number): void;
  decreaseVolume(value: number): void;
  setMute(isMuted: boolean): void;
  getMute(): boolean;

  setAutoPlay(isAutoPlay: boolean): void;
  getAutoPlay(): boolean;

  setLoop(isLoop: boolean): void;
  getLoop(): boolean;

  setPlaybackRate(rate: number): void;
  getPlaybackRate(): number;

  setPreload(preload: PreloadTypes): void;
  getPreload(): string;

  getCurrentTime(): number;
  setCurrentTime(time: number): void;
  getDurationTime(): number;

  getVideoWidth(): number;
  getVideoHeight(): number;

  getBuffered(): TimeRanges;

  setPlayInline(isPlayInline: boolean): void;
  getPlayInline(): boolean;

  getCurrentState(): EngineState;
  getDebugInfo(): IDebugInfo;

  destroy(): void;
}

export { IPlaybackEngine, IDebugInfo, IMediaSource, MediaSource, PreloadTypes };
