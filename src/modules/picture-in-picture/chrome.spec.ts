import ChromePictureInPicture, { ChromeDocument } from './chrome';
import { IPictureInPictureHelper } from './types';

describe('ChromePictureInPicture', () => {
  const callback = vi.fn();
  let element: any;
  let pictureInPicture: IPictureInPictureHelper;

  beforeEach(() => {
    element = document.createDocumentFragment();
    pictureInPicture = new ChromePictureInPicture(element, callback);
  });

  afterEach(() => {
    callback.mockClear();
  });

  describe('enable state', () => {
    it('should return true in native state is true', () => {
      (document as ChromeDocument).pictureInPictureEnabled = true;
      expect(pictureInPicture.isEnabled).toBe(true);
    });

    it('should return false in native state is false', () => {
      (document as ChromeDocument).pictureInPictureEnabled = false;
      expect(pictureInPicture.isEnabled).toBe(false);
    });
  });

  describe('picture-in-picture state', () => {
    it('should return true in native state is true', () => {
      (document as ChromeDocument).pictureInPictureElement = element;
      expect(pictureInPicture.isInPictureInPicture).toBe(true);
    });

    it('should return false in native state is false', () => {
      (document as ChromeDocument).pictureInPictureElement = null;
      expect(pictureInPicture.isInPictureInPicture).toBe(false);
    });
  });

  describe('method for entering picture-in-picture', () => {
    it('should use native method', () => {
      (document as ChromeDocument).pictureInPictureEnabled = true;
      element.requestPictureInPicture = vi.fn(() => Promise.resolve());
      pictureInPicture.request();
      expect(element.requestPictureInPicture).toHaveBeenCalled();
    });

    it('should make postpone enter if do not have metadata', async function() {
      (document as ChromeDocument).pictureInPictureEnabled = true;
      element.readyState = 0;

      const metadataEvent = new Event('loadedmetadata');
      element.requestPictureInPicture = () => Promise.reject();

      await pictureInPicture.request();
      await pictureInPicture.request();
      element.requestPictureInPicture = vi.fn(() => Promise.resolve());
      element.dispatchEvent(metadataEvent);
      expect(element.requestPictureInPicture).toHaveBeenCalledTimes(1);
    });

    it('should do nothing if already in picture-in-picture', () => {
      element.requestPictureInPicture = vi.fn(() => Promise.resolve());
      (document as ChromeDocument).pictureInPictureElement = element;
      pictureInPicture.request();
      expect(element.requestPictureInPicture).not.toHaveBeenCalled();
    });
  });

  describe('method for exit picture-in-picture', () => {
    it('should use native method', () => {
      (document as ChromeDocument).exitPictureInPicture = vi.fn();
      (document as ChromeDocument).pictureInPictureElement = element;

      pictureInPicture.exit();
      expect(
        (document as ChromeDocument).exitPictureInPicture,
      ).toHaveBeenCalled();
    });

    it('should do nothing if not in picture-in-picture', () => {
      (document as ChromeDocument).exitPictureInPicture = vi.fn();
      (document as ChromeDocument).pictureInPictureElement = null;
      pictureInPicture.exit();
      expect(
        (document as ChromeDocument).exitPictureInPicture,
      ).not.toHaveBeenCalled();
    });
  });

  describe('due to reaction on native picture-in-picture change', () => {
    it('should call callback if enter', () => {
      const changeEvent = new Event('enterpictureinpicture');

      element.dispatchEvent(changeEvent);
      expect(callback).toHaveBeenCalled();
    });

    it('should call callback if exit', () => {
      const changeEvent = new Event('leavepictureinpicture');

      element.dispatchEvent(changeEvent);
      expect(callback).toHaveBeenCalled();
    });
  });

  describe('destroy method', () => {
    it('should clear loadedmetadata listener', () => {
      (document as ChromeDocument).pictureInPictureEnabled = true;
      element.readyState = 0;

      const metadataEvent = new Event('loadedmetadata');
      element.requestPictureInPicture = () => Promise.reject();

      pictureInPicture.request();
      element.webkitSetPresentationMode = vi.fn();
      pictureInPicture.destroy();

      element.dispatchEvent(metadataEvent);
      expect(element.webkitSetPresentationMode).not.toHaveBeenCalled();
    });

    it('should clear webkitbeginfullscreen listener', () => {
      const changeEvent = new Event('enterpictureinpicture');
      element.requestPictureInPicture = () => Promise.reject();

      pictureInPicture.destroy();

      element.dispatchEvent(changeEvent);
      expect(callback).not.toHaveBeenCalled();
    });

    it('should clear webkitendfullscreen listener', () => {
      const changeEvent = new Event('leavepictureinpicture');
      element.requestPictureInPicture = () => Promise.reject();

      pictureInPicture.destroy();

      element.dispatchEvent(changeEvent);
      expect(callback).not.toHaveBeenCalled();
    });
  });
});
