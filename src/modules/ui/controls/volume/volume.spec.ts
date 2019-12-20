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
    test('should create instance ', () => {
      expect(control).toBeDefined();
      expect(control.view).toBeDefined();
    });
  });

  describe('API', () => {
    test('should have method for setting current volume', () => {
      const spy = jest.spyOn(control.view, 'setVolume');
      control._setVolumeLevel(0);
      expect(spy).toHaveBeenCalled();
    });

    test('should have method for setting mute state', () => {
      const spy = jest.spyOn(control.view, 'setMute');
      control._setMuteState();
      expect(spy).toHaveBeenCalled();
    });

    test('should have method for showing whole view', () => {
      expect(control.show).toBeDefined();
      control.show();
      expect(control.isHidden).toBe(false);
    });

    test('should have method for hiding whole view', () => {
      expect(control.hide).toBeDefined();
      control.hide();
      expect(control.isHidden).toBe(true);
    });

    test('should have method for destroying', () => {
      const spy = jest.spyOn(control, '_unbindEvents');
      expect(control.destroy).toBeDefined();
      control.destroy();
      expect(spy).toHaveBeenCalled();
    });
  });

  describe('video events listeners', () => {
    test('should call callback on playback state change', async () => {
      const spy = jest.spyOn(control, '_updateSoundState');
      control._bindEvents();
      await eventEmitter.emitAsync(VideoEvent.SOUND_STATE_CHANGED);
      expect(spy).toHaveBeenCalled();
    });
  });

  describe('internal methods', () => {
    test('should change volume level based on wheel delta', () => {
      const startSpy = jest.spyOn(control, '_changeVolumeLevel');
      control._getVolumeLevelFromWheel(-100);
      expect(startSpy).toHaveBeenCalledWith(90);
    });

    test('should change volume level based on input', () => {
      const startSpy = jest.spyOn(control, '_changeVolumeLevel');
      control._getVolumeLevelFromInput(40);
      expect(startSpy).toHaveBeenCalledWith(40);
    });

    test('should change volume level and mute state of video', () => {
      const volumeSpy = jest.spyOn(control, '_changeVolumeLevel');

      const muteSpy = jest.spyOn(control, '_toggleMuteState');
      control._changeVolumeLevel(90);
      expect(volumeSpy).toHaveBeenCalledWith(90);
      expect(muteSpy).not.toHaveBeenCalled();
      control._engine.mute();
      control._changeVolumeLevel(90);
      expect(muteSpy).toHaveBeenCalled();
    });
  });
});
