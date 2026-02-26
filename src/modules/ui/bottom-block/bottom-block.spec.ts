import createPlayerTestkit from '../../../testkit';

describe('BottomBlock', () => {
  let testkit;
  let controls: any;

  beforeEach(() => {
    testkit = createPlayerTestkit();

    controls = testkit.getModule('bottomBlock');
  });
  describe('constructor', () => {
    it('should create instance ', () => {
      expect(controls).toBeDefined();
      expect(controls.view).toBeDefined();
    });
  });

  describe('instance', () => {
    it('should have method for setting controls focused state', () => {
      expect(controls._setFocusState).toBeDefined();
      controls._setFocusState();
      expect(controls._isBlockFocused).toBe(true);
    });

    it('should have method for removing controls focused state', () => {
      expect(controls._removeFocusState).toBeDefined();
      controls._setFocusState();
      controls._removeFocusState({
        stopPropagation: () => {},
      });
      expect(controls._isBlockFocused).toBe(false);
    });
  });

  describe('API', () => {
    it('should have method for showing whole view', () => {
      expect(controls.show).toBeDefined();
      controls.show();
      expect(controls.isHidden).toBe(false);
    });

    it('should have method for hiding whole view', () => {
      expect(controls.hide).toBeDefined();
      controls.hide();
      expect(controls.isHidden).toBe(true);
    });

    it('should have method for destroying', () => {
      expect(controls.destroy).toBeDefined();
      controls.destroy();
    });
  });

  describe('View', () => {
    it('should have method for showing block with controls', () => {
      expect(controls.view.showContent).toBeDefined();
    });

    it('should have method for hiding block with controls', () => {
      expect(controls.view.hideContent).toBeDefined();
    });

    it('should have method for showing itself', () => {
      expect(controls.view.show).toBeDefined();
    });

    it('should have method for hiding itself', () => {
      expect(controls.view.hide).toBeDefined();
    });

    it('should have method gettind root node', () => {
      expect(controls.view.getElement).toBeDefined();
    });

    it('should have method for destroying', () => {
      expect(controls.view.destroy).toBeDefined();
    });
  });
});
