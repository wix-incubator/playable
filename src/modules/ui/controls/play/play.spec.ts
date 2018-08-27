import 'jsdom-global/register';
import { expect } from 'chai';
//@ts-ignore
import * as sinon from 'sinon';

import createPlayerTestkit from '../../../../testkit';

import { VIDEO_EVENTS, EngineState } from '../../../../constants';

describe('PlayControl', () => {
  let testkit;
  let control: any;
  let eventEmitter: any;

  beforeEach(() => {
    testkit = createPlayerTestkit();
    eventEmitter = testkit.getModule('eventEmitter');
    control = testkit.getModule('playControl');
  });

  describe('constructor', () => {
    it('should create instance ', () => {
      expect(control).to.exist;
      expect(control.view).to.exist;
    });
  });

  describe('API', () => {
    it('should have method for setting playback state', () => {
      const spy = sinon.spy(control.view, 'setPlayingState');
      control._setPlaybackState();
      expect(spy.called).to.be.true;
    });

    it('should have method for destroying', () => {
      const spy = sinon.spy(control, '_unbindEvents');
      expect(control.destroy).to.exist;
      control.destroy();
      expect(control.view).to.not.exist;
      expect(control._eventEmitter).to.not.exist;
      expect(spy.called).to.be.true;
    });
  });

  describe('video events listeners', () => {
    it('should call callback on playback state change', () => {
      const spy = sinon.spy(control, '_updatePlayingState');
      control._bindEvents();
      eventEmitter.emit(VIDEO_EVENTS.STATE_CHANGED, {});
      expect(spy.called).to.be.true;
    });
  });

  describe('internal methods', () => {
    it('should change view based on playback state', () => {
      const spy = sinon.spy(control, '_setPlaybackState');
      control._updatePlayingState({ nextState: EngineState.PLAYING });
      expect(spy.calledWith(true)).to.be.true;
      control._updatePlayingState({ nextState: EngineState.PAUSED });
      expect(spy.calledWith(false)).to.be.true;
    });

    it('should change playback state', () => {
      const playSpy = sinon.stub(control._engine, 'play');
      const pauseSpy = sinon.stub(control._engine, 'pause');
      control._playVideo();
      expect(playSpy.called).to.be.true;
      control._pauseVideo();
      expect(pauseSpy.called).to.be.true;
      control._engine.play.restore();
      control._engine.pause.restore();
    });
  });
});
