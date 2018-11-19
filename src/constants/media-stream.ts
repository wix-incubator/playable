enum MediaStreamTypes {
  MP4 = 'MP4',
  WEBM = 'WEBM',
  HLS = 'HLS',
  DASH = 'DASH',
  OGG = 'OGG',
  MOV = 'MOV',
  MKV = 'MKV',
}

const MimeToStreamTypeMap: { [mimeType: string]: MediaStreamTypes } = {
  'application/x-mpegURL': MediaStreamTypes.HLS,
  'application/vnd.apple.mpegURL': MediaStreamTypes.HLS,
  'application/dash+xml': MediaStreamTypes.DASH,
  'video/mp4': MediaStreamTypes.MP4,
  'video/x-mp4': MediaStreamTypes.MP4,
  'x-video/mp4': MediaStreamTypes.MP4,
  'video/webm': MediaStreamTypes.WEBM,
  'video/ogg': MediaStreamTypes.OGG,
  'video/quicktime': MediaStreamTypes.MOV,
  'video/x-matroska': MediaStreamTypes.MKV,
};

enum MediaStreamDeliveryPriority {
  NATIVE_PROGRESSIVE,
  ADAPTIVE_VIA_MSE,
  NATIVE_ADAPTIVE,
  FORCED,
}

export { MediaStreamTypes, MimeToStreamTypeMap, MediaStreamDeliveryPriority };
