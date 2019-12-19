import * as sinon from 'sinon';

import createPlayerTestkit from '../../../../testkit';

import { VideoEvent } from '../../../../constants';

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
    test('should create instance ', () => {
      expect(control).toBeDefined();
      expect(control.view).toBeDefined();
    });
  });

  describe('API', () => {
    test('should have method for destroying', () => {
      const spy = sinon.spy(control, '_unbindEvents');
      expect(control.destroy).toBeDefined();
      control.destroy();
      expect(spy.called).toBe(true);
    });
  });

  describe('video events listeners', () => {
    test('should call callback on playback state change', async () => {
      const spy = sinon.spy(control, '_updatePlayingState');
      control._bindEvents();
      await eventEmitter.emitAsync(VideoEvent.STATE_CHANGED, {});
      expect(spy.called).toBe(true);
    });
  });

  describe('internal methods', () => {
    test('should change playback state', () => {
      const playSpy = sinon.stub(control._engine, 'play');
      const pauseSpy = sinon.stub(control._engine, 'pause');
      control._playVideo();
      expect(playSpy.called).toBe(true);
      control._pauseVideo();
      expect(pauseSpy.called).toBe(true);
      control._engine.play.restore();
      control._engine.pause.restore();
    });
  });
});
