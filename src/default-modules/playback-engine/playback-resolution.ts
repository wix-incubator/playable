export function resolveAdapters(mediaStreams, availableAdapters) {
  const playableAdapters = [];

  const groupedStreams = groupStreamsByMediaType(mediaStreams);
  const groupedStreamKeys = Object.keys(groupedStreams);

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
      secondAdapter.mediaStreamDeliveryType - firstAdapter.mediaStreamDeliveryType,
  );

  return playableAdapters;
}

function groupStreamsByMediaType(mediaStreams) {
    const typeMap = {};
    mediaStreams.forEach(mediaStream => {
        if (!Array.isArray(typeMap[mediaStream.type])) {
            typeMap[mediaStream.type] = [];
        }
        typeMap[mediaStream.type].push(mediaStream);
    });
    return typeMap;
}
