import { IPlaybackAdapter } from '../adapters/types';
import { MediaStreamTypes } from '../../../constants';
import { IMediaSource } from '../types';

export function resolveAdapters(
  mediaStreams: IMediaSource[],
  availableAdapters: IPlaybackAdapter[],
): IPlaybackAdapter[] {
  const playableAdapters: IPlaybackAdapter[] = [];

  const groupedStreams = groupStreamsByMediaType(mediaStreams);
  const groupedStreamKeys = Object.keys(groupedStreams) as MediaStreamTypes[];

  availableAdapters.forEach(adapter => {
    for (let i = 0; i < groupedStreamKeys.length; i += 1) {
      const mediaType = groupedStreamKeys[i];
      const mediaStreams = groupedStreams[mediaType];

      if (adapter.canPlay(mediaType)) {
        adapter.setMediaStreams(mediaStreams);
        playableAdapters.push(adapter);
        break;
      }
    }
  });

  playableAdapters.sort(
    (firstAdapter, secondAdapter) =>
      secondAdapter.mediaStreamDeliveryPriority -
      firstAdapter.mediaStreamDeliveryPriority,
  );

  return playableAdapters;
}

function groupStreamsByMediaType(mediaStreams: IMediaSource[]) {
  const typeMap: { [type: string]: IMediaSource[] } = {};
  mediaStreams.forEach((mediaStream: IMediaSource) => {
    if (!mediaStream.type) {
      return;
    }

    if (!Array.isArray(typeMap[mediaStream.type])) {
      typeMap[mediaStream.type] = [];
    }
    typeMap[mediaStream.type].push(mediaStream);
  });

  return typeMap;
}
