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
      const spy = jest.spyOn(control, '_unbindEvents');
      expect(control.destroy).toBeDefined();
      control.destroy();
      expect(spy).toHaveBeenCalled();
    });
  });

  describe('video events listeners', () => {
    test('should call callback on playback state change', async () => {
      const spy = jest.spyOn(control, '_updatePlayingState');
      control._bindEvents();
      await eventEmitter.emitAsync(VideoEvent.STATE_CHANGED, {});
      expect(spy).toHaveBeenCalled();
    });
  });

  describe('internal methods', () => {
    test('should change playback state', () => {
      const playSpy = jest.spyOn(control._engine, 'play');
      const pauseSpy = jest.spyOn(control._engine, 'pause');
      control._playVideo();
      expect(playSpy).toHaveBeenCalled();
      control._pauseVideo();
      expect(pauseSpy).toHaveBeenCalled();
      control._engine.play.mockRestore();
      control._engine.pause.mockRestore();
    });
  });
});
