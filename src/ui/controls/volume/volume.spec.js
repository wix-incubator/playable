import 'jsdom-global/register';

import { expect } from 'chai';
import sinon from 'sinon';

import VolumeControl from './volume.controler';


describe('VolumeControl', () => {
  let control = {};
  let onVolumeLevelChange = null;
  let onMuteStatusChange = null;

  describe('constructor', () => {
    beforeEach(() => {
      control = new VolumeControl({});
    });

    it('should create instance ', () => {
      expect(control).to.exists;
      expect(control.view).to.exists;
    });
  });

  describe('instance', () => {
    beforeEach(() => {
      onVolumeLevelChange = sinon.spy();
      onMuteStatusChange = sinon.spy();

      control = new VolumeControl({
        onVolumeLevelChange,
        onMuteStatusChange
      });
    });

    it('should react on volume range input change event when not muted', () => {
      const callback = sinon.spy(control, "_changeVolumeLevel");
      control._initEvents();

      control.setVolumeLevel(0.5);

      control.view.$input.trigger('change');
      expect(callback.called).to.be.true;
    });

    it('should react on volume range input input event', () => {
      const callback = sinon.spy(control, "_changeVolumeLevel");
      control._initEvents();

      control.setVolumeLevel(0.5);

      control.view.$input.trigger('input');
      expect(callback.called).to.be.true;
    });

    describe('._changeVolumeLevel', () => {
      it('should call volume change callback on trigger', () => {
        control.setVolumeLevel(0.5);

        control._changeVolumeLevel();

        expect(onVolumeLevelChange.called).to.be.true;
      });

      it('should call volume change and mute change callback on trigger if muted', () => {
        control.setVolumeLevel(0.5);
        control.isMuted = true;

        control._changeVolumeLevel();

        expect(onVolumeLevelChange.calledWith(0.5)).to.be.true;
        expect(onMuteStatusChange.calledWith(false)).to.be.true;
      });
    });

    it('should call callbacks on _changeVolumeLevel', () => {
      const whenIsMuteCallback = sinon.spy(control, "_changeVolumeLevel");
      control._initEvents();

      control.setVolumeLevel(0.3);
      control.isMuted = true;
      control.view.$input.trigger('change');

      expect(whenIsMuteCallback.called).to.be.true;
      expect(onVolumeLevelChange.calledWith(0.3)).to.be.true;
      expect(onMuteStatusChange.calledWith(false)).to.be.true;
    });

    it('should react on mute status input click event', () => {
      const callback = sinon.spy(control, "_changeMuteStatus");
      control._initEvents();

      control.view.$volumeIcon.trigger('click');
      expect(callback.called).to.be.true;
      expect(onMuteStatusChange.called).to.be.true;
    });

    it('should react on unmute status input click event', () => {
      const callback = sinon.spy(control, "_changeMuteStatus");
      control._initEvents();

      control.view.$volumeMutedIcon.trigger('click');
      expect(callback.called).to.be.true;
      expect(onMuteStatusChange.called).to.be.true;
    });

    it('should set mute state if volume is 0', () => {
      control.setVolumeLevel(0);
      expect(control.volumeLevel).to.be.equal(0);
      expect(onMuteStatusChange.called).to.be.true;
    });
  });

  describe('API', () => {
    beforeEach(() => {
      control = new VolumeControl({});
    });

    it('should have method for showing whole view', () => {
      expect(control.show).to.exist;
      control.show();
      expect(control.isHidden).to.be.false;
    });

    it('should have method for hiding whole view', () => {
      expect(control.hide).to.exist;
      control.hide();
      expect(control.isHidden).to.be.true;
    });
  });
});
