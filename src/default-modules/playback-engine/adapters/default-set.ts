import getNativeAdapterCreator from './native';

import {
  MEDIA_STREAM_TYPES,
  MediaStreamDeliveryType,
} from '../../../constants';

const defaultPlaybackAdapters = [
  getNativeAdapterCreator(
    MEDIA_STREAM_TYPES.DASH,
    MediaStreamDeliveryType.NATIVE_ADAPTIVE,
  ),
  getNativeAdapterCreator(
    MEDIA_STREAM_TYPES.HLS,
    MediaStreamDeliveryType.NATIVE_ADAPTIVE,
  ),
  getNativeAdapterCreator(
    MEDIA_STREAM_TYPES.MP4,
    MediaStreamDeliveryType.NATIVE_PROGRESSIVE,
  ),
  getNativeAdapterCreator(
    MEDIA_STREAM_TYPES.WEBM,
    MediaStreamDeliveryType.NATIVE_PROGRESSIVE,
  ), // Native WebM (Chrome, Firefox)
];

export default defaultPlaybackAdapters;
