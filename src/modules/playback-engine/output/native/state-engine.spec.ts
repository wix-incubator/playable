import * as sinon from 'sinon';
import EventEmitter from '../../../../modules/event-emitter/event-emitter';

import { VideoEvent, EngineState } from '../../../../constants';
import StateEngine, { NATIVE_VIDEO_EVENTS_TO_STATE } from './state-engine';

import { setProperty, resetProperty } from '../../../../testkit';

declare const navigator: any;

const NATIVE_EVENTS = {
  LOAD_START: { type: 'loadstart' },
  LOADED_META_DATA: { type: 'loadedmetadata' },
  CAN_PLAY: { type: 'canplay' },
  PLAY: { type: 'play' },
  PLAYING: { type: 'playing' },
  WAITING: { type: 'waiting' },
  PAUSE: { type: 'pause' },
  ENDED: { type: 'ended' },
  SEEKING: { type: 'seeking' },
  SEEKED: { type: 'seeked' },
};

describe('NativeEventsBroadcaster', () => {
  let video: any;
  let engine: any;
  let eventEmitter: any;

  beforeEach(() => {
    video = {
      addEventListener: sinon.spy(),
      removeEventListener: sinon.spy(),
      played: {
        length: 1,
      },
      tagName: 'VIDEO',
    };

    eventEmitter = new EventEmitter();

    sinon.spy(eventEmitter, 'emitAsync');
    engine = new StateEngine(eventEmitter, video);
    sinon.spy(engine, 'setState');
  });

  afterEach(() => {
    resetProperty(navigator, 'userAgent');

    eventEmitter.emitAsync.restore();
    engine.setState.restore();
  });

  test('should attach events to video tag on initialization', () => {
    expect(video.addEventListener.args.length).toBe(
      NATIVE_VIDEO_EVENTS_TO_STATE.length,
    );
    video.addEventListener.args.forEach((arg: any) => {
      expect(NATIVE_VIDEO_EVENTS_TO_STATE.indexOf(arg[0]) !== -1).toBe(true);
      expect(arg[1] === engine._processEventFromVideo).toBe(true);
    });
  });

  test('should detach events from video tag on destroy', () => {
    engine.destroy();
    expect(video.removeEventListener.args.length).toBe(
      NATIVE_VIDEO_EVENTS_TO_STATE.length,
    );
    video.removeEventListener.args.forEach((arg: any) => {
      expect(NATIVE_VIDEO_EVENTS_TO_STATE.indexOf(arg[0]) !== -1).toBe(true);
      expect(arg[1] === engine._processEventFromVideo).toBe(true);
    });
  });

  test('should have method for setting state', () => {
    expect(engine.setState).toBeDefined();

    engine._currentState = EngineState.LOAD_STARTED;
    engine.setState(EngineState.READY_TO_PLAY);
    expect(
      eventEmitter.emitAsync.calledWith(VideoEvent.STATE_CHANGED, {
        prevState: EngineState.LOAD_STARTED,
        nextState: EngineState.READY_TO_PLAY,
      }),
    );
    expect(engine._currentState).toBe(EngineState.READY_TO_PLAY);
  });

  test('should not trigger change of state on same state', () => {
    engine.setState(EngineState.READY_TO_PLAY);
    expect(eventEmitter.emitAsync.calledTwice).toBe(true);
    engine.setState(EngineState.READY_TO_PLAY);
    expect(eventEmitter.emitAsync.calledTwice).toBe(true);
  });

  test('should set state on loadstart event', () => {
    engine._processEventFromVideo(NATIVE_EVENTS.LOAD_START);
    expect(engine.setState.calledWith(EngineState.LOAD_STARTED)).toBe(true);
  });

  test('should set state on loadedmetadata event', () => {
    expect(engine._isMetadataLoaded).toBe(false);
    engine._processEventFromVideo(NATIVE_EVENTS.LOADED_META_DATA);
    expect(engine.setState.calledWith(EngineState.METADATA_LOADED)).toBe(true);
    expect(engine.isMetadataLoaded).toBe(true);
  });

  test('should set state on canplay event only after medatada loaded', () => {
    engine._processEventFromVideo(NATIVE_EVENTS.CAN_PLAY);
    expect(engine.setState.calledWith(EngineState.READY_TO_PLAY)).toBe(false);
    engine._processEventFromVideo(NATIVE_EVENTS.LOADED_META_DATA);
    engine._processEventFromVideo(NATIVE_EVENTS.CAN_PLAY);
    expect(engine.setState.calledWith(EngineState.READY_TO_PLAY)).toBe(true);
  });

  test('should set state on play event', () => {
    engine._processEventFromVideo(NATIVE_EVENTS.PLAY);
    expect(engine.setState.calledWith(EngineState.PLAY_REQUESTED)).toBe(true);
  });

  test('should set state on playing event', () => {
    engine._processEventFromVideo(NATIVE_EVENTS.PLAYING);
    expect(engine.setState.calledWith(EngineState.PLAYING)).toBe(true);
  });

  test('should not set state on playing event if video is not actually playing', () => {
    setProperty(navigator, 'userAgent', 'safari');
    video.paused = true;
    engine._processEventFromVideo(NATIVE_EVENTS.PLAYING);
    expect(engine.setState.calledWith(EngineState.PLAYING)).toBe(false);
  });

  test('should set state on waiting event', () => {
    engine._processEventFromVideo(NATIVE_EVENTS.WAITING);
    expect(engine.setState.calledWith(EngineState.WAITING)).toBe(true);
  });

  test('should set state on pause event', () => {
    engine._processEventFromVideo(NATIVE_EVENTS.PAUSE);
    expect(engine.setState.calledWith(EngineState.PAUSED)).toBe(true);
  });

  test('should not set state on pause event if there is no played chunks', () => {
    setProperty(navigator, 'userAgent', 'safari');
    video.played.length = 0;
    engine._processEventFromVideo(NATIVE_EVENTS.PAUSE);
    expect(engine.setState.calledWith(EngineState.PAUSED)).toBe(false);
  });

  test('should set state on ended event', () => {
    engine._processEventFromVideo(NATIVE_EVENTS.ENDED);
    expect(engine.setState.calledWith(EngineState.ENDED)).toBe(true);
  });

  test('should set state on seeking event', () => {
    engine._processEventFromVideo(NATIVE_EVENTS.SEEKING);
    expect(engine.setState.calledWith(EngineState.SEEK_IN_PROGRESS)).toBe(true);
  });

  test('should set state on seeked event', () => {
    video.paused = true;
    engine._processEventFromVideo(NATIVE_EVENTS.SEEKED);
    expect(engine.setState.calledWith(EngineState.PAUSED)).toBe(true);

    video.paused = false;
    engine._processEventFromVideo(NATIVE_EVENTS.SEEKED);
    expect(engine.setState.calledWith(EngineState.PLAYING)).toBe(true);
  });

  test('should dodge sneaky bug with dash manifest', () => {
    engine.setState(EngineState.METADATA_LOADED);
    engine.setState(EngineState.SEEK_IN_PROGRESS);
    expect(engine.state).toBe(EngineState.METADATA_LOADED);
    engine.setState(EngineState.PAUSED);
    expect(engine.state).toBe(EngineState.METADATA_LOADED);
  });

  test('should collect timestamps', () => {
    engine._processEventFromVideo(NATIVE_EVENTS.LOAD_START);
    engine._processEventFromVideo(NATIVE_EVENTS.LOADED_META_DATA);
    engine._processEventFromVideo(NATIVE_EVENTS.CAN_PLAY);

    expect(Object.keys(engine.stateTimestamps)).toEqual([
      'engine-state/metadata-loaded',
      'engine-state/ready-to-play',
    ]);
  });

  test('should do nothing if event is not in list', () => {
    engine._processEventFromVideo();
    expect(eventEmitter.emitAsync.called).toBe(false);
  });
});
