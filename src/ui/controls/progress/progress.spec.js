import 'jsdom-global/register';

import { expect } from 'chai';
import sinon from 'sinon';

import ProgressControl from './progress.controler';


describe('ProgressControl', () => {
  let control = {};
  let onProgressChange = null;

  describe('constructor', () => {
    beforeEach(() => {
      control = new ProgressControl({});
    });

    it('should create instance ', () => {
      expect(control).to.exists;
      expect(control.view).to.exists;
    });
  });

  describe('instance', () => {
    beforeEach(() => {
      onProgressChange = sinon.spy();

      control = new ProgressControl({
        onProgressChange
      });
    });

    it('should react on progress range input change event', () => {
      const callback = sinon.spy(control, "_changePlayedProgress");
      control._initEvents();

      control.view.$input.trigger('change');
      expect(callback.called).to.be.true;
    });

    it('should react on progress range input input event', () => {
      const callback = sinon.spy(control, "_changePlayedProgress");
      control._initEvents();

      control.view.$input.trigger('input');
      expect(callback.called).to.be.true;
    });

    it('should call volume change callback on trigger of _changePlayedProgress', () => {
      control._changePlayedProgress();
      expect(onProgressChange.called).to.be.true;
    });

    it('should react on progress range input mousedown event', () => {
      const callback = sinon.spy(control, "_toggleUserInteractingStatus");
      control._initEvents();

      control.view.$input.trigger('mousedown');
      expect(callback.called).to.be.true;
    });

    it('should react on progress range input mouseup event', () => {
      const callback = sinon.spy(control, "_toggleUserInteractingStatus");
      control._initEvents();

      control.view.$input.trigger('mouseup');
      expect(callback.called).to.be.true;
    });
  });

  describe('API', () => {
    beforeEach(() => {
      control = new ProgressControl({});
    });

    it('should have method for setting value for played', () => {
      const played = '10';
      expect(control.updatePlayed).to.exist;
      control.updatePlayed(played);
      expect(control.view.$input.val()).to.be.equal(played);
      expect(control.view.$played.attr('value')).to.be.equal(played);
    });

    it('should have method for setting value for buffered', () => {
      const buffered = '30';
      expect(control.updateBuffered).to.exist;
      control.updateBuffered(buffered);
      expect(control.view.$buffered.attr('value')).to.be.equal(buffered);
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
