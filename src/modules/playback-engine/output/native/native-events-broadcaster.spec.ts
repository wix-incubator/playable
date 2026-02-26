import EventEmitter from '../../../../modules/event-emitter/event-emitter';

import { VideoEvent } from '../../../../constants';
import NativeEventsBroadcast, {
  NATIVE_VIDEO_TO_BROADCAST,
} from './native-events-broadcaster';

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

  beforeEach(() => {
    video = {
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      tagName: 'VIDEO',
    };

    eventEmitter = new EventEmitter();
    vi.spyOn(eventEmitter, 'emitAsync');

    broadcaster = new NativeEventsBroadcast(eventEmitter, video);
  });

  afterEach(() => {
    eventEmitter.emitAsync.mockRestore();
  });

  it('should attach events to video tag on initialization', () => {
    expect(video.addEventListener.mock.calls.length).toBe(
      NATIVE_VIDEO_TO_BROADCAST.length,
    );
    video.addEventListener.mock.calls.forEach((arg: any) => {
      expect(NATIVE_VIDEO_TO_BROADCAST.indexOf(arg[0]) !== -1).toBe(true);
      expect(arg[1] === broadcaster._processEventFromVideo).toBe(true);
    });
  });

  it('should detach events from video tag on destroy', () => {
    broadcaster.destroy();
    expect(video.removeEventListener.mock.calls.length).toBe(
      NATIVE_VIDEO_TO_BROADCAST.length,
    );
    video.removeEventListener.mock.calls.forEach((arg: any) => {
      expect(NATIVE_VIDEO_TO_BROADCAST.indexOf(arg[0]) !== -1).toBe(true);
      expect(arg[1] === broadcaster._processEventFromVideo).toBe(true);
    });
  });

  it('should broadcast progress event', () => {
    broadcaster._processEventFromVideo(NATIVE_EVENTS.PROGRESS);
    expect(eventEmitter.emitAsync).toHaveBeenCalledWith(
      VideoEvent.CHUNK_LOADED,
    );
  });

  it('should broadcast stalled event', () => {
    broadcaster._processEventFromVideo(NATIVE_EVENTS.STALLED);
    expect(eventEmitter.emitAsync).toHaveBeenCalledWith(
      VideoEvent.UPLOAD_STALLED,
    );
  });

  it('should broadcast suspend event', () => {
    broadcaster._processEventFromVideo(NATIVE_EVENTS.SUSPEND);
    expect(eventEmitter.emitAsync).toHaveBeenCalledWith(
      VideoEvent.UPLOAD_SUSPEND,
    );
  });

  it('should broadcast seeking event', () => {
    video.currentTime = 100;
    broadcaster._processEventFromVideo(NATIVE_EVENTS.SEEKING);
    expect(eventEmitter.emitAsync).toHaveBeenCalledWith(
      VideoEvent.SEEK_IN_PROGRESS,
      100,
    );
  });

  it('should broadcast durationchange event', () => {
    video.duration = 'Test duration';
    broadcaster._processEventFromVideo(NATIVE_EVENTS.DURATION_CHANGE);
    expect(eventEmitter.emitAsync).toHaveBeenCalledWith(
      VideoEvent.DURATION_UPDATED,
      video.duration,
    );
  });

  it('should broadcast timeupdate event', () => {
    video.currentTime = 'Test currentTime';
    broadcaster._processEventFromVideo(NATIVE_EVENTS.TIME_UPDATE);
    expect(eventEmitter.emitAsync).toHaveBeenCalledWith(
      VideoEvent.CURRENT_TIME_UPDATED,
      video.currentTime,
    );
  });

  it('should broadcast volume change event', () => {
    video.volume = 0.2;
    video.muted = true;
    broadcaster._processEventFromVideo(NATIVE_EVENTS.VOLUME_CHANGE);
    expect(eventEmitter.emitAsync).toHaveBeenCalledWith(
      VideoEvent.SOUND_STATE_CHANGED,
      {
        volume: video.volume,
        muted: video.muted,
      },
    );

    expect(eventEmitter.emitAsync).toHaveBeenCalledWith(
      VideoEvent.VOLUME_CHANGED,
      video.volume * 100,
    );

    expect(eventEmitter.emitAsync).toHaveBeenCalledWith(
      VideoEvent.MUTE_CHANGED,
      video.muted,
    );
  });

  it('should do nothing if event is not in list', () => {
    broadcaster._processEventFromVideo();
    expect(eventEmitter.emitAsync).not.toHaveBeenCalled();
  });
});
