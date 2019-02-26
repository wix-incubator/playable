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
  type?: MediaStreamTypes;
  mimeType?: string;
}

interface IParsedMediaSource {
  url: string;
  type: MediaStreamTypes;
}

type MediaSource = string | IMediaSource | Array<string | IMediaSource>;
type CrossOriginValue = 'anonymous' | 'use-credentials';

interface IPlaybackEngine {
  getElement(): HTMLVideoElement | null;

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

interface IDimensions {
  width?: number;
  height?: number;
}

interface IVideoOutput {
  play: () => Promise<void>;
  pause: () => void;
  destroy: () => void;

  getElement: () => HTMLVideoElement | null;
  getViewDimensions: () => IDimensions;

  on: (event: string, cb: (event?: Event) => void) => void;
  off: (event: string, cb: (event?: Event) => void) => void;

  setPlaybackRate: (rate: number) => void;
  setPreload: (preload: 'auto' | 'metadata' | 'none') => void;
  setAutoplay: (isAutoplay: boolean) => void;
  setVolume: (volume: number) => void;
  setMute: (mute: boolean) => void;
  setCurrentTime: (time: number) => void;
  setInline: (isPlaysinline: boolean) => void;
  setCrossOrigin: (crossOrigin?: CrossOriginValue) => void;
  setLoop: (mute: boolean) => void;
  setSrc: (src: string) => void;

  isPaused: boolean;
  isMuted: boolean;
  isEnded: boolean;
  isAutoplay: boolean;
  isLoop: boolean;

  preload: 'auto' | 'metadata' | 'none';

  volume: number;
  currentTime: number;
  duration: number;
  length: number;
  autoplay: boolean;
  playbackRate: number;
  videoWidth?: number;
  videoHeight?: number;
  buffered: TimeRanges;
  isInline: boolean;
  crossOrigin: CrossOriginValue;
  error: MediaError;
  src: string;
}

export {
  ILiveStateEngineDependencies,
  IPlaybackEngineDependencies,
  IPlaybackEngine,
  IEngineDebugInfo,
  IMediaSource,
  IParsedMediaSource,
  IVideoOutput,
  MediaSource,
  PreloadTypes,
  CrossOriginValue,
};
