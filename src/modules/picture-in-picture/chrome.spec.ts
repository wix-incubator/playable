import * as sinon from 'sinon';

import ChromePictureInPicture, { ChromeDocument } from './chrome';
import { IPictureInPictureHelper } from './types';

describe('ChromePictureInPicture', () => {
  const callback = sinon.spy();
  let element: any;
  let pictureInPicture: IPictureInPictureHelper;

  beforeEach(() => {
    element = document.createDocumentFragment();
    pictureInPicture = new ChromePictureInPicture(element, callback);
  });

  afterEach(() => {
    callback.resetHistory();
  });

  describe('enable state', () => {
    test('should return true in native state is true', () => {
      (document as ChromeDocument).pictureInPictureEnabled = true;
      expect(pictureInPicture.isEnabled).toBe(true);
    });

    test('should return false in native state is false', () => {
      (document as ChromeDocument).pictureInPictureEnabled = false;
      expect(pictureInPicture.isEnabled).toBe(false);
    });
  });

  describe('picture-in-picture state', () => {
    test('should return true in native state is true', () => {
      (document as ChromeDocument).pictureInPictureElement = element;
      expect(pictureInPicture.isInPictureInPicture).toBe(true);
    });

    test('should return false in native state is false', () => {
      (document as ChromeDocument).pictureInPictureElement = null;
      expect(pictureInPicture.isInPictureInPicture).toBe(false);
    });
  });

  describe('method for entering picture-in-picture', () => {
    test('should use native method', () => {
      (document as ChromeDocument).pictureInPictureEnabled = true;
      element.requestPictureInPicture = sinon.spy(() => Promise.resolve());
      pictureInPicture.request();
      expect(element.requestPictureInPicture.called).toBe(true);
    });

    test('should make postpone enter if do not have metadata', async () => {
      (document as ChromeDocument).pictureInPictureEnabled = true;
      element.readyState = 0;

      const metadataEvent = new Event('loadedmetadata');
      element.requestPictureInPicture = () => Promise.reject();

      await pictureInPicture.request();
      await pictureInPicture.request();
      element.requestPictureInPicture = sinon.spy(() => Promise.resolve());
      element.dispatchEvent(metadataEvent);
      expect(element.requestPictureInPicture.calledOnce).toBe(true);
    });

    test('should do nothing if already in picture-in-picture', () => {
      element.requestPictureInPicture = sinon.spy(() => Promise.resolve());
      (document as ChromeDocument).pictureInPictureElement = element;
      pictureInPicture.request();
      expect(element.requestPictureInPicture.called).toBe(false);
    });
  });

  describe('method for exit picture-in-picture', () => {
    test('should use native method', () => {
      (document as ChromeDocument).exitPictureInPicture = sinon.spy() as sinon.SinonSpy;
      (document as ChromeDocument).pictureInPictureElement = element;

      pictureInPicture.exit();
      expect(
        ((document as ChromeDocument).exitPictureInPicture as sinon.SinonSpy)
          .called,
      ).toBe(true);
    });

    test('should do nothing if not in picture-in-picture', () => {
      (document as ChromeDocument).exitPictureInPicture = sinon.spy() as sinon.SinonSpy;
      (document as ChromeDocument).pictureInPictureElement = null;
      pictureInPicture.exit();
      expect(
        ((document as ChromeDocument).exitPictureInPicture as sinon.SinonSpy)
          .called,
      ).toBe(false);
    });
  });

  describe('due to reaction on native picture-in-picture change', () => {
    test('should call callback if enter', () => {
      const changeEvent = new Event('enterpictureinpicture');

      element.dispatchEvent(changeEvent);
      expect(callback.called).toBe(true);
    });

    test('should call callback if exit', () => {
      const changeEvent = new Event('leavepictureinpicture');

      element.dispatchEvent(changeEvent);
      expect(callback.called).toBe(true);
    });
  });

  describe('destroy method', () => {
    test('should clear loadedmetadata listener', () => {
      (document as ChromeDocument).pictureInPictureEnabled = true;
      element.readyState = 0;

      const metadataEvent = new Event('loadedmetadata');
      element.requestPictureInPicture = () => Promise.reject();

      pictureInPicture.request();
      element.webkitSetPresentationMode = sinon.spy();
      pictureInPicture.destroy();

      element.dispatchEvent(metadataEvent);
      expect(element.webkitSetPresentationMode.called).toBe(false);
    });

    test('should clear webkitbeginfullscreen listener', () => {
      const changeEvent = new Event('enterpictureinpicture');
      element.requestPictureInPicture = () => Promise.reject();

      pictureInPicture.destroy();

      element.dispatchEvent(changeEvent);
      expect(callback.called).toBe(false);
    });

    test('should clear webkitendfullscreen listener', () => {
      const changeEvent = new Event('leavepictureinpicture');
      element.requestPictureInPicture = () => Promise.reject();

      pictureInPicture.destroy();

      element.dispatchEvent(changeEvent);
      expect(callback.called).toBe(false);
    });
  });
});
