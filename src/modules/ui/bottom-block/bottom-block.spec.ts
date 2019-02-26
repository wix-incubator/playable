import 'jsdom-global/register';
import { expect } from 'chai';

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
      expect(controls).to.exist;
      expect(controls.view).to.exist;
    });
  });

  describe('instance', () => {
    it('should have method for setting controls focused state', () => {
      expect(controls._setFocusState).to.exist;
      controls._setFocusState();
      expect(controls._isBlockFocused).to.be.true;
    });

    it('should have method for removing controls focused state', () => {
      expect(controls._removeFocusState).to.exist;
      controls._setFocusState();
      controls._removeFocusState({
        stopPropagation: () => {},
      });
      expect(controls._isBlockFocused).to.be.false;
    });
  });

  describe('API', () => {
    it('should have method for showing whole view', () => {
      expect(controls.show).to.exist;
      controls.show();
      expect(controls.isHidden).to.be.false;
    });

    it('should have method for hiding whole view', () => {
      expect(controls.hide).to.exist;
      controls.hide();
      expect(controls.isHidden).to.be.true;
    });

    it('should have method for destroying', () => {
      expect(controls.destroy).to.exist;
      controls.destroy();
    });
  });

  describe('View', () => {
    it('should have method for showing block with controls', () => {
      expect(controls.view.showContent).to.exist;
    });

    it('should have method for hiding block with controls', () => {
      expect(controls.view.hideContent).to.exist;
    });

    it('should have method for showing itself', () => {
      expect(controls.view.show).to.exist;
    });

    it('should have method for hiding itself', () => {
      expect(controls.view.hide).to.exist;
    });

    it('should have method gettind root node', () => {
      expect(controls.view.getElement).to.exist;
    });

    it('should have method for destroying', () => {
      expect(controls.view.destroy).to.exist;
    });
  });
});
