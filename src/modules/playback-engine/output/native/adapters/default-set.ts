import getNativeAdapterCreator from './native';
import { IPlaybackAdapterClass } from './types';
import {
  MediaStreamType,
  MediaStreamDeliveryPriority,
} from '../../../../../constants';

const defaultPlaybackAdapters: IPlaybackAdapterClass[] = [
  getNativeAdapterCreator(
    MediaStreamType.HLS,
    MediaStreamDeliveryPriority.NATIVE_ADAPTIVE,
  ),
  getNativeAdapterCreator(
    MediaStreamType.DASH,
    MediaStreamDeliveryPriority.NATIVE_ADAPTIVE,
  ),
  getNativeAdapterCreator(
    MediaStreamType.MP4,
    MediaStreamDeliveryPriority.NATIVE_PROGRESSIVE,
  ),
  getNativeAdapterCreator(
    MediaStreamType.WEBM,
    MediaStreamDeliveryPriority.NATIVE_PROGRESSIVE,
  ), // Native WebM (Chrome, Firefox)
  getNativeAdapterCreator(
    MediaStreamType.OGG,
    MediaStreamDeliveryPriority.NATIVE_PROGRESSIVE,
  ), // Native WebM (Chrome, Firefox)
  getNativeAdapterCreator(
    MediaStreamType.MOV,
    MediaStreamDeliveryPriority.NATIVE_PROGRESSIVE,
  ), // Native QuickTime .mov (Safari)
  getNativeAdapterCreator(
    MediaStreamType.MKV,
    MediaStreamDeliveryPriority.NATIVE_PROGRESSIVE,
  ),
];

export default defaultPlaybackAdapters;
