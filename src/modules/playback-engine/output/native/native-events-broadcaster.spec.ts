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
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      tagName: 'VIDEO',
    };

    eventEmitter = new EventEmitter();
    jest.spyOn(eventEmitter, 'emitAsync');

    broadcaster = new NativeEventsBroadcast(eventEmitter, video);
  });

  afterEach(() => {
    eventEmitter.emitAsync.mockRestore();
  });

  test('should attach events to video tag on initialization', () => {
    expect(video.addEventListener.mock.calls.length).toEqual(
      NATIVE_VIDEO_TO_BROADCAST.length,
    );
    video.addEventListener.mock.calls.forEach((arg: any) => {
      expect(NATIVE_VIDEO_TO_BROADCAST.indexOf(arg[0]) !== -1).toBe(true);
      expect(arg[1] === broadcaster._processEventFromVideo).toBe(true);
    });
  });

  test('should detach events from video tag on destroy', () => {
    broadcaster.destroy();
    expect(video.removeEventListener.mock.calls.length).toBe(
      NATIVE_VIDEO_TO_BROADCAST.length,
    );
    video.removeEventListener.mock.calls.forEach((arg: any) => {
      expect(NATIVE_VIDEO_TO_BROADCAST.indexOf(arg[0]) !== -1).toBe(true);
      expect(arg[1] === broadcaster._processEventFromVideo).toBe(true);
    });
  });

  test('should broadcast progress event', () => {
    broadcaster._processEventFromVideo(NATIVE_EVENTS.PROGRESS);
    expect(eventEmitter.emitAsync).toHaveBeenCalledWith(
      VideoEvent.CHUNK_LOADED,
    );
  });

  test('should broadcast stalled event', () => {
    broadcaster._processEventFromVideo(NATIVE_EVENTS.STALLED);
    expect(eventEmitter.emitAsync).toHaveBeenCalledWith(
      VideoEvent.UPLOAD_STALLED,
    );
  });

  test('should broadcast suspend event', () => {
    broadcaster._processEventFromVideo(NATIVE_EVENTS.SUSPEND);
    expect(eventEmitter.emitAsync).toHaveBeenCalledWith(
      VideoEvent.UPLOAD_SUSPEND,
    );
  });

  test('should broadcast seeking event', () => {
    video.currentTime = 100;
    broadcaster._processEventFromVideo(NATIVE_EVENTS.SEEKING);
    expect(eventEmitter.emitAsync).toHaveBeenCalledWith(
      VideoEvent.SEEK_IN_PROGRESS,
      100,
    );
  });

  test('should broadcast durationchange event', () => {
    video.duration = 'Test duration';
    broadcaster._processEventFromVideo(NATIVE_EVENTS.DURATION_CHANGE);
    expect(eventEmitter.emitAsync).toHaveBeenCalledWith(
      VideoEvent.DURATION_UPDATED,
      video.duration,
    );
  });

  test('should broadcast timeupdate event', () => {
    video.currentTime = 'Test currentTime';
    broadcaster._processEventFromVideo(NATIVE_EVENTS.TIME_UPDATE);
    expect(eventEmitter.emitAsync).toHaveBeenCalledWith(
      VideoEvent.CURRENT_TIME_UPDATED,
      video.currentTime,
    );
  });

  test('should broadcast volume change event', () => {
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

  test('should do nothing if event is not in list', () => {
    broadcaster._processEventFromVideo();
    expect(eventEmitter.emitAsync).not.toHaveBeenCalled();
  });
});
