import {
  MediaStreamTypes,
  MediaStreamDeliveryPriority,
} from '../../../constants';

interface IPlaybackAdapter {
  canPlay(mediaType: MediaStreamTypes): boolean;
  setMediaStreams(mediaStreams: any): void;

  attach(videoElement: HTMLVideoElement): void;
  detach(): void;

  mediaStreamDeliveryPriority: MediaStreamDeliveryPriority;
  syncWithLiveTime: number;
  isDynamicContent: boolean;
  isDynamicContentEnded: boolean;
  isSyncWithLive: boolean;

  isSeekAvailable: boolean;

  debugInfo: any;

  // TODO: describe adapter interface
}

export { IPlaybackAdapter };
