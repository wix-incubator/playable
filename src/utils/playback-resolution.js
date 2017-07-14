export function resolvePlayableStreams(mediaStreams, playableStreamCreators, eventEmitter) {
    const playableStreams = [];
    const groupedStreams = groupStreamsByMediaType(mediaStreams);
    Object.keys(groupedStreams).forEach(mediaType => {
        const mediaStreams = groupedStreams[mediaType];
        for (let i = 0; i < playableStreamCreators.length; i += 1) {
            const playableStreamCreator = playableStreamCreators[i];
            if (playableStreamCreator.canPlay(mediaType)) {
                playableStreams.push(new playableStreamCreator(mediaStreams, eventEmitter));
                break;
            }
        }
    });
    playableStreams.sort(
      (firstStream, secondStream) =>
        secondStream.getMediaStreamDeliveryType() - firstStream.getMediaStreamDeliveryType()
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
