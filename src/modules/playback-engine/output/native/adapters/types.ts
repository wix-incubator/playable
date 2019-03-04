import {
  MediaStreamType,
  MediaStreamDeliveryPriority,
} from '../../../../../constants';
import { IEventEmitter } from '../../../../event-emitter/types';

interface IPlaybackAdapter {
  canPlay(mediaType: MediaStreamType): boolean;
  setMediaStreams(mediaStreams: any): void;

  attach(videoElement: HTMLVideoElement): void;
  detach(): void;

  mediaStreamDeliveryPriority: MediaStreamDeliveryPriority;
  syncWithLiveTime: number;
  isDynamicContent: boolean;
  isDynamicContentEnded: boolean;
  isSyncWithLive: boolean;

  isSeekAvailable: boolean;

  debugInfo: IAdapterDebugInfo;
}

interface IPlaybackAdapterClass {
  isSupported(): boolean;
  new (eventEmitter: IEventEmitter): IPlaybackAdapter;
}

/**
 * @property type - Name of current attached stream.
 * @property url - Url of current source
 * @property bitrates - List of all available bitrates. Internal structure different for different type of streams
 * @property currentBitrate - Current bitrate. Internal structure different for different type of streams
 * @property bwEstimate - Estimation of bandwidth
 * @property overallBufferLength - Overall length of buffer
 * @property nearestBufferSegInfo - Object with start and end for current buffer segment
 * @property deliveryPriority - Priority of current adapter
 */
interface IAdapterDebugInfo {
  type: MediaStreamType;
  url: string;
  bitrates: string[];
  currentBitrate: string;
  bwEstimate: number;
  overallBufferLength: number;
  nearestBufferSegInfo: Object;
  deliveryPriority: MediaStreamDeliveryPriority;
}

export { IAdapterDebugInfo, IPlaybackAdapter, IPlaybackAdapterClass };
