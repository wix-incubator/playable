import createPlayerTestkit from '../../../testkit';

describe('BottomBlock', () => {
  let testkit;
  let controls: any;

  beforeEach(() => {
    testkit = createPlayerTestkit();

    controls = testkit.getModule('bottomBlock');
  });
  describe('constructor', () => {
    test('should create instance ', () => {
      expect(controls).toBeDefined();
      expect(controls.view).toBeDefined();
    });
  });

  describe('instance', () => {
    test('should have method for setting controls focused state', () => {
      expect(controls._setFocusState).toBeDefined();
      controls._setFocusState();
      expect(controls._isBlockFocused).toBe(true);
    });

    test('should have method for removing controls focused state', () => {
      expect(controls._removeFocusState).toBeDefined();
      controls._setFocusState();
      controls._removeFocusState({
        stopPropagation: () => {},
      });
      expect(controls._isBlockFocused).toBe(false);
    });
  });

  describe('API', () => {
    test('should have method for showing whole view', () => {
      expect(controls.show).toBeDefined();
      controls.show();
      expect(controls.isHidden).toBe(false);
    });

    test('should have method for hiding whole view', () => {
      expect(controls.hide).toBeDefined();
      controls.hide();
      expect(controls.isHidden).toBe(true);
    });

    test('should have method for destroying', () => {
      expect(controls.destroy).toBeDefined();
      controls.destroy();
    });
  });

  describe('View', () => {
    test('should have method for showing block with controls', () => {
      expect(controls.view.showContent).toBeDefined();
    });

    test('should have method for hiding block with controls', () => {
      expect(controls.view.hideContent).toBeDefined();
    });

    test('should have method for showing itself', () => {
      expect(controls.view.show).toBeDefined();
    });

    test('should have method for hiding itself', () => {
      expect(controls.view.hide).toBeDefined();
    });

    test('should have method gettind root node', () => {
      expect(controls.view.getElement).toBeDefined();
    });

    test('should have method for destroying', () => {
      expect(controls.view.destroy).toBeDefined();
    });
  });
});
