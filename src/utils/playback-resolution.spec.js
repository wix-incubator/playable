import { expect } from 'chai';
import { resolvePlayableStreams } from './playback-resolution';
import { MEDIA_STREAM_TYPES, MEDIA_STREAM_DELIVERY_TYPE } from '../constants';

describe('Picking proper playback stream', () => {
  class AdaptiveCanBePlayedStreamA {
    static canPlay = () => true;
    constructor() {

    }

    getMediaStreamDeliveryType() {
      return MEDIA_STREAM_DELIVERY_TYPE.ADAPTIVE_VIA_MSE;
    }
  }
  class AdaptiveCanBePlayedStreamB {
    static canPlay = () => true;

    getMediaStreamDeliveryType() {
      return MEDIA_STREAM_DELIVERY_TYPE.ADAPTIVE_VIA_MSE;
    }
  }

  class NativeCanBePlayedStreamA {
    static canPlay = () => true;

    getMediaStreamDeliveryType() {
      return MEDIA_STREAM_DELIVERY_TYPE.NATIVE_ADAPTIVE;
    }
  }

  class CantBePlayedStream {
    static canPlay = () => false;

    getMediaStreamDeliveryType() {
      return MEDIA_STREAM_DELIVERY_TYPE.ADAPTIVE_VIA_MSE;
    }
  }

  const mediaStreams = [
    {
      url: '',
      type: MEDIA_STREAM_TYPES.HLS
    }
  ];

  it('should use priority based on indexes in array of playableStreamCreators if same delivery type', () => {
    let resolvedStream = resolvePlayableStreams(mediaStreams, [
      AdaptiveCanBePlayedStreamA,
      AdaptiveCanBePlayedStreamB,
    ]);
    expect(resolvedStream[0] instanceof AdaptiveCanBePlayedStreamA).to.be.true;

    resolvedStream = resolvePlayableStreams(mediaStreams, [
      AdaptiveCanBePlayedStreamB,
      AdaptiveCanBePlayedStreamA,
    ]);

    expect(resolvedStream[0] instanceof AdaptiveCanBePlayedStreamB).to.be.true;
  });

  it('should choose only stream that can be played', () => {
    let resolvedStream = resolvePlayableStreams(mediaStreams, [
      CantBePlayedStream,
      AdaptiveCanBePlayedStreamA,
    ]);
    expect(resolvedStream[0] instanceof AdaptiveCanBePlayedStreamA).to.be.true;
  });

  it('should sort resolved stream based on delivery type', () => {
    let resolvedStream = resolvePlayableStreams(mediaStreams, [
      AdaptiveCanBePlayedStreamA,
      AdaptiveCanBePlayedStreamB,
      NativeCanBePlayedStreamA,
    ]);
    expect(resolvedStream[0] instanceof NativeCanBePlayedStreamA).to.be.true;
  });
});

