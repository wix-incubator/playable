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
    test('should create instance ', () => {
      expect(title).toBeDefined();
      expect(title.view).toBeDefined();
    });
  });

  describe('instance', () => {
    test('should have method for showing title', () => {
      const viewShowSpy = sinon.spy(title.view, 'show');
      title.show();

      expect(viewShowSpy.called).toBe(true);
      expect(title.isHidden).toBe(false);

      viewShowSpy.restore();
    });

    test('should have method for hiding title', () => {
      const viewHideSpy = sinon.spy(title.view, 'hide');
      title.hide();

      expect(viewHideSpy.called).toBe(true);
      expect(title.isHidden).toBe(true);

      viewHideSpy.restore();
    });

    test('should have method for getting view node', () => {
      const getTitleViewNodeSpy = sinon.spy(title.view, 'getElement');
      const titleViewNode = title.getElement();

      expect(getTitleViewNodeSpy.called).toBe(true);
      expect(titleViewNode).toBe(title.view.getElement());

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

      test('should exists', () => {
        expect(title.setTitle).toBeDefined();
      });

      test('should set NOT EMPTY title', () => {
        const TITLE_TEXT = 'TITLE';

        title.setTitle(TITLE_TEXT);

        expect(titleViewSetTitleSpy.calledWith(TITLE_TEXT)).toBe(true);

        //@ts-ignore
        expect(title.view._$rootElement.innerHTML).toBe(TITLE_TEXT);
        expect(titleViewShowSpy.called).toBe(true);
      });

      test('should set EMPTY title', () => {
        title.setTitle('');

        expect(titleViewSetTitleSpy.calledWith('')).toBe(true);
        // TODO: should html be cleared if setTitle called with empty value?
        expect(titleViewHideSpy.called).toBe(true);
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

      test('should exists', () => {
        expect(title.setTitleClickCallback).toBeDefined();
      });

      test('should set NOT EMPTY callback', () => {
        const clickCallback = sinon.spy();

        title.setTitleClickCallback(clickCallback);

        //@ts-ignore
        title.view._$rootElement.dispatchEvent(new Event('click'));

        expect(setViewDisplayAsLinkSpy.calledWith(true)).toBe(true);
        expect(clickCallback.called).toBe(true);
      });

      test('should set EMPTY callback', () => {
        const clickCallback = sinon.spy();

        title.setTitleClickCallback(clickCallback);

        //@ts-ignore
        title.view._$rootElement.dispatchEvent(new Event('click'));

        title.setTitleClickCallback();

        //@ts-ignore
        title.view._$rootElement.dispatchEvent(new Event('click'));

        expect(setViewDisplayAsLinkSpy.lastCall.calledWith(false)).toBe(true);
        expect(clickCallback.calledOnce).toBe(true);
      });
    });
  });
});
