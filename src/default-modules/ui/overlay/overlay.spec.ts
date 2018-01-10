import 'jsdom-global/register';

import { expect } from 'chai';
import * as sinon from 'sinon';

import EventEmitter from '../../event-emitter/event-emitter';
import RootContainer from '../../root-container/root-container.controler';
import Overlay from './overlay.controler';
import Engine from '../../playback-engine/playback-engine';

import { VIDEO_EVENTS, UI_EVENTS, STATES } from '../../../constants/index';
import { createStyleSheet } from '../../../theme';

describe('Overlay', () => {
  let overlay: any = {};
  let engine: any = {};
  let eventEmitter: any = {};
  let rootContainer: any;
  let eventEmitterSpy: any = null;
  let config: any = {};
  let theme: any = {};

  beforeEach(() => {
    config = {
      ui: {},
    };
    theme = createStyleSheet();
    eventEmitter = new EventEmitter();
    engine = new Engine({
      eventEmitter,
      config,
    });
    rootContainer = new RootContainer({
      eventEmitter,
      engine,
      config,
    });
  });

  describe('constructor', () => {
    beforeEach(() => {
      overlay = new Overlay({
        engine,
        eventEmitter,
        rootContainer,
        config,
        theme,
      });
    });

    it('should create instance ', () => {
      expect(overlay).to.exist;
      expect(overlay.view).to.exist;
    });

    it('should create instance with custom view if passed', () => {
      config.overlay = {
        view: sinon.spy(() => {
          return {
            getNode: () => {},
            hide: () => {},
            show: () => {},
          };
        }),
      };

      overlay = new Overlay({
        engine,
        config,
        rootContainer,
        eventEmitter,
        theme,
      });

      expect(config.overlay.view.calledWithNew()).to.be.true;
    });
  });

  describe('instance callbacks to controls', () => {
    beforeEach(() => {
      overlay = new Overlay({
        engine,
        eventEmitter,
        rootContainer,
        config: {
          ui: {
            poster: 'test',
          },
        },
        theme,
      });

      eventEmitterSpy = sinon.spy(overlay._eventEmitter, 'emit');
    });

    afterEach(() => {
      overlay._eventEmitter.emit.restore();
    });

    it('should emit ui event on play', () => {
      const callback = sinon.spy(overlay._engine, 'play');

      overlay._playVideo();

      expect(callback.called).to.be.true;
      expect(eventEmitterSpy.calledWith(UI_EVENTS.PLAY_OVERLAY_TRIGGERED)).to.be
        .true;

      overlay._engine.play.restore();
    });
  });

  describe('instance', () => {
    beforeEach(() => {
      overlay = new Overlay({
        engine,
        eventEmitter,
        rootContainer,
        config,
        theme,
      });
    });

    it('should react on video playback status changed on play', () => {
      const callback = sinon.spy(overlay, '_updatePlayingStatus');
      const hideSpy = sinon.spy(overlay, '_hideContent');
      overlay._bindEvents();

      eventEmitter.emit(VIDEO_EVENTS.STATE_CHANGED, {
        nextState: STATES.PLAY_REQUESTED,
      });

      expect(callback.called).to.be.true;
      expect(hideSpy.called).to.be.true;
    });

    it('should react on video playback status changed on end', () => {
      const callback = sinon.spy(overlay, '_updatePlayingStatus');
      const showSpy = sinon.spy(overlay, '_showContent');
      overlay._bindEvents();

      eventEmitter.emit(VIDEO_EVENTS.STATE_CHANGED, {
        nextState: STATES.ENDED,
      });

      expect(callback.called).to.be.true;
      expect(showSpy.called).to.be.true;
    });
  });

  describe('API', () => {
    beforeEach(() => {
      overlay = new Overlay({
        engine,
        eventEmitter,
        rootContainer,
        config,
        theme,
      });
    });

    it('should have method for setting src of background image', () => {
      const src = 'test';
      expect(overlay.setPoster).to.exist;
      const cssSpy = sinon.spy(overlay.view.$content, 'css');
      overlay.setPoster(src);
      expect(cssSpy.calledWith('background-image', `url('${src}')`)).to.be.true;
    });

    it('should have method for getting view node', () => {
      const getNodeSpy = sinon.spy(overlay.view, 'getNode');
      overlay.node;
      expect(getNodeSpy.called).to.be.true;
    });
  });
});
