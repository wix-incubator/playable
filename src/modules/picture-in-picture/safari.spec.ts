import SafariPictureInPicture, {
  PICTURE_IN_PICTURE_MODE,
  INLINE_MODE,
} from './safari';
import { IPictureInPictureHelper } from './types';

describe('SafariPictureInPicture', () => {
  const callback = vi.fn();
  let element: any;
  let pictureInPicture: IPictureInPictureHelper;

  beforeEach(() => {
    element = document.createDocumentFragment();
    pictureInPicture = new SafariPictureInPicture(element, callback);
  });

  afterEach(() => {
    callback.mockClear();
  });

  describe('enable state', () => {
    it('should return true in native state is true', () => {
      element.webkitSetPresentationMode = () => {};
      expect(pictureInPicture.isEnabled).toBe(true);
    });

    it('should return false in native state is false', () => {
      element.webkitSetPresentationMode = false;
      expect(pictureInPicture.isEnabled).toBe(false);
    });
  });

  describe('picture-in-picture state', () => {
    it('should return true in native state is true', () => {
      element.webkitPresentationMode = PICTURE_IN_PICTURE_MODE;
      expect(pictureInPicture.isInPictureInPicture).toBe(true);
    });

    it('should return false in native state is false', () => {
      element.webkitPresentationMode = INLINE_MODE;
      expect(pictureInPicture.isInPictureInPicture).toBe(false);
    });
  });

  describe('method for entering picture-in-picture', () => {
    it('should use native method', () => {
      element.webkitSetPresentationMode = vi.fn();
      pictureInPicture.request();
      expect(element.webkitSetPresentationMode).toHaveBeenCalledWith(
        PICTURE_IN_PICTURE_MODE,
      );
    });

    it('should make postpone enter if do not have metadata', () => {
      element.readyState = 0;

      const metadataEvent = new Event('loadedmetadata');
      element.webkitSetPresentationMode = () => {
        throw new Error('Catch');
      };

      pictureInPicture.request();
      pictureInPicture.request();
      element.webkitSetPresentationMode = vi.fn();
      element.dispatchEvent(metadataEvent);
      expect(element.webkitSetPresentationMode).toHaveBeenCalledTimes(1);
    });

    it('should do nothing if already in picture-in-picture', () => {
      element.webkitSetPresentationMode = vi.fn();
      element.webkitPresentationMode = PICTURE_IN_PICTURE_MODE;
      pictureInPicture.request();
      expect(element.webkitSetPresentationMode).not.toHaveBeenCalled();
    });
  });

  describe('method for exit picture-in-picture', () => {
    it('should use native method', () => {
      element.webkitSetPresentationMode = vi.fn();
      element.webkitPresentationMode = PICTURE_IN_PICTURE_MODE;
      pictureInPicture.exit();
      expect(element.webkitSetPresentationMode).toHaveBeenCalledWith(
        INLINE_MODE,
      );
    });

    it('should do nothing if not in picture-in-picture', () => {
      element.webkitSetPresentationMode = vi.fn();
      element.webkitPresentationMode = INLINE_MODE;
      pictureInPicture.exit();
      expect(element.webkitSetPresentationMode).not.toHaveBeenCalled();
    });
  });

  describe('due to reaction on native picture-in-picture change', () => {
    it('should call callback if changed', () => {
      const changeEvent = new Event('webkitpresentationmodechanged');

      element.dispatchEvent(changeEvent);
      expect(callback).toHaveBeenCalled();
    });
  });

  describe('destroy method', () => {
    it('should clear loadedmetadata listener', () => {
      const metadataEvent = new Event('loadedmetadata');

      element.readyState = 0;
      element.webkitSetPresentationMode = () => {
        throw new Error('Catch');
      };

      pictureInPicture.request();
      element.webkitSetPresentationMode = vi.fn();
      pictureInPicture.destroy();

      element.dispatchEvent(metadataEvent);
      expect(element.webkitSetPresentationMode).not.toHaveBeenCalled();
    });

    it('should clear webkitbeginfullscreen listener', () => {
      const changeEvent = new Event('webkitpresentationmodechanged');
      element.webkitSetPresentationMode = vi.fn();

      pictureInPicture.destroy();

      element.dispatchEvent(changeEvent);
      expect(callback).not.toHaveBeenCalled();
    });

    it('should clear webkitendfullscreen listener', () => {
      const changeEvent = new Event('webkitpresentationmodechanged');
      element.webkitSetPresentationMode = vi.fn();

      pictureInPicture.destroy();

      element.dispatchEvent(changeEvent);
      expect(callback).not.toHaveBeenCalled();
    });
  });
});
