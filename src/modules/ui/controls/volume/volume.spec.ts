import * as sinon from 'sinon';

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
      const spy = sinon.spy(control.view, 'setVolume');
      control._setVolumeLevel(0);
      expect(spy.called).toBe(true);
    });

    test('should have method for setting mute state', () => {
      const spy = sinon.spy(control.view, 'setMute');
      control._setMuteState();
      expect(spy.called).toBe(true);
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
      const spy = sinon.spy(control, '_unbindEvents');
      expect(control.destroy).toBeDefined();
      control.destroy();
      expect(spy.called).toBe(true);
    });
  });

  describe('video events listeners', () => {
    test('should call callback on playback state change', async () => {
      const spy = sinon.spy(control, '_updateSoundState');
      control._bindEvents();
      await eventEmitter.emitAsync(VideoEvent.SOUND_STATE_CHANGED);
      expect(spy.called).toBe(true);
    });
  });

  describe('internal methods', () => {
    test('should change volume level based on wheel delta', () => {
      const startSpy: sinon.SinonSpy = sinon.spy(control, '_changeVolumeLevel');
      control._getVolumeLevelFromWheel(-100);
      expect(startSpy.calledWith(90)).toBe(true);
    });

    test('should change volume level based on input', () => {
      const startSpy: sinon.SinonSpy = sinon.spy(control, '_changeVolumeLevel');
      control._getVolumeLevelFromInput(40);
      expect(startSpy.calledWith(40)).toBe(true);
    });

    test('should change volume level and mute state of video', () => {
      const volumeSpy: sinon.SinonSpy = sinon.spy(
        control,
        '_changeVolumeLevel',
      );

      const muteSpy: sinon.SinonSpy = sinon.spy(control, '_toggleMuteState');
      control._changeVolumeLevel(90);
      expect(volumeSpy.calledWith(90)).toBe(true);
      expect(muteSpy.called).toBe(false);
      control._engine.mute();
      control._changeVolumeLevel(90);
      expect(muteSpy.called).toBe(true);
    });
  });
});
