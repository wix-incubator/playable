import getNativeAdapterCreator from './native';

import { MediaStreamTypes, MediaStreamDeliveryType } from '../../../constants';

const defaultPlaybackAdapters = [
  getNativeAdapterCreator(
    MediaStreamTypes.DASH,
    MediaStreamDeliveryType.NATIVE_ADAPTIVE,
  ),
  getNativeAdapterCreator(
    MediaStreamTypes.HLS,
    MediaStreamDeliveryType.NATIVE_ADAPTIVE,
  ),
  getNativeAdapterCreator(
    MediaStreamTypes.MP4,
    MediaStreamDeliveryType.NATIVE_PROGRESSIVE,
  ),
  getNativeAdapterCreator(
    MediaStreamTypes.WEBM,
    MediaStreamDeliveryType.NATIVE_PROGRESSIVE,
  ), // Native WebM (Chrome, Firefox)
];

export default defaultPlaybackAdapters;
