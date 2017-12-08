import 'jsdom-global/register';

import { expect } from 'chai';
import * as sinon from 'sinon';

import EventEmitter from '../../event-emitter/event-emitter';
import RootContainer from '../../root-container/root-container.controler';
import Engine from '../../playback-engine/playback-engine';
import ManipulationIndicator from '../manipulation-indicator/manipulation-indicator.controler';
import Screen from '../screen/screen.controler';
import Title from './title';

import { UI_EVENTS } from '../../../constants';
import { describe } from 'selenium-webdriver/testing';

describe('Title', () => {
  let config = {};
  let engine;
  let eventEmitter;
  let rootContainer;
  let fullScreenManager;
  let manipulationIndicator;
  let screen;
  let title: Title;

  beforeEach(() => {
    eventEmitter = new EventEmitter();
    engine = new Engine({
      config,
      eventEmitter,
    });
    rootContainer = new RootContainer({
      config,
      eventEmitter,
      engine,
    });
    manipulationIndicator = new ManipulationIndicator({
      eventEmitter: eventEmitter,
      engine: engine,
    });
    screen = new Screen({
      config: config,
      eventEmitter: eventEmitter,
      engine: engine,
      fullScreenManager: fullScreenManager,
      manipulationIndicator: manipulationIndicator,
      rootContainer: rootContainer,
    });

    title = new Title({
      config: {},
      rootContainer: rootContainer,
      screen: screen,
      eventEmitter: eventEmitter,
    });
  });

  describe('constructor', () => {
    it('should create instance ', () => {
      expect(title).to.exist;
      expect(title.view).to.exist;
    });
  });

  describe('instance', () => {
    it('should react on video control block show event', () => {
      const fadeInSpy = sinon.spy(title, '_fadeIn');
      title._bindEvents();

      eventEmitter.emit(UI_EVENTS.CONTROL_BLOCK_SHOW_TRIGGERED);

      expect(fadeInSpy.called).to.be.true;

      fadeInSpy.restore();
    });

    it('should react on video control block hide event', () => {
      const fadeOutSpy = sinon.spy(title, '_fadeOut');
      title._bindEvents();

      eventEmitter.emit(UI_EVENTS.CONTROL_BLOCK_HIDE_TRIGGERED);

      expect(fadeOutSpy.called).to.be.true;

      fadeOutSpy.restore();
    });

    it('should have method for showing title', () => {
      const viewShowSpy = sinon.spy(title.view, 'show');
      title.show();

      expect(viewShowSpy.called).to.be.true;
      expect(title.isHidden).to.be.false;

      viewShowSpy.restore();
    });

    it('should have method for hiding title', () => {
      const viewHideSpy = sinon.spy(title.view, 'hide');
      title.hide();

      expect(viewHideSpy.called).to.be.true;
      expect(title.isHidden).to.be.true;

      viewHideSpy.restore();
    });

    it('should have method for getting view node', () => {
      const getTitleViewNodeSpy = sinon.spy(title.view, 'getNode');
      const titleViewNode = title.node;

      expect(getTitleViewNodeSpy.called).to.be.true;
      expect(titleViewNode).to.equal(title.view.getNode());

      getTitleViewNodeSpy.restore();
    });
  });

  describe('API', () => {
    describe('setTitle method', () => {
      let titleViewSetTitleSpy;
      let titleViewHtmlSpy;
      let titleViewShowSpy;
      let titleViewHideSpy;

      beforeEach(() => {
        titleViewSetTitleSpy = sinon.spy(title.view, 'setTitle');
        titleViewHtmlSpy = sinon.spy(title.view.$title, 'html');
        titleViewShowSpy = sinon.spy(title.view, 'show');
        titleViewHideSpy = sinon.spy(title.view, 'hide');
      });

      afterEach(() => {
        titleViewSetTitleSpy.restore();
        titleViewHtmlSpy.restore();
        titleViewShowSpy.restore();
        titleViewHideSpy.restore();
      });

      it('should exists', () => {
        expect(title.setTitle).to.exist;
      });

      it('should set NOT EMPTY title', () => {
        const TITLE_TEXT = 'TITLE';

        title.setTitle(TITLE_TEXT);

        expect(titleViewSetTitleSpy.calledWith(TITLE_TEXT)).to.be.true;
        expect(titleViewHtmlSpy.calledWith(TITLE_TEXT)).to.be.true;
        expect(titleViewShowSpy.called).to.be.true;
      });

      it('should set EMPTY title', () => {
        title.setTitle('');

        expect(titleViewSetTitleSpy.calledWith('')).to.be.true;
        // TODO: should html be cleared if setTitle called with empty value?
        // expect(titleViewHtmlSpy.calledWith('')).to.be.true;
        expect(titleViewHideSpy.called).to.be.true;
      });
    });

    describe('setTitleClickCallback method', () => {
      let setViewDisplayAsLinkSpy;

      beforeEach(() => {
        setViewDisplayAsLinkSpy = sinon.spy(title.view, 'setDisplayAsLink');
      });

      afterEach(() => {
        setViewDisplayAsLinkSpy.restore();
      });

      it('should exists', () => {
        expect(title.setTitleClickCallback).to.exist;
      });

      it('should set NOT EMPTY callback', () => {
        const clickCallback = sinon.spy();

        title.setTitleClickCallback(clickCallback);

        title.view.$title.trigger('click');

        expect(setViewDisplayAsLinkSpy.calledWith(true)).to.be.true;
        expect(clickCallback.called).to.be.true;
      });

      it('should set EMPTY callback', () => {
        const clickCallback = sinon.spy();

        title.setTitleClickCallback(clickCallback);

        title.view.$title.trigger('click');

        title.setTitleClickCallback();

        title.view.$title.trigger('click');

        expect(setViewDisplayAsLinkSpy.lastCall.calledWith(false)).to.be.true;
        expect(clickCallback.calledOnce).to.be.true;
      });
    });
  });
});
