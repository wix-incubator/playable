import { expect } from 'chai';
import * as sinon from 'sinon';
import EventEmitter from '../../modules/event-emitter/event-emitter';

import { VideoEvent } from '../../constants';
import NativeEventsBroadcast, {
  NATIVE_VIDEO_TO_BROADCAST,
} from './native-events-broadcaster';
import NativeOutput from './output/native';
import { IVideoOutput } from './types';

const NATIVE_EVENTS = {
  ERROR: { type: 'error' },
  STALLED: { type: 'stalled' },
  PROGRESS: { type: 'progress' },
  SEEKING: { type: 'seeking' },
  SUSPEND: { type: 'suspend' },
  DURATION_CHANGE: { type: 'durationchange' },
  TIME_UPDATE: { type: 'timeupdate' },
  VOLUME_CHANGE: { type: 'volumechange' },
};

describe('NativeEventsBroadcaster', () => {
  let video: any;
  let broadcaster: any;
  let eventEmitter: any;
  let output: IVideoOutput;

  beforeEach(() => {
    video = {
      addEventListener: sinon.spy(),
      removeEventListener: sinon.spy(),
      tagName: 'VIDEO',
    };

    eventEmitter = new EventEmitter();
    sinon.spy(eventEmitter, 'emitAsync');

    output = new NativeOutput(video);
    broadcaster = new NativeEventsBroadcast(eventEmitter, output);
  });

  afterEach(() => {
    eventEmitter.emitAsync.restore();
  });

  it('should attach events to video tag on initialization', () => {
    expect(video.addEventListener.args.length).to.be.equal(
      NATIVE_VIDEO_TO_BROADCAST.length,
    );
    video.addEventListener.args.forEach((arg: any) => {
      expect(NATIVE_VIDEO_TO_BROADCAST.indexOf(arg[0]) !== -1).to.be.true;
      expect(arg[1] === broadcaster._processEventFromVideo).to.be.true;
    });
  });

  it('should detach events from video tag on destroy', () => {
    broadcaster.destroy();
    expect(video.removeEventListener.args.length).to.be.equal(
      NATIVE_VIDEO_TO_BROADCAST.length,
    );
    video.removeEventListener.args.forEach((arg: any) => {
      expect(NATIVE_VIDEO_TO_BROADCAST.indexOf(arg[0]) !== -1).to.be.true;
      expect(arg[1] === broadcaster._processEventFromVideo).to.be.true;
    });
  });

  it('should broadcast progress event', () => {
    broadcaster._processEventFromVideo(NATIVE_EVENTS.PROGRESS);
    expect(eventEmitter.emitAsync.calledWith(VideoEvent.CHUNK_LOADED)).to.be
      .true;
  });

  it('should broadcast stalled event', () => {
    broadcaster._processEventFromVideo(NATIVE_EVENTS.STALLED);
    expect(eventEmitter.emitAsync.calledWith(VideoEvent.UPLOAD_STALLED)).to.be
      .true;
  });

  it('should broadcast suspend event', () => {
    broadcaster._processEventFromVideo(NATIVE_EVENTS.SUSPEND);
    expect(eventEmitter.emitAsync.calledWith(VideoEvent.UPLOAD_SUSPEND)).to.be
      .true;
  });

  it('should broadcast seeking event', () => {
    video.currentTime = 100;
    broadcaster._processEventFromVideo(NATIVE_EVENTS.SEEKING);
    expect(eventEmitter.emitAsync.calledWith(VideoEvent.SEEK_IN_PROGRESS, 100))
      .to.be.true;
  });

  it('should broadcast durationchange event', () => {
    video.duration = 'Test duration';
    broadcaster._processEventFromVideo(NATIVE_EVENTS.DURATION_CHANGE);
    expect(
      eventEmitter.emitAsync.calledWith(
        VideoEvent.DURATION_UPDATED,
        video.duration,
      ),
    ).to.be.true;
  });

  it('should broadcast timeupdate event', () => {
    video.currentTime = 'Test currentTime';
    broadcaster._processEventFromVideo(NATIVE_EVENTS.TIME_UPDATE);
    expect(
      eventEmitter.emitAsync.calledWith(
        VideoEvent.CURRENT_TIME_UPDATED,
        video.currentTime,
      ),
    ).to.be.true;
  });

  it('should broadcast volume change event', () => {
    video.volume = 0.2;
    video.muted = true;
    broadcaster._processEventFromVideo(NATIVE_EVENTS.VOLUME_CHANGE);
    expect(
      eventEmitter.emitAsync.calledWith(VideoEvent.SOUND_STATE_CHANGED, {
        volume: video.volume,
        muted: video.muted,
      }),
    ).to.be.true;

    expect(
      eventEmitter.emitAsync.calledWith(
        VideoEvent.VOLUME_CHANGED,
        video.volume * 100,
      ),
    ).to.be.true;

    expect(
      eventEmitter.emitAsync.calledWith(VideoEvent.MUTE_CHANGED, video.muted),
    ).to.be.true;
  });

  it('should do nothing if event is not in list', () => {
    broadcaster._processEventFromVideo();
    expect(eventEmitter.emitAsync.called).to.be.false;
  });
});
