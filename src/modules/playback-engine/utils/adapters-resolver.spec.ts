import { expect } from 'chai';
import { resolveAdapters } from './adapters-resolver';
import {
  MediaStreamType,
  MediaStreamDeliveryPriority,
} from '../../../constants';

describe('Picking proper playback stream', () => {
  class AdaptiveCanBePlayedStreamA {
    canPlay = () => true;

    get mediaStreamDeliveryPriority() {
      return MediaStreamDeliveryPriority.ADAPTIVE_VIA_MSE;
    }

    setMediaStreams() {
      return true;
    }
  }
  class AdaptiveCanBePlayedStreamB {
    canPlay = () => true;

    get mediaStreamDeliveryPriority() {
      return MediaStreamDeliveryPriority.ADAPTIVE_VIA_MSE;
    }

    setMediaStreams() {
      return true;
    }
  }

  class NativeCanBePlayedStreamA {
    canPlay = () => true;

    get mediaStreamDeliveryPriority() {
      return MediaStreamDeliveryPriority.NATIVE_ADAPTIVE;
    }

    setMediaStreams() {
      return true;
    }
  }

  class CantBePlayedStream {
    canPlay = () => false;

    get mediaStreamDeliveryPriority() {
      return MediaStreamDeliveryPriority.ADAPTIVE_VIA_MSE;
    }

    setMediaStreams() {
      return true;
    }
  }

  const mediaStreams = [
    {
      url: '',
      type: MediaStreamType.HLS,
    },
  ];

  it('should use priority based on indexes in array of playableStreamCreators if same delivery type', () => {
    let resolvedStream = resolveAdapters(mediaStreams, [
      new AdaptiveCanBePlayedStreamA(),
      new AdaptiveCanBePlayedStreamB(),
    ] as any);
    expect(resolvedStream[0] instanceof AdaptiveCanBePlayedStreamA).to.be.true;

    resolvedStream = resolveAdapters(mediaStreams, [
      new AdaptiveCanBePlayedStreamB(),
      new AdaptiveCanBePlayedStreamA(),
    ] as any);

    expect(resolvedStream[0] instanceof AdaptiveCanBePlayedStreamB).to.be.true;
  });

  it('should choose only stream that can be played', () => {
    const resolvedStream = resolveAdapters(mediaStreams, [
      new CantBePlayedStream(),
      new AdaptiveCanBePlayedStreamA(),
    ] as any);
    expect(resolvedStream[0] instanceof AdaptiveCanBePlayedStreamA).to.be.true;
  });

  it('should sort resolved stream based on delivery type', () => {
    const resolvedStream = resolveAdapters(mediaStreams, [
      new AdaptiveCanBePlayedStreamA(),
      new AdaptiveCanBePlayedStreamB(),
      new NativeCanBePlayedStreamA(),
    ] as any);
    expect(resolvedStream[0] instanceof NativeCanBePlayedStreamA).to.be.true;
  });
});
