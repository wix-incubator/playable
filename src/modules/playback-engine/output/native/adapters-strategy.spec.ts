import * as sinon from 'sinon';
import EventEmitter from '../../../../modules/event-emitter/event-emitter';

import getNativeAdapterCreator from './adapters/native';
import AdapterStrategy from './adapters-strategy';
import {
  MediaStreamDeliveryPriority,
  MediaStreamType,
} from '../../../../constants';

describe('AdapterStrategy', () => {
  const video = document.createElement('video');
  let strategy: any;
  let eventEmitter: any;
  let playbackAdapters;

  beforeEach(() => {
    eventEmitter = new EventEmitter();
    // @ts-ignore

    strategy = new AdapterStrategy(eventEmitter, video);
  });

  test('should do nothing if src not passed', () => {
    strategy.connectAdapter();
    expect(strategy.attachedAdapter).toBeNull();
  });

  test('should generate list of available stream creator in env on construction', () => {
    const availableStream = getNativeAdapterCreator(
      MediaStreamType.HLS,
      MediaStreamDeliveryPriority.NATIVE_ADAPTIVE,
    );
    const unavailableStream = getNativeAdapterCreator(
      MediaStreamType.DASH,
      MediaStreamDeliveryPriority.NATIVE_ADAPTIVE,
    );
    availableStream.isSupported = () => true;
    unavailableStream.isSupported = () => false;

    const newStrategy: any = new AdapterStrategy(eventEmitter, video, [
      availableStream,
      unavailableStream,
    ]);
    expect(newStrategy._availableAdapters.length).toBe(1);
    expect(newStrategy._availableAdapters[0].constructor).toBe(availableStream);
  });

  test('should choose proper media stream for proper format', () => {
    playbackAdapters = [
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
        MediaStreamDeliveryPriority.NATIVE_ADAPTIVE,
      ),
    ];

    playbackAdapters.forEach(adapter =>
      strategy._availableAdapters.push(new adapter(strategy._eventEmitter)),
    );

    strategy.connectAdapter('http://www.dash.com/dash.mpd');
    expect(strategy.attachedAdapter.mediaStreamType).toBe(MediaStreamType.DASH);

    strategy.connectAdapter('http://www.hls.com/hls.m3u8');
    expect(strategy.attachedAdapter.mediaStreamType).toBe(MediaStreamType.HLS);

    strategy.connectAdapter({
      url: 'http://www.mp4.com/mp4.mp4',
      type: MediaStreamType.MP4,
    });
  });

  test('should choose proper media stream based on priority', () => {
    playbackAdapters = [
      getNativeAdapterCreator(
        MediaStreamType.DASH,
        MediaStreamDeliveryPriority.NATIVE_PROGRESSIVE,
      ),
      getNativeAdapterCreator(
        MediaStreamType.DASH,
        MediaStreamDeliveryPriority.NATIVE_ADAPTIVE,
      ),
    ];

    playbackAdapters.forEach(adapter =>
      strategy._availableAdapters.push(new adapter(strategy._eventEmitter)),
    );

    strategy.connectAdapter('http://www.dash.com/dash.mpd');
    expect(strategy.attachedAdapter.mediaStreamDeliveryPriority).toBe(
      MediaStreamDeliveryPriority.NATIVE_ADAPTIVE,
    );

    playbackAdapters = [
      getNativeAdapterCreator(
        MediaStreamType.HLS,
        MediaStreamDeliveryPriority.NATIVE_ADAPTIVE,
      ),
      getNativeAdapterCreator(
        MediaStreamType.HLS,
        MediaStreamDeliveryPriority.NATIVE_PROGRESSIVE,
      ),
    ];

    playbackAdapters.forEach(adapter =>
      strategy._availableAdapters.push(new adapter(strategy._eventEmitter)),
    );

    strategy.connectAdapter('http://www.hls.com/hls.m3u8');
    expect(strategy.attachedAdapter.mediaStreamDeliveryPriority).toBe(
      MediaStreamDeliveryPriority.NATIVE_ADAPTIVE,
    );
  });

  test('should detach current stream on changing of stream and destroy', () => {
    playbackAdapters = [
      getNativeAdapterCreator(
        MediaStreamType.DASH,
        MediaStreamDeliveryPriority.NATIVE_ADAPTIVE,
      ),
    ];

    playbackAdapters.forEach(adapter =>
      strategy._availableAdapters.push(new adapter(strategy._eventEmitter)),
    );

    strategy.connectAdapter('http://www.dash.com/dash.mpd');

    const attachedAdapter = strategy.attachedAdapter;
    sinon.spy(attachedAdapter, 'detach');
    strategy.connectAdapter('http://www.dash.com/dash2.mpd');
    expect(attachedAdapter.detach.called).toBe(true);
  });

  test('should detach current stream on destroy', () => {
    playbackAdapters = [
      getNativeAdapterCreator(
        MediaStreamType.DASH,
        MediaStreamDeliveryPriority.NATIVE_ADAPTIVE,
      ),
    ];

    // @ts-ignore
    playbackAdapters.forEach(adapter =>
      strategy._availableAdapters.push(new adapter(strategy._eventEmitter)),
    );

    strategy.connectAdapter('http://www.dash.com/dash.mpd');

    const attachedAdapter = strategy.attachedAdapter;
    sinon.spy(attachedAdapter, 'detach');
    strategy.destroy();
    expect(attachedAdapter.detach.called).toBe(true);
  });
});
