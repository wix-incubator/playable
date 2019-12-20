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
      const viewShowSpy = jest.spyOn(title.view, 'show');
      title.show();

      expect(viewShowSpy).toHaveBeenCalled();
      expect(title.isHidden).toBe(false);

      viewShowSpy.mockRestore();
    });

    test('should have method for hiding title', () => {
      const viewHideSpy = jest.spyOn(title.view, 'hide');
      title.hide();

      expect(viewHideSpy).toHaveBeenCalled();
      expect(title.isHidden).toBe(true);

      viewHideSpy.mockRestore();
    });

    test('should have method for getting view node', () => {
      const getTitleViewNodeSpy = jest.spyOn(title.view, 'getElement');
      const titleViewNode = title.getElement();

      expect(getTitleViewNodeSpy).toHaveBeenCalled();
      expect(titleViewNode).toBe(title.view.getElement());

      getTitleViewNodeSpy.mockRestore();
    });
  });

  describe('API', () => {
    describe('setTitle method', () => {
      let titleViewSetTitleSpy: jest.SpyInstance;
      let titleViewShowSpy: jest.SpyInstance;
      let titleViewHideSpy: jest.SpyInstance;

      beforeEach(() => {
        titleViewSetTitleSpy = jest.spyOn(title.view, 'setTitle');
        titleViewShowSpy = jest.spyOn(title.view, 'show');
        titleViewHideSpy = jest.spyOn(title.view, 'hide');
      });

      afterEach(() => {
        titleViewSetTitleSpy.mockRestore();
        titleViewShowSpy.mockRestore();
        titleViewHideSpy.mockRestore();
      });

      test('should exists', () => {
        expect(title.setTitle).toBeDefined();
      });

      test('should set NOT EMPTY title', () => {
        const TITLE_TEXT = 'TITLE';

        title.setTitle(TITLE_TEXT);

        expect(titleViewSetTitleSpy).toHaveBeenCalledWith(TITLE_TEXT);

        //@ts-ignore
        expect(title.view._$rootElement.innerHTML).toBe(TITLE_TEXT);
        expect(titleViewShowSpy).toHaveBeenCalled();
      });

      test('should set EMPTY title', () => {
        title.setTitle('');

        expect(titleViewSetTitleSpy).toHaveBeenCalledWith('');
        // TODO: should html be cleared if setTitle called with empty value?
        expect(titleViewHideSpy).toHaveBeenCalled();
      });
    });

    describe('setTitleClickCallback method', () => {
      let setViewDisplayAsLinkSpy: any;

      beforeEach(() => {
        setViewDisplayAsLinkSpy = jest.spyOn(title.view, 'setDisplayAsLink');
      });

      afterEach(() => {
        setViewDisplayAsLinkSpy.mockRestore();
      });

      test('should exists', () => {
        expect(title.setTitleClickCallback).toBeDefined();
      });

      test('should set NOT EMPTY callback', () => {
        const clickCallback = jest.fn();

        title.setTitleClickCallback(clickCallback);

        //@ts-ignore
        title.view._$rootElement.dispatchEvent(new Event('click'));

        expect(setViewDisplayAsLinkSpy).toHaveBeenCalledWith(true);
        expect(clickCallback).toHaveBeenCalled();
      });

      test('should set EMPTY callback', () => {
        const clickCallback = jest.fn();

        title.setTitleClickCallback(clickCallback);

        //@ts-ignore
        title.view._$rootElement.dispatchEvent(new Event('click'));

        title.setTitleClickCallback();

        //@ts-ignore
        title.view._$rootElement.dispatchEvent(new Event('click'));

        expect(setViewDisplayAsLinkSpy).toHaveBeenLastCalledWith(false);
        expect(clickCallback).toHaveBeenCalledTimes(1);
      });
    });
  });
});
