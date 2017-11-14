import { expect } from 'chai';
import * as sinon from 'sinon';
import { EventEmitter } from 'eventemitter3';

import { VIDEO_EVENTS } from '../../constants/index';
import NativeEventsBroadcast, { NATIVE_VIDEO_TO_BROADCAST } from './native-events-broadcaster';


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
  let video;
  let broadcaster;
  let eventEmitter;

  beforeEach(() => {
    video = {
      addEventListener: sinon.spy(),
      removeEventListener: sinon.spy()
    };

    eventEmitter = new EventEmitter();
    sinon.spy(eventEmitter, 'emit');
    broadcaster = new NativeEventsBroadcast(eventEmitter, video);
  });

  afterEach(() => {
    eventEmitter.emit.restore();
  });

  it('should attach events to video tag on initialization', () => {
    expect(video.addEventListener.args.length).to.be.equal(NATIVE_VIDEO_TO_BROADCAST.length);
    video.addEventListener.args.forEach(arg => {
      expect(NATIVE_VIDEO_TO_BROADCAST.indexOf(arg[0]) !== -1).to.be.true;
      expect(arg[1] === broadcaster._processEventFromVideo).to.be.true;
    });
  });

  it('should detach events from video tag on destroy', () => {
    broadcaster.destroy();
    expect(video.removeEventListener.args.length).to.be.equal(NATIVE_VIDEO_TO_BROADCAST.length);
    video.removeEventListener.args.forEach(arg => {
      expect(NATIVE_VIDEO_TO_BROADCAST.indexOf(arg[0]) !== -1).to.be.true;
      expect(arg[1] === broadcaster._processEventFromVideo).to.be.true;
    });
  });

  it('should broadcast progress event', () => {
    broadcaster._processEventFromVideo(NATIVE_EVENTS.PROGRESS);
    expect(eventEmitter.emit.calledWith(VIDEO_EVENTS.CHUNK_LOADED)).to.be.true;
  });

  it('should broadcast stalled event', () => {
    broadcaster._processEventFromVideo(NATIVE_EVENTS.STALLED);
    expect(eventEmitter.emit.calledWith(VIDEO_EVENTS.UPLOAD_STALLED)).to.be.true;
  });

  it('should broadcast suspend event', () => {
    broadcaster._processEventFromVideo(NATIVE_EVENTS.SUSPEND);
    expect(eventEmitter.emit.calledWith(VIDEO_EVENTS.UPLOAD_SUSPEND)).to.be.true;
  });

  it('should broadcast seeking event', () => {
    video.currentTime = 100;
    broadcaster._processEventFromVideo(NATIVE_EVENTS.SEEKING);
    expect(eventEmitter.emit.calledWith(VIDEO_EVENTS.SEEK_IN_PROGRESS, 100)).to.be.true;
  });

  it('should broadcast durationchange event', () => {
    video.duration = 'Test duration';
    broadcaster._processEventFromVideo(NATIVE_EVENTS.DURATION_CHANGE);
    expect(eventEmitter.emit.calledWith(VIDEO_EVENTS.DURATION_UPDATED, video.duration)).to.be.true;
  });

  it('should broadcast timeupdate event', () => {
    video.currentTime = 'Test currentTime';
    broadcaster._processEventFromVideo(NATIVE_EVENTS.TIME_UPDATE);
    expect(eventEmitter.emit.calledWith(VIDEO_EVENTS.CURRENT_TIME_UPDATED, video.currentTime)).to.be.true;
  });

  it('should broadcast error event', () => {
    video.volume = 'Test volume';
    video.muted = 'Test muted';
    broadcaster._processEventFromVideo(NATIVE_EVENTS.VOLUME_CHANGE);
    expect(
      eventEmitter.emit.calledWith(
        VIDEO_EVENTS.VOLUME_STATUS_CHANGED, {
        volume: video.volume,
        muted: video.muted
      })
    ).to.be.true;
  });

  it('should do nothing if event is not in list', () => {
    broadcaster._processEventFromVideo();
    expect(eventEmitter.emit.called).to.be.false;
  })
});
