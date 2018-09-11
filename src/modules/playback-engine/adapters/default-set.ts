import getNativeAdapterCreator from './native';
import { IPlaybackAdapterClass } from './types';
import {
  MediaStreamTypes,
  MediaStreamDeliveryPriority,
} from '../../../constants';

const defaultPlaybackAdapters: IPlaybackAdapterClass[] = [
  getNativeAdapterCreator(
    MediaStreamTypes.HLS,
    MediaStreamDeliveryPriority.NATIVE_ADAPTIVE,
  ),
  getNativeAdapterCreator(
    MediaStreamTypes.DASH,
    MediaStreamDeliveryPriority.NATIVE_ADAPTIVE,
  ),
  getNativeAdapterCreator(
    MediaStreamTypes.MP4,
    MediaStreamDeliveryPriority.NATIVE_PROGRESSIVE,
  ),
  getNativeAdapterCreator(
    MediaStreamTypes.WEBM,
    MediaStreamDeliveryPriority.NATIVE_PROGRESSIVE,
  ), // Native WebM (Chrome, Firefox)
  getNativeAdapterCreator(
    MediaStreamTypes.OGG,
    MediaStreamDeliveryPriority.NATIVE_PROGRESSIVE,
  ), // Native WebM (Chrome, Firefox)
  getNativeAdapterCreator(
    MediaStreamTypes.MOV,
    MediaStreamDeliveryPriority.NATIVE_PROGRESSIVE,
  ), // Native QuickTime .mov (Safari)
  getNativeAdapterCreator(
    MediaStreamTypes.MKV,
    MediaStreamDeliveryPriority.NATIVE_PROGRESSIVE,
  ),
];

export default defaultPlaybackAdapters;
