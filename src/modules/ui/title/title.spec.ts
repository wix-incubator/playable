import 'jsdom-global/register';

import { expect } from 'chai';
import * as sinon from 'sinon';

import createPlayerTestkit from '../../../testkit';

import Title from './title';

describe('Title', () => {
  let testkit;
  // let eventEmitter;
  let title: Title;

  beforeEach(() => {
    testkit = createPlayerTestkit();
    title = testkit.getModule('title');
    // eventEmitter = testkit.getModule('eventEmitter');
  });

  describe('constructor', () => {
    it('should create instance ', () => {
      expect(title).to.exist;
      expect(title.view).to.exist;
    });
  });

  describe('instance', () => {
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
      const getTitleViewNodeSpy = sinon.spy(title.view, 'getElement');
      const titleViewNode = title.getElement();

      expect(getTitleViewNodeSpy.called).to.be.true;
      expect(titleViewNode).to.equal(title.view.getElement());

      getTitleViewNodeSpy.restore();
    });
  });

  describe('API', () => {
    describe('setTitle method', () => {
      let titleViewSetTitleSpy: any;
      let titleViewShowSpy: any;
      let titleViewHideSpy: any;

      beforeEach(() => {
        titleViewSetTitleSpy = sinon.spy(title.view, 'setTitle');
        titleViewShowSpy = sinon.spy(title.view, 'show');
        titleViewHideSpy = sinon.spy(title.view, 'hide');
      });

      afterEach(() => {
        titleViewSetTitleSpy.restore();
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
        //@ts-ignore
        expect(title.view._$rootElement.innerHTML).to.equal(TITLE_TEXT);
        expect(titleViewShowSpy.called).to.be.true;
      });

      it('should set EMPTY title', () => {
        title.setTitle('');

        expect(titleViewSetTitleSpy.calledWith('')).to.be.true;
        // TODO: should html be cleared if setTitle called with empty value?
        expect(titleViewHideSpy.called).to.be.true;
      });
    });

    describe('setTitleClickCallback method', () => {
      let setViewDisplayAsLinkSpy: any;

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

        //@ts-ignore
        title.view._$rootElement.dispatchEvent(new Event('click'));

        expect(setViewDisplayAsLinkSpy.calledWith(true)).to.be.true;
        expect(clickCallback.called).to.be.true;
      });

      it('should set EMPTY callback', () => {
        const clickCallback = sinon.spy();

        title.setTitleClickCallback(clickCallback);

        //@ts-ignore
        title.view._$rootElement.dispatchEvent(new Event('click'));

        title.setTitleClickCallback();

        //@ts-ignore
        title.view._$rootElement.dispatchEvent(new Event('click'));

        expect(setViewDisplayAsLinkSpy.lastCall.calledWith(false)).to.be.true;
        expect(clickCallback.calledOnce).to.be.true;
      });
    });
  });
});
