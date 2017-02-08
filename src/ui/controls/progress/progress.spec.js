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
      expect(onProgressChange.called).to.be.true;
    });

    it('should react on progress range input input event', () => {
      const callback = sinon.spy(control, "_changePlayedProgress");
      control._initEvents();

      control.view.$input.trigger('input');
      expect(callback.called).to.be.true;
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
});
