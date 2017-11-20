import { MEDIA_STREAM_TYPES } from '../../constants/media-stream';

const extensionsMap = Object.create(null);
extensionsMap.mp4 = MEDIA_STREAM_TYPES.MP4;
extensionsMap.webm = MEDIA_STREAM_TYPES.WEBM;
extensionsMap.m3u8 = MEDIA_STREAM_TYPES.HLS;
extensionsMap.mpd = MEDIA_STREAM_TYPES.DASH;

const anchorElement = document.createElement('a');

export function detectStreamType(url) {
  anchorElement.href = url;
  const streamType = extensionsMap[getExtFromPath(anchorElement.pathname)];

  if (streamType) {
    return streamType;
  }

  throw new Error(
    `Vidi: cannot auto-detect url '${
      url
    }'. Please specify type manually using the MediaStream interface.`,
  );
}

export function getExtFromPath(path) {
  return path.split('.').pop();
}
