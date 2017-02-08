import 'jsdom-global/register';

import { expect } from 'chai';
import sinon from 'sinon';

import PlayControl from './play.controler';


describe('PlayControl', () => {
  let control = {};
  let onPlayClick = null;
  let onPauseClick = null;

  describe('constructor', () => {
    beforeEach(() => {
      control = new PlayControl({});
    });

    it('should create instance ', () => {
      expect(control).to.exists;
      expect(control.view).to.exists;
    });
  });

  describe('instance', () => {
    beforeEach(() => {
      onPlayClick = sinon.spy();
      onPauseClick = sinon.spy();

      control = new PlayControl({
        onPlayClick,
        onPauseClick
      });
    });

    it('should react on play input click event', () => {
      control.view.$playIcon.trigger('click');
      expect(onPlayClick.called).to.be.true;
    });

    it('should react on pause input click event', () => {
      control.view.$pauseIcon.trigger('click');
      expect(onPauseClick.called).to.be.true;
    });
  });
});
