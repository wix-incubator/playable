import { MediaStreamType } from '../../../constants';

const extensionsMap = Object.create(null);
extensionsMap.mp4 = MediaStreamType.MP4;
extensionsMap.webm = MediaStreamType.WEBM;
extensionsMap.m3u8 = MediaStreamType.HLS;
extensionsMap.mpd = MediaStreamType.DASH;
extensionsMap.ogg = MediaStreamType.OGG;
extensionsMap.mkv = MediaStreamType.MKV;
extensionsMap.mov = MediaStreamType.MOV;

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
