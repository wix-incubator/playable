import { expect } from 'chai';
import * as sinon from 'sinon';
import { EventEmitter } from 'eventemitter3';

import { VIDEO_EVENTS, EngineState } from '../../constants';
import StateEngine, { NATIVE_VIDEO_EVENTS_TO_STATE } from './state-engine';

import { setProperty, resetProperty } from '../../testkit';

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
  let video;
  let engine;
  let eventEmitter;

  beforeEach(() => {
    video = {
      addEventListener: sinon.spy(),
      removeEventListener: sinon.spy(),
      played: {
        length: 1,
      },
    };

    eventEmitter = new EventEmitter();
    sinon.spy(eventEmitter, 'emit');
    engine = new StateEngine(eventEmitter, video);
    sinon.spy(engine, 'setState');
  });

  afterEach(() => {
    resetProperty(navigator, 'userAgent');

    eventEmitter.emit.restore();
    engine.setState.restore();
  });

  it('should attach events to video tag on initialization', () => {
    expect(video.addEventListener.args.length).to.be.equal(
      NATIVE_VIDEO_EVENTS_TO_STATE.length,
    );
    video.addEventListener.args.forEach(arg => {
      expect(NATIVE_VIDEO_EVENTS_TO_STATE.indexOf(arg[0]) !== -1).to.be.true;
      expect(arg[1] === engine._processEventFromVideo).to.be.true;
    });
  });

  it('should detach events from video tag on destroy', () => {
    engine.destroy();
    expect(video.removeEventListener.args.length).to.be.equal(
      NATIVE_VIDEO_EVENTS_TO_STATE.length,
    );
    video.removeEventListener.args.forEach(arg => {
      expect(NATIVE_VIDEO_EVENTS_TO_STATE.indexOf(arg[0]) !== -1).to.be.true;
      expect(arg[1] === engine._processEventFromVideo).to.be.true;
    });
  });

  it('should have method for setting state', () => {
    expect(engine.setState).to.exist;

    engine._currentState = EngineState.LOAD_STARTED;
    engine.setState(EngineState.READY_TO_PLAY);
    expect(
      eventEmitter.emit.calledWith(VIDEO_EVENTS.STATE_CHANGED, {
        prevState: EngineState.LOAD_STARTED,
        nextState: EngineState.READY_TO_PLAY,
      }),
    );
    expect(engine._currentState).to.be.equal(EngineState.READY_TO_PLAY);
  });

  it('should not trigger change of state on same state', () => {
    engine.setState(EngineState.READY_TO_PLAY);
    expect(eventEmitter.emit.calledTwice).to.be.true;
    engine.setState(EngineState.READY_TO_PLAY);
    expect(eventEmitter.emit.calledTwice).to.be.true;
  });

  it('should set state on loadstart event', () => {
    engine._processEventFromVideo(NATIVE_EVENTS.LOAD_START);
    expect(engine.setState.calledWith(EngineState.LOAD_STARTED)).to.be.true;
  });

  it('should set state on loadedmetadata event', () => {
    expect(engine._isMetadataLoaded).to.be.false;
    engine._processEventFromVideo(NATIVE_EVENTS.LOADED_META_DATA);
    expect(engine.setState.calledWith(EngineState.METADATA_LOADED)).to.be.true;
    expect(engine.isMetadataLoaded).to.be.true;
  });

  it('should set state on canplay event', () => {
    engine._processEventFromVideo(NATIVE_EVENTS.CAN_PLAY);
    expect(engine.setState.calledWith(EngineState.READY_TO_PLAY)).to.be.true;
  });

  it('should set state on play event', () => {
    engine._processEventFromVideo(NATIVE_EVENTS.PLAY);
    expect(engine.setState.calledWith(EngineState.PLAY_REQUESTED)).to.be.true;
  });

  it('should set state on playing event', () => {
    engine._processEventFromVideo(NATIVE_EVENTS.PLAYING);
    expect(engine.setState.calledWith(EngineState.PLAYING)).to.be.true;
  });

  it('should not set state on playing event if video is not actually playing', () => {
    setProperty(navigator, 'userAgent', 'safari');
    video.paused = true;
    engine._processEventFromVideo(NATIVE_EVENTS.PLAYING);
    expect(engine.setState.calledWith(EngineState.PLAYING)).to.be.false;
  });

  it('should set state on waiting event', () => {
    engine._processEventFromVideo(NATIVE_EVENTS.WAITING);
    expect(engine.setState.calledWith(EngineState.WAITING)).to.be.true;
  });

  it('should set state on pause event', () => {
    engine._processEventFromVideo(NATIVE_EVENTS.PAUSE);
    expect(engine.setState.calledWith(EngineState.PAUSED)).to.be.true;
  });

  it('should not set state on pause event if there is no played chunks', () => {
    setProperty(navigator, 'userAgent', 'safari');
    video.played.length = 0;
    engine._processEventFromVideo(NATIVE_EVENTS.PAUSE);
    expect(engine.setState.calledWith(EngineState.PAUSED)).to.be.false;
  });

  it('should set state on ended event', () => {
    engine._processEventFromVideo(NATIVE_EVENTS.ENDED);
    expect(engine.setState.calledWith(EngineState.ENDED)).to.be.true;
  });

  it('should set state on seeking event', () => {
    engine._processEventFromVideo(NATIVE_EVENTS.SEEKING);
    expect(engine.setState.calledWith(EngineState.SEEK_IN_PROGRESS)).to.be.true;
  });

  it('should set state on seeked event', () => {
    video.paused = true;
    engine._processEventFromVideo(NATIVE_EVENTS.SEEKED);
    expect(engine.setState.calledWith(EngineState.PAUSED)).to.be.true;

    video.paused = false;
    engine._processEventFromVideo(NATIVE_EVENTS.SEEKED);
    expect(engine.setState.calledWith(EngineState.PLAYING)).to.be.true;
  });

  it('should dodge sneaky bug with dash manifest', () => {
    engine.setState(EngineState.METADATA_LOADED);
    engine.setState(EngineState.SEEK_IN_PROGRESS);
    expect(engine.state).to.be.equal(EngineState.METADATA_LOADED);
    engine.setState(EngineState.PAUSED);
    expect(engine.state).to.be.equal(EngineState.METADATA_LOADED);
  });

  it('should collect timestamps', () => {
    engine._processEventFromVideo(NATIVE_EVENTS.LOAD_START);
    engine._processEventFromVideo(NATIVE_EVENTS.LOADED_META_DATA);
    engine._processEventFromVideo(NATIVE_EVENTS.CAN_PLAY);

    expect(Object.keys(engine.stateTimestamps)).to.be.deep.equal([
      'engine-state/metadata-loaded',
      'engine-state/ready-to-play',
    ]);
  });

  it('should do nothing if event is not in list', () => {
    engine._processEventFromVideo();
    expect(eventEmitter.emit.called).to.be.false;
  });
});
