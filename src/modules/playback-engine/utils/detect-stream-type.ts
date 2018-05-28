import { MediaStreamTypes } from '../../../constants';

const extensionsMap = Object.create(null);
extensionsMap.mp4 = MediaStreamTypes.MP4;
extensionsMap.webm = MediaStreamTypes.WEBM;
extensionsMap.m3u8 = MediaStreamTypes.HLS;
extensionsMap.mpd = MediaStreamTypes.DASH;
extensionsMap.ogg = MediaStreamTypes.OGG;
extensionsMap.mkv = MediaStreamTypes.MKV;
extensionsMap.mov = MediaStreamTypes.MOV;

export function getStreamType(url: string) {
  const anchorElement = document.createElement('a');
  anchorElement.href = url;
  const streamType = extensionsMap[getExtFromPath(anchorElement.pathname)];

  return streamType || false;
}

export function getExtFromPath(path: string) {
  return path
    .split('.')
    .pop()
    .toLowerCase();
}
