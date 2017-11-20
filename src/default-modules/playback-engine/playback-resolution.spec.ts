import { expect } from 'chai';
import { resolveAdapters } from './playback-resolution';
import {
  MEDIA_STREAM_TYPES,
  MEDIA_STREAM_DELIVERY_TYPE,
} from '../../constants';

describe('Picking proper playback stream', () => {
  class AdaptiveCanBePlayedStreamA {
    canPlay = () => true;
    constructor() {}

    get mediaStreamDeliveryType() {
      return MEDIA_STREAM_DELIVERY_TYPE.ADAPTIVE_VIA_MSE;
    }

    setMediaStreams() {
      return true;
    }
  }
  class AdaptiveCanBePlayedStreamB {
    canPlay = () => true;
    constructor() {}

    get mediaStreamDeliveryType() {
      return MEDIA_STREAM_DELIVERY_TYPE.ADAPTIVE_VIA_MSE;
    }

    setMediaStreams() {
      return true;
    }
  }

  class NativeCanBePlayedStreamA {
    canPlay = () => true;

    get mediaStreamDeliveryType() {
      return MEDIA_STREAM_DELIVERY_TYPE.NATIVE_ADAPTIVE;
    }

    setMediaStreams() {
      return true;
    }
  }

  class CantBePlayedStream {
    canPlay = () => false;

    get mediaStreamDeliveryType() {
      return MEDIA_STREAM_DELIVERY_TYPE.ADAPTIVE_VIA_MSE;
    }

    setMediaStreams() {
      return true;
    }
  }

  const mediaStreams = [
    {
      url: '',
      type: MEDIA_STREAM_TYPES.HLS,
    },
  ];

  it('should use priority based on indexes in array of playableStreamCreators if same delivery type', () => {
    let resolvedStream = resolveAdapters(mediaStreams, [
      new AdaptiveCanBePlayedStreamA(),
      new AdaptiveCanBePlayedStreamB(),
    ]);
    expect(resolvedStream[0] instanceof AdaptiveCanBePlayedStreamA).to.be.true;

    resolvedStream = resolveAdapters(mediaStreams, [
      new AdaptiveCanBePlayedStreamB(),
      new AdaptiveCanBePlayedStreamA(),
    ]);

    expect(resolvedStream[0] instanceof AdaptiveCanBePlayedStreamB).to.be.true;
  });

  it('should choose only stream that can be played', () => {
    let resolvedStream = resolveAdapters(mediaStreams, [
      new CantBePlayedStream(),
      new AdaptiveCanBePlayedStreamA(),
    ]);
    expect(resolvedStream[0] instanceof AdaptiveCanBePlayedStreamA).to.be.true;
  });

  it('should sort resolved stream based on delivery type', () => {
    let resolvedStream = resolveAdapters(mediaStreams, [
      new AdaptiveCanBePlayedStreamA(),
      new AdaptiveCanBePlayedStreamB(),
      new NativeCanBePlayedStreamA(),
    ]);
    expect(resolvedStream[0] instanceof NativeCanBePlayedStreamA).to.be.true;
  });
});
