export function resolvePlayableStreams(mediaStreams, playableStreamCreators, eventEmitter) {
  const playableStreams = [];

  const groupedStreams = groupStreamsByMediaType(mediaStreams);
  const groupedStreamKeys = Object.keys(groupedStreams);

  playableStreamCreators.forEach(playableStreamCreator => {
    for (let i = 0; i < groupedStreamKeys.length; i += 1) {
      const mediaType = groupedStreamKeys[i];
      const mediaStreams = groupedStreams[mediaType];
      if (playableStreamCreator.canPlay(mediaType)) {
        playableStreams.push(new playableStreamCreator(mediaStreams, eventEmitter));
        break;
      }
    }
  });

  playableStreams.sort(
    (firstStream, secondStream) =>
      secondStream.mediaStreamDeliveryType - firstStream.mediaStreamDeliveryType
  );

  return playableStreams;
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
