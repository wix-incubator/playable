import { IPlaybackAdapter } from '../output/native/adapters/types';
import { MediaStreamType, MimeToStreamTypeMap } from '../../../constants';
import { IPlayableSource, IParsedPlayableSource } from '../types';

export function resolveAdapters(
  mediaStreams: IPlayableSource[],
  availableAdapters: IPlaybackAdapter[],
): IPlaybackAdapter[] {
  const playableAdapters: IPlaybackAdapter[] = [];

  const groupedStreams = groupStreamsByMediaType(mediaStreams);
  const groupedStreamKeys = Object.keys(groupedStreams) as MediaStreamType[];

  availableAdapters.forEach(adapter => {
    for (let i = 0; i < groupedStreamKeys.length; i += 1) {
      const mediaType = groupedStreamKeys[i];

      if (adapter.canPlay(mediaType)) {
        adapter.setMediaStreams(groupedStreams[mediaType]);
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

function groupStreamsByMediaType(mediaStreams: IPlayableSource[]) {
  const typeMap: { [type: string]: IParsedPlayableSource[] } = {};
  mediaStreams.forEach((mediaStream: IPlayableSource) => {
    const type: MediaStreamType =
      mediaStream.type || MimeToStreamTypeMap[mediaStream.mimeType];

    if (!type) {
      return;
    }

    if (!Array.isArray(typeMap[type])) {
      typeMap[type] = [];
    }

    typeMap[type].push({
      url: mediaStream.url,
      type,
    });
  });

  return typeMap;
}
