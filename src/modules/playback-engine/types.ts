import {
  IPlaybackAdapter,
  IPlaybackAdapterClass,
  IAdapterDebugInfo,
} from './adapters/types';
import { EngineState, MediaStreamTypes } from '../../constants';
import { IEventEmitter } from '../event-emitter/types';
import { IPlayerConfig } from '../../core/config';

enum PreloadTypes {
  NONE = 'none',
  METADATA = 'metadata',
  AUTO = 'auto',
}

interface IMediaSource {
  url: string;
  type: MediaStreamTypes;
}

type MediaSource = string | IMediaSource | Array<string | IMediaSource>;
type CrossOriginValue = 'anonymous' | 'use-credentials';

interface IPlaybackEngine {
  getElement(): HTMLVideoElement;

  isDynamicContent: boolean;
  isDynamicContentEnded: boolean;
  isSeekAvailable: boolean;
  isMetadataLoaded: boolean;
  isPreloadAvailable: boolean;
  isAutoPlayAvailable: boolean;
  isSyncWithLive: boolean;
  isPaused: boolean;
  isEnded: boolean;

  attachedAdapter: IPlaybackAdapter;

  setSrc(src: MediaSource): void;
  getSrc(): MediaSource;

  play(): void;
  pause(): void;
  togglePlayback(): void;
  syncWithLive(): void;

  seekTo(time: number): void;
  seekForward(sec: number): void;
  seekBackward(sec: number): void;

  setVolume(volume: number): void;
  getVolume(): number;
  increaseVolume(value: number): void;
  decreaseVolume(value: number): void;
  setMute(isMuted: boolean): void;
  isMuted: boolean;

  setAutoplay(isAutoplay: boolean): void;
  getAutoplay(): boolean;

  setLoop(isLoop: boolean): void;
  getLoop(): boolean;

  setPlaybackRate(rate: number): void;
  getPlaybackRate(): number;

  setPreload(preload: PreloadTypes): void;
  getPreload(): string;

  setCrossOrigin(crossOrigin?: CrossOriginValue): void;
  getCrossOrigin(): CrossOriginValue;

  getCurrentTime(): number;
  getDuration(): number;

  getVideoWidth(): number;
  getVideoHeight(): number;

  getBuffered(): TimeRanges;

  setPlaysinline(isPlaysinline: boolean): void;
  getPlaysinline(): boolean;

  getCurrentState(): EngineState;
  getDebugInfo(): IEngineDebugInfo;

  destroy(): void;
}

/**
 * @property viewDimensions - Current size of view port provided by engine (right now - actual size of video tag)
 * @property currentTime - Current time of playback
 * @property duration - Duration of current video
 * @property loadingStateTimestamps - Object with time spend for different initial phases
 */
interface IEngineDebugInfo extends IAdapterDebugInfo {
  viewDimensions: Object;
  currentTime: number;
  duration: number;
  loadingStateTimestamps: Object;
}

interface IPlaybackEngineDependencies {
  eventEmitter: IEventEmitter;
  config: IPlayerConfig;
  availablePlaybackAdapters: IPlaybackAdapterClass[];
}

interface ILiveStateEngineDependencies {
  eventEmitter: IEventEmitter;
  engine: IPlaybackEngine;
}

export {
  ILiveStateEngineDependencies,
  IPlaybackEngineDependencies,
  IPlaybackEngine,
  IEngineDebugInfo,
  IMediaSource,
  MediaSource,
  PreloadTypes,
  CrossOriginValue,
};
