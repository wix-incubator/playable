import createPlayerTestkit from '../../../../testkit';

import VolumeControl from './volume';

import { VideoEvent } from '../../../../constants';

describe('VolumeControl', () => {
  let testkit;
  let control: any;
  let eventEmitter: any;

  beforeEach(() => {
    testkit = createPlayerTestkit();

    testkit.registerModule('volumeControl', VolumeControl);
    control = testkit.getModule('volumeControl');
    eventEmitter = testkit.getModule('eventEmitter');
  });

  describe('constructor', () => {
    it('should create instance ', () => {
      expect(control).toBeDefined();
      expect(control.view).toBeDefined();
    });
  });

  describe('API', () => {
    it('should have method for setting current volume', () => {
      const spy = vi.spyOn(control.view, 'setVolume');
      control._setVolumeLevel(0);
      expect(spy).toHaveBeenCalled();
    });

    it('should have method for setting mute state', () => {
      const spy = vi.spyOn(control.view, 'setMute');
      control._setMuteState();
      expect(spy).toHaveBeenCalled();
    });

    it('should have method for showing whole view', () => {
      expect(control.show).toBeDefined();
      control.show();
      expect(control.isHidden).toBe(false);
    });

    it('should have method for hiding whole view', () => {
      expect(control.hide).toBeDefined();
      control.hide();
      expect(control.isHidden).toBe(true);
    });

    it('should have method for destroying', () => {
      const spy = vi.spyOn(control, '_unbindEvents');
      expect(control.destroy).toBeDefined();
      control.destroy();
      expect(spy).toHaveBeenCalled();
    });
  });

  describe('video events listeners', () => {
    it('should call callback on playback state change', async function() {
      const spy = vi.spyOn(control, '_updateSoundState');
      control._bindEvents();
      await eventEmitter.emitAsync(VideoEvent.SOUND_STATE_CHANGED);
      expect(spy).toHaveBeenCalled();
    });
  });

  describe('internal methods', () => {
    it('should change volume level based on wheel delta', () => {
      const startSpy: ReturnType<typeof vi.fn> = vi.spyOn(
        control,
        '_changeVolumeLevel',
      );
      control._getVolumeLevelFromWheel(-100);
      expect(startSpy).toHaveBeenCalledWith(90);
    });

    it('should change volume level based on input', () => {
      const startSpy: ReturnType<typeof vi.fn> = vi.spyOn(
        control,
        '_changeVolumeLevel',
      );
      control._getVolumeLevelFromInput(40);
      expect(startSpy).toHaveBeenCalledWith(40);
    });

    it('should change volume level and mute state of video', () => {
      const volumeSpy: ReturnType<typeof vi.fn> = vi.spyOn(
        control,
        '_changeVolumeLevel',
      );

      const muteSpy: ReturnType<typeof vi.fn> = vi.spyOn(
        control,
        '_toggleMuteState',
      );
      control._changeVolumeLevel(90);
      expect(volumeSpy).toHaveBeenCalledWith(90);
      expect(muteSpy).not.toHaveBeenCalled();
      control._engine.mute();
      control._changeVolumeLevel(90);
      expect(muteSpy).toHaveBeenCalled();
    });
  });
});
