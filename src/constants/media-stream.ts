enum MediaStreamTypes {
  MP4 = 'MP4',
  WEBM = 'WEBM',
  HLS = 'HLS',
  DASH = 'DASH',
}

enum MediaStreamDeliveryType {
  NATIVE_PROGRESSIVE,
  ADAPTIVE_VIA_MSE,
  NATIVE_ADAPTIVE,
  FORCED,
}

export { MediaStreamTypes, MediaStreamDeliveryType };
