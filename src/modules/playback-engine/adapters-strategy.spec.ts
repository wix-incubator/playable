import 'jsdom-global/register';

import { expect } from 'chai';

import * as sinon from 'sinon';
import EventEmitter from '../../modules/event-emitter/event-emitter';

import getNativeAdapterCreator from './adapters/native';
import AdapterStrategy from './adapters-strategy';
import { MediaStreamType, MediaStreamDeliveryPriority } from '../../constants';
import NativeOutput from './output/native';

describe('AdapterStrategy', () => {
  const video = document.createElement('video');
  const nativeOutput = new NativeOutput(video);
  let strategy: any;
  let eventEmitter: any;
  let playbackAdapters;

  beforeEach(() => {
    eventEmitter = new EventEmitter();
    strategy = new AdapterStrategy(eventEmitter, nativeOutput);
  });

  it('should do nothing if src not passed', () => {
    strategy.connectAdapter();
    expect(strategy.attachedAdapter).to.be.null;
  });

  it('should generate list of available stream creator in env on construction', () => {
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

    const newStrategy: any = new AdapterStrategy(eventEmitter, nativeOutput, [
      availableStream,
      unavailableStream,
    ]);
    expect(newStrategy._availableAdapters.length).to.be.equal(1);
    expect(newStrategy._availableAdapters[0].constructor).to.be.equal(
      availableStream,
    );
  });

  it('should choose proper media stream for proper format', () => {
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
    expect(strategy.attachedAdapter.mediaStreamType).to.be.equal(
      MediaStreamType.DASH,
    );

    strategy.connectAdapter('http://www.hls.com/hls.m3u8');
    expect(strategy.attachedAdapter.mediaStreamType).to.be.equal(
      MediaStreamType.HLS,
    );

    strategy.connectAdapter({
      url: 'http://www.mp4.com/mp4.mp4',
      type: MediaStreamType.MP4,
    });
  });

  it('should choose proper media stream based on priority', () => {
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
    expect(strategy.attachedAdapter.mediaStreamDeliveryPriority).to.be.equal(
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
    expect(strategy.attachedAdapter.mediaStreamDeliveryPriority).to.be.equal(
      MediaStreamDeliveryPriority.NATIVE_ADAPTIVE,
    );
  });

  it('should detach current stream on changing of stream and destroy', () => {
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
    expect(attachedAdapter.detach.called).to.be.true;
  });

  it('should detach current stream on destroy', () => {
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
    strategy.destroy();
    expect(attachedAdapter.detach.called).to.be.true;
  });
});
