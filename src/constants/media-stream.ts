enum MediaStreamTypes {
  MP4 = 'MP4',
  WEBM = 'WEBM',
  HLS = 'HLS',
  DASH = 'DASH',
  OGG = 'OGG',
  MOV = 'MOV',
  MKV = 'MKV',
}

enum MediaStreamDeliveryPriority {
  NATIVE_PROGRESSIVE,
  ADAPTIVE_VIA_MSE,
  NATIVE_ADAPTIVE,
  FORCED,
}

export { MediaStreamTypes, MediaStreamDeliveryPriority };
