import { MediaStreamTypes } from '../../constants';

const extensionsMap = Object.create(null);
extensionsMap.mp4 = MediaStreamTypes.MP4;
extensionsMap.webm = MediaStreamTypes.WEBM;
extensionsMap.m3u8 = MediaStreamTypes.HLS;
extensionsMap.mpd = MediaStreamTypes.DASH;

const anchorElement = document.createElement('a');

export function getStreamType(url) {
  anchorElement.href = url;
  const streamType = extensionsMap[getExtFromPath(anchorElement.pathname)];

  return streamType || false;
}

export function getExtFromPath(path) {
  return path.split('.').pop();
}
