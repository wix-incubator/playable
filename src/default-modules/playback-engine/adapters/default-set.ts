import getNativeAdapterCreator from './native';

import { MEDIA_STREAM_TYPES, MEDIA_STREAM_DELIVERY_TYPE } from '../../../constants/index';


const defaultPlaybackAdapters = [
  getNativeAdapterCreator(MEDIA_STREAM_TYPES.DASH, MEDIA_STREAM_DELIVERY_TYPE.NATIVE_ADAPTIVE),
  getNativeAdapterCreator(MEDIA_STREAM_TYPES.HLS, MEDIA_STREAM_DELIVERY_TYPE.NATIVE_ADAPTIVE),
  getNativeAdapterCreator(MEDIA_STREAM_TYPES.MP4, MEDIA_STREAM_DELIVERY_TYPE.NATIVE_PROGRESSIVE),
  getNativeAdapterCreator(MEDIA_STREAM_TYPES.WEBM, MEDIA_STREAM_DELIVERY_TYPE.NATIVE_PROGRESSIVE), // Native WebM (Chrome, Firefox)
];

export default defaultPlaybackAdapters;
