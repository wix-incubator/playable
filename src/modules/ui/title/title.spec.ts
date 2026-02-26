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
      expect(title).toBeDefined();
      expect(title.view).toBeDefined();
    });
  });

  describe('instance', () => {
    it('should have method for showing title', () => {
      const viewShowSpy = vi.spyOn(title.view, 'show');
      title.show();

      expect(viewShowSpy).toHaveBeenCalled();
      expect(title.isHidden).toBe(false);

      viewShowSpy.mockRestore();
    });

    it('should have method for hiding title', () => {
      const viewHideSpy = vi.spyOn(title.view, 'hide');
      title.hide();

      expect(viewHideSpy).toHaveBeenCalled();
      expect(title.isHidden).toBe(true);

      viewHideSpy.mockRestore();
    });

    it('should have method for getting view node', () => {
      const getTitleViewNodeSpy = vi.spyOn(title.view, 'getElement');
      const titleViewNode = title.getElement();

      expect(getTitleViewNodeSpy).toHaveBeenCalled();
      expect(titleViewNode).toBe(title.view.getElement());

      getTitleViewNodeSpy.mockRestore();
    });
  });

  describe('API', () => {
    describe('setTitle method', () => {
      let titleViewSetTitleSpy: any;
      let titleViewShowSpy: any;
      let titleViewHideSpy: any;

      beforeEach(() => {
        titleViewSetTitleSpy = vi.spyOn(title.view, 'setTitle');
        titleViewShowSpy = vi.spyOn(title.view, 'show');
        titleViewHideSpy = vi.spyOn(title.view, 'hide');
      });

      afterEach(() => {
        titleViewSetTitleSpy.mockRestore();
        titleViewShowSpy.mockRestore();
        titleViewHideSpy.mockRestore();
      });

      it('should exists', () => {
        expect(title.setTitle).toBeDefined();
      });

      it('should set NOT EMPTY title', () => {
        const TITLE_TEXT = 'TITLE';

        title.setTitle(TITLE_TEXT);

        expect(titleViewSetTitleSpy).toHaveBeenCalledWith(TITLE_TEXT);

        //@ts-ignore
        expect(title.view._$rootElement.innerHTML).toBe(TITLE_TEXT);
        expect(titleViewShowSpy).toHaveBeenCalled();
      });

      it('should set EMPTY title', () => {
        title.setTitle('');

        expect(titleViewSetTitleSpy).toHaveBeenCalledWith('');
        // TODO: should html be cleared if setTitle called with empty value?
        expect(titleViewHideSpy).toHaveBeenCalled();
      });
    });

    describe('setTitleClickCallback method', () => {
      let setViewDisplayAsLinkSpy: any;

      beforeEach(() => {
        setViewDisplayAsLinkSpy = vi.spyOn(title.view, 'setDisplayAsLink');
      });

      afterEach(() => {
        setViewDisplayAsLinkSpy.mockRestore();
      });

      it('should exists', () => {
        expect(title.setTitleClickCallback).toBeDefined();
      });

      it('should set NOT EMPTY callback', () => {
        const clickCallback = vi.fn();

        title.setTitleClickCallback(clickCallback);

        //@ts-ignore
        title.view._$rootElement.dispatchEvent(new Event('click'));

        expect(setViewDisplayAsLinkSpy).toHaveBeenCalledWith(true);
        expect(clickCallback).toHaveBeenCalled();
      });

      it('should set EMPTY callback', () => {
        const clickCallback = vi.fn();

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
