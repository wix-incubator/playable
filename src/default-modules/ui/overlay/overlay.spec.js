import 'jsdom-global/register';

import { expect } from 'chai';
import sinon from 'sinon';

import EventEmitter from '../../event-emitter/event-emitter';
import RootContainer from '../../root-container/root-container.controler';
import Overlay from './overlay.controler';
import Engine from '../../playback-engine/playback-engine';

import { VIDEO_EVENTS, UI_EVENTS, STATES } from '../../../constants/index';


describe('Overlay', () => {
  let overlay = {};
  let engine = {};
  let eventEmitter = {};
  let rootContainer;
  let eventEmitterSpy = null;
  let config = {};

  beforeEach(() => {
    config = {
      ui: {}
    };
    eventEmitter = new EventEmitter();
    engine = new Engine({
      eventEmitter,
      config
    });
    rootContainer = new RootContainer({
      eventEmitter,
      engine,
      config
    })
  });

  describe('constructor', () => {
    beforeEach(() => {
      overlay = new Overlay({
        engine,
        eventEmitter,
        rootContainer,
        config
      });
    });

    it('should create instance ', () => {
      expect(overlay).to.exists;
      expect(overlay.view).to.exists;
    });

    it('should create instance with custom view if passed', () => {
      config.ui.overlay = {
        view: sinon.spy(() => {
          return {
            getNode: () => {},
            hide: () => {},
            show: () => {}
          }
        })
      };

      overlay = new Overlay({
        engine,
        config,
        rootContainer,
        eventEmitter
      });

      expect(config.ui.overlay.view.calledWithNew()).to.be.true;
    });
  });

  describe('instance callbacks to controls', () => {
    beforeEach(() => {
      overlay = new Overlay({
        engine,
        eventEmitter,
        rootContainer,
        config: {
          ui:{
            poster: 'test'
          }
        }
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
      expect(eventEmitterSpy.calledWith(UI_EVENTS.PLAY_OVERLAY_TRIGGERED)).to.be.true;

      overlay._engine.play.restore();
    });
  });

  describe('instance', () => {
    beforeEach(() => {
      overlay = new Overlay({
        engine,
        eventEmitter,
        rootContainer,
        config
      });
    });

    it('should react on video playback status changed on play', () => {
      const callback = sinon.spy(overlay, "_updatePlayingStatus");
      const hideSpy = sinon.spy(overlay, "_hideContent");
      overlay._bindEvents();

      eventEmitter.emit(VIDEO_EVENTS.STATE_CHANGED, { nextState: STATES.PLAY_REQUESTED });

      expect(callback.called).to.be.true;
      expect(hideSpy.called).to.be.true;
    });

    it('should react on video playback status changed on end', () => {
      const callback = sinon.spy(overlay, "_updatePlayingStatus");
      const showSpy = sinon.spy(overlay, "_showContent");
      overlay._bindEvents();

      eventEmitter.emit(VIDEO_EVENTS.STATE_CHANGED, { nextState: STATES.ENDED });

      expect(callback.called).to.be.true;
      expect(showSpy.called).to.be.true;
    });


    it('should set hide content state on method call', () => {
      expect(overlay.isContentHidden).to.be.false;
      overlay._hideContent();
      expect(overlay.isContentHidden).to.be.true;
      overlay._showContent();
      expect(overlay.isContentHidden).to.be.false;
    })
  });

  describe('API', () => {
    beforeEach(() => {
      overlay = new Overlay({
        engine,
        eventEmitter,
        rootContainer,
        config
      });
    });

    it('should have method for setting src of background image', () => {
      const src = 'test';
      expect(overlay.setBackgroundSrc).to.exist;
      const cssSpy = sinon.spy(overlay.view.$content, 'css');
      overlay.setBackgroundSrc(src);
      expect(cssSpy.calledWith('background-image', `url('${src}')`)).to.be.true;
    });

    it('should have method for getting view node', () => {
      const getNodeSpy = sinon.spy(overlay.view, 'getNode');
      overlay.node;
      expect(getNodeSpy.called).to.be.true;
    });

  });
});
