enum MediaStreamType {
  MP4 = 'MP4',
  WEBM = 'WEBM',
  HLS = 'HLS',
  DASH = 'DASH',
  OGG = 'OGG',
  MOV = 'MOV',
  MKV = 'MKV',
}

const MimeToStreamTypeMap: { [mimeType: string]: MediaStreamType } = {
  'application/x-mpegURL': MediaStreamType.HLS,
  'application/vnd.apple.mpegURL': MediaStreamType.HLS,
  'application/dash+xml': MediaStreamType.DASH,
  'video/mp4': MediaStreamType.MP4,
  'video/x-mp4': MediaStreamType.MP4,
  'x-video/mp4': MediaStreamType.MP4,
  'video/webm': MediaStreamType.WEBM,
  'video/ogg': MediaStreamType.OGG,
  'video/quicktime': MediaStreamType.MOV,
  'video/x-matroska': MediaStreamType.MKV,
};

enum MediaStreamDeliveryPriority {
  NATIVE_PROGRESSIVE,
  ADAPTIVE_VIA_MSE,
  NATIVE_ADAPTIVE,
  FORCED,
}

export { MediaStreamType, MimeToStreamTypeMap, MediaStreamDeliveryPriority };
