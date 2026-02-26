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
    it('should create instance ', () => {
      expect(control).toBeDefined();
      expect(control.view).toBeDefined();
    });
  });

  describe('API', () => {
    it('should have method for destroying', () => {
      const spy = vi.spyOn(control, '_unbindEvents');
      expect(control.destroy).toBeDefined();
      control.destroy();
      expect(spy).toHaveBeenCalled();
    });
  });

  describe('video events listeners', () => {
    it('should call callback on playback state change', async function() {
      const spy = vi.spyOn(control, '_updatePlayingState');
      control._bindEvents();
      await eventEmitter.emitAsync(VideoEvent.STATE_CHANGED, {});
      expect(spy).toHaveBeenCalled();
    });
  });

  describe('internal methods', () => {
    it('should change playback state', () => {
      const playSpy = vi.spyOn(control._engine, 'play');
      const pauseSpy = vi.spyOn(control._engine, 'pause');
      control._playVideo();
      expect(playSpy).toHaveBeenCalled();
      control._pauseVideo();
      expect(pauseSpy).toHaveBeenCalled();
      control._engine.play.mockRestore();
      control._engine.pause.mockRestore();
    });
  });
});
