import 'jsdom-global/register';

import { expect } from 'chai';
import sinon from 'sinon';
import EventEmitter from 'eventemitter3';

import getNativeStreamCreator from './media-streams/native-stream';
import MediaStreamsStrategy from './media-streams-strategy';
import { MEDIA_STREAM_TYPES, MEDIA_STREAM_DELIVERY_TYPE } from '../../constants/index';

describe('MediaStreamsStrategy', () => {
  const video = {
    addEventListener: () => {},
    removeEventListener: () => {}
  };
  let strategy;
  let eventEmitter;

  beforeEach(() => {
    eventEmitter = new EventEmitter();
    strategy = new MediaStreamsStrategy(eventEmitter, video);
  });

  it('should do nothing if src not passed', () => {
    strategy.connectMediaStream();
    expect(strategy.attachedStream).to.be.null;
  });

  it('should generate list of available stream creator in env on construction', () => {
    const availableStream = getNativeStreamCreator(MEDIA_STREAM_TYPES.HLS, MEDIA_STREAM_DELIVERY_TYPE.NATIVE_ADAPTIVE);
    const unavailableStream = getNativeStreamCreator(MEDIA_STREAM_TYPES.DASH, MEDIA_STREAM_DELIVERY_TYPE.NATIVE_ADAPTIVE);
    availableStream.isSupported = () => true;
    unavailableStream.isSupported = () => false;

    const oldStreamCreators = MediaStreamsStrategy.streamCreators;
    MediaStreamsStrategy.streamCreators = [availableStream, unavailableStream];

    const newStrategy = new MediaStreamsStrategy(eventEmitter, video);
    expect(newStrategy._playableStreamCreators.length).to.be.equal(1);
    expect(newStrategy._playableStreamCreators[0]).to.be.equal(availableStream);

    MediaStreamsStrategy.streamCreators = oldStreamCreators;
  });

  it('should choose proper media stream for proper format', () => {
    strategy._playableStreamCreators = [
      getNativeStreamCreator(MEDIA_STREAM_TYPES.HLS, MEDIA_STREAM_DELIVERY_TYPE.NATIVE_ADAPTIVE),
      getNativeStreamCreator(MEDIA_STREAM_TYPES.DASH, MEDIA_STREAM_DELIVERY_TYPE.NATIVE_ADAPTIVE),
      getNativeStreamCreator(MEDIA_STREAM_TYPES.MP4, MEDIA_STREAM_DELIVERY_TYPE.NATIVE_ADAPTIVE),
    ];

    strategy.connectMediaStream('http://www.dash.com/dash.mpd');
    expect(strategy.attachedStream.getMediaStreamType()).to.be.equal(MEDIA_STREAM_TYPES.DASH);

    strategy.connectMediaStream('http://www.hls.com/hls.m3u8');
    expect(strategy.attachedStream.getMediaStreamType()).to.be.equal(MEDIA_STREAM_TYPES.HLS);

    strategy.connectMediaStream({ url: 'http://www.mp4.com/mp4.mp4', type: MEDIA_STREAM_TYPES.MP4 });
  });

  it('should choose proper media stream based on priority', () => {
    strategy._playableStreamCreators = [
      getNativeStreamCreator(MEDIA_STREAM_TYPES.DASH, MEDIA_STREAM_DELIVERY_TYPE.NATIVE_PROGRESSIVE),
      getNativeStreamCreator(MEDIA_STREAM_TYPES.DASH, MEDIA_STREAM_DELIVERY_TYPE.NATIVE_ADAPTIVE),
    ];

    strategy.connectMediaStream('http://www.dash.com/dash.mpd');
    expect(strategy.attachedStream.getMediaStreamDeliveryType()).to.be.equal(MEDIA_STREAM_DELIVERY_TYPE.NATIVE_ADAPTIVE);

    strategy._playableStreamCreators = [
      getNativeStreamCreator(MEDIA_STREAM_TYPES.HLS, MEDIA_STREAM_DELIVERY_TYPE.NATIVE_ADAPTIVE),
      getNativeStreamCreator(MEDIA_STREAM_TYPES.HLS, MEDIA_STREAM_DELIVERY_TYPE.NATIVE_PROGRESSIVE),
    ];

    strategy.connectMediaStream('http://www.hls.com/hls.m3u8');
    expect(strategy.attachedStream.getMediaStreamDeliveryType()).to.be.equal(MEDIA_STREAM_DELIVERY_TYPE.NATIVE_ADAPTIVE);
  });

  it('should detach current stream on changing of stream and destroy', () => {
    strategy._playableStreamCreators = [
      getNativeStreamCreator(MEDIA_STREAM_TYPES.DASH, MEDIA_STREAM_DELIVERY_TYPE.NATIVE_ADAPTIVE)
    ];

    strategy.connectMediaStream('http://www.dash.com/dash.mpd');

    const attachedStream = strategy.attachedStream;
    sinon.spy(attachedStream, 'detach');
    strategy.connectMediaStream('http://www.dash.com/dash2.mpd');
    expect(attachedStream.detach.called).to.be.true;
  });

  it('should detach current stream on destroy', () => {
    strategy._playableStreamCreators = [
      getNativeStreamCreator(MEDIA_STREAM_TYPES.DASH, MEDIA_STREAM_DELIVERY_TYPE.NATIVE_ADAPTIVE)
    ];

    strategy.connectMediaStream('http://www.dash.com/dash.mpd');

    const attachedStream = strategy.attachedStream;
    sinon.spy(attachedStream, 'detach');
    strategy.destroy();
    expect(attachedStream.detach.called).to.be.true;
  });
});
