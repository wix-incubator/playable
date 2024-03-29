import {
  IPlaybackAdapterClass,
  IAdapterDebugInfo,
} from './output/native/adapters/types';
import { EngineState, MediaStreamType } from '../../constants';
import { IEventEmitter } from '../event-emitter/types';
import { IPlayerConfig } from '../../core/config';

enum PreloadType {
  NONE = 'none',
  METADATA = 'metadata',
  AUTO = 'auto',
}

enum CrossOriginValue {
  ANONYMUS = 'anonymous',
  CREDENTIALS = 'use-credentials',
}

interface IPlayableSource {
  url: string;
  type?: MediaStreamType;
  mimeType?: string;
}

interface IParsedPlayableSource {
  url: string;
  type: MediaStreamType;
}

type PlayableMediaSource =
  | string
  | IPlayableSource
  | Array<string | IPlayableSource>;

interface IPlaybackEngine {
  getElement(): HTMLVideoElement | null;

  isDynamicContent: boolean;
  isDynamicContentEnded: boolean;
  isSeekAvailable: boolean;
  isMetadataLoaded: boolean;
  isPreloadActive: boolean;
  isAutoPlayActive: boolean;
  isSyncWithLive: boolean;
  isPaused: boolean;
  isEnded: boolean;

  setSrc(src: PlayableMediaSource, callback?: Function): void;
  getSrc(): PlayableMediaSource;

  play(): void;
  pause(): void;
  reset(): void;
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

  setPreload(preload: PreloadType): void;
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

  changeOutput(chromecastOutput: IVideoOutput, callback?: Function): void;
  resetOutput(): void;
}

interface IEngineDebugInfo {
  output: string;
  currentTime: number;
  duration: number;
}

/**
 * @property viewDimensions - Current size of view port provided by engine (right now - actual size of video tag)
 * @property currentTime - Current time of playback
 * @property duration - Duration of current video
 * @property loadingStateTimestamps - Object with time spend for different initial phases
 * @property output - Type of the output (html5video, chromecast etc.);
 */
interface INativeDebugInfo extends IAdapterDebugInfo {
  viewDimensions: Object;
  currentTime: number;
  duration: number;
  loadingStateTimestamps: Object;
  output: 'html5video';
}

interface IPlaybackEngineDependencies {
  eventEmitter: IEventEmitter;
  config: IPlayerConfig;
  availablePlaybackAdapters: IPlaybackAdapterClass[];
  nativeOutput: IVideoOutput;
}

interface ILiveStateEngineDependencies {
  eventEmitter: IEventEmitter;
  engine: IPlaybackEngine;
}

interface IVideoOutput {
  currentState: EngineState;
  play: () => void;
  pause: () => void;
  syncWithLive: () => void;

  getDebugInfo: () => IEngineDebugInfo;

  getElement: () => HTMLVideoElement | null;

  setPlaybackRate: (rate: number) => void;
  setPreload: (preload: PreloadType) => void;
  setAutoplay: (isAutoplay: boolean) => void;
  setVolume: (volume: number) => void;
  setMute: (mute: boolean) => void;
  setCurrentTime: (time: number) => void;
  setInline: (isPlaysinline: boolean) => void;
  setCrossOrigin: (crossOrigin?: CrossOriginValue) => void;
  setLoop: (mute: boolean) => void;
  setSrc: (src?: PlayableMediaSource, callback?: Function) => void;

  isPaused: boolean;
  isMuted: boolean;
  isEnded: boolean;
  isAutoplay: boolean;
  isLoop: boolean;
  isDynamicContent: boolean;
  isDynamicContentEnded: boolean;
  isMetadataLoaded: boolean;
  isSeekAvailable: boolean;
  isSyncWithLive: boolean;
  isAutoPlayActive: boolean;
  isPreloadActive: boolean;

  preload: PreloadType;

  volume: number;
  currentTime: number;
  duration: number;
  autoplay: boolean;
  playbackRate: number;
  videoWidth?: number;
  videoHeight?: number;
  buffered: TimeRanges;
  isInline: boolean;
  crossOrigin: CrossOriginValue;
  src: PlayableMediaSource;
}

interface IPlaybackEngineAPI {
  setSrc?(src: PlayableMediaSource, callback?: Function): void;
  getSrc?(): PlayableMediaSource;

  play?(): void;
  pause?(): void;
  togglePlayback?(): void;
  resetPlayback?(): void;
  isPaused?: boolean;
  isEnded?: boolean;

  syncWithLive?(): void;

  seekTo?(time: number): void;
  seekForward?(sec: number): void;
  seekBackward?(sec: number): void;

  setVolume?(volume: number): void;
  getVolume?(): number;
  increaseVolume?(value: number): void;
  decreaseVolume?(value: number): void;
  mute?(): void;
  unmute?(): void;
  isMuted?: boolean;

  setAutoplay?(isAutoplay: boolean): void;
  getAutoplay?(): boolean;

  setLoop?(isLoop: boolean): void;
  getLoop?(): boolean;

  setPlaybackRate?(rate: number): void;
  getPlaybackRate?(): number;

  setPreload?(preload: PreloadType): void;
  getPreload?(): string;

  setCrossOrigin?(crossOrigin?: CrossOriginValue): void;
  getCrossOrigin?(): CrossOriginValue;

  getCurrentTime?(): number;
  getDuration?(): number;

  getVideoWidth?(): number;
  getVideoHeight?(): number;

  setPlaysinline?(isPlaysinline: boolean): void;
  getPlaysinline?(): boolean;

  getPlaybackState?(): EngineState;

  getDebugInfo?(): IEngineDebugInfo;
}

export {
  IPlaybackEngineAPI,
  ILiveStateEngineDependencies,
  IPlaybackEngineDependencies,
  IPlaybackEngine,
  IEngineDebugInfo,
  INativeDebugInfo,
  IPlayableSource,
  IParsedPlayableSource,
  IVideoOutput,
  PlayableMediaSource,
  PreloadType,
  CrossOriginValue,
};
