import * as sinon from 'sinon';

import SafariPictureInPicture, {
  PICTURE_IN_PICTURE_MODE,
  INLINE_MODE,
} from './safari';
import { IPictureInPictureHelper } from './types';

describe('SafariPictureInPicture', () => {
  const callback = sinon.spy();
  let element: any;
  let pictureInPicture: IPictureInPictureHelper;

  beforeEach(() => {
    element = document.createDocumentFragment();
    pictureInPicture = new SafariPictureInPicture(element, callback);
  });

  afterEach(() => {
    callback.resetHistory();
  });

  describe('enable state', () => {
    test('should return true in native state is true', () => {
      element.webkitSetPresentationMode = () => {};
      expect(pictureInPicture.isEnabled).toBe(true);
    });

    test('should return false in native state is false', () => {
      element.webkitSetPresentationMode = false;
      expect(pictureInPicture.isEnabled).toBe(false);
    });
  });

  describe('picture-in-picture state', () => {
    test('should return true in native state is true', () => {
      element.webkitPresentationMode = PICTURE_IN_PICTURE_MODE;
      expect(pictureInPicture.isInPictureInPicture).toBe(true);
    });

    test('should return false in native state is false', () => {
      element.webkitPresentationMode = INLINE_MODE;
      expect(pictureInPicture.isInPictureInPicture).toBe(false);
    });
  });

  describe('method for entering picture-in-picture', () => {
    test('should use native method', () => {
      element.webkitSetPresentationMode = sinon.spy();
      pictureInPicture.request();
      expect(
        element.webkitSetPresentationMode.calledWith(PICTURE_IN_PICTURE_MODE),
      ).toBe(true);
    });

    test('should make postpone enter if do not have metadata', () => {
      element.readyState = 0;

      const metadataEvent = new Event('loadedmetadata');
      element.webkitSetPresentationMode = () => {
        throw new Error('Catch');
      };

      pictureInPicture.request();
      pictureInPicture.request();
      element.webkitSetPresentationMode = sinon.spy();
      element.dispatchEvent(metadataEvent);
      expect(element.webkitSetPresentationMode.calledOnce).toBe(true);
    });

    test('should do nothing if already in picture-in-picture', () => {
      element.webkitSetPresentationMode = sinon.spy();
      element.webkitPresentationMode = PICTURE_IN_PICTURE_MODE;
      pictureInPicture.request();
      expect(element.webkitSetPresentationMode.called).toBe(false);
    });
  });

  describe('method for exit picture-in-picture', () => {
    test('should use native method', () => {
      element.webkitSetPresentationMode = sinon.spy();
      element.webkitPresentationMode = PICTURE_IN_PICTURE_MODE;
      pictureInPicture.exit();
      expect(element.webkitSetPresentationMode.calledWith(INLINE_MODE)).toBe(
        true,
      );
    });

    test('should do nothing if not in picture-in-picture', () => {
      element.webkitSetPresentationMode = sinon.spy();
      element.webkitPresentationMode = INLINE_MODE;
      pictureInPicture.exit();
      expect(element.webkitSetPresentationMode.called).toBe(false);
    });
  });

  describe('due to reaction on native picture-in-picture change', () => {
    test('should call callback if changed', () => {
      const changeEvent = new Event('webkitpresentationmodechanged');

      element.dispatchEvent(changeEvent);
      expect(callback.called).toBe(true);
    });
  });

  describe('destroy method', () => {
    test('should clear loadedmetadata listener', () => {
      const metadataEvent = new Event('loadedmetadata');

      element.readyState = 0;
      element.webkitSetPresentationMode = () => {
        throw new Error('Catch');
      };

      pictureInPicture.request();
      element.webkitSetPresentationMode = sinon.spy();
      pictureInPicture.destroy();

      element.dispatchEvent(metadataEvent);
      expect(element.webkitSetPresentationMode.called).toBe(false);
    });

    test('should clear webkitbeginfullscreen listener', () => {
      const changeEvent = new Event('webkitpresentationmodechanged');
      element.webkitSetPresentationMode = sinon.spy();

      pictureInPicture.destroy();

      element.dispatchEvent(changeEvent);
      expect(callback.called).toBe(false);
    });

    test('should clear webkitendfullscreen listener', () => {
      const changeEvent = new Event('webkitpresentationmodechanged');
      element.webkitSetPresentationMode = sinon.spy();

      pictureInPicture.destroy();

      element.dispatchEvent(changeEvent);
      expect(callback.called).toBe(false);
    });
  });
});
