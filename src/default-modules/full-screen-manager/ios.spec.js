import { expect } from 'chai';
import sinon from 'sinon';

import IOSFullScreen from './ios';

describe('IOSFullScreen', () => {
  const callback = sinon.spy();
  let element;
  let fullScreen;

  beforeEach(() => {
    element = document.createElement('div');
    fullScreen = new IOSFullScreen(element, callback);
  });

  afterEach(() => {
    callback.reset();
  });

  describe('enable status', () => {
    it('should be based on native support', () => {
      element.webkitSupportsFullscreen = false;
      expect(fullScreen.isEnabled).to.be.false;

      element.webkitSupportsFullscreen = true;
      expect(fullScreen.isEnabled).to.be.true;
    });
  });

  describe('full screen status', () => {
    it('should be based on native status', () => {
      element.webkitDisplayingFullscreen = false;
      expect(fullScreen.isInFullScreen).to.be.false;

      element.webkitDisplayingFullscreen = true;
      expect(fullScreen.isInFullScreen).to.be.true;
    });
  });

  describe('method for entering full screen', () => {
    it('should use native method', () => {
      element.webkitSupportsFullscreen = true;
      element.webkitEnterFullscreen = sinon.spy();
      fullScreen.request();
      expect(element.webkitEnterFullscreen.called).to.be.true;
    });

    it('should make postpone enter if do not have metadata', () => {
      element.webkitSupportsFullscreen = true;
      element.readyState = 0;

      const metadataEvent = new Event('loadedmetadata');
      element.webkitEnterFullscreen = () => {
        throw new Error('Catch');
      };

      fullScreen.request();
      fullScreen.request();
      element.webkitEnterFullscreen = sinon.spy();
      element.dispatchEvent(metadataEvent);
      expect(element.webkitEnterFullscreen.calledOnce).to.be.true;
    });

    it('should do nothing if not enabled', () => {
      element.webkitSupportsFullscreen = false;
      element.webkitEnterFullscreen = sinon.spy();
      fullScreen.request();
      expect(element.webkitEnterFullscreen.called).to.be.false;
    });

    it('should do nothing if already in full screen', () => {
      element.webkitDisplayingFullscreen = true;
      element.webkitEnterFullscreen = sinon.spy();
      fullScreen.request();
      expect(element.webkitEnterFullscreen.called).to.be.false;
    });
  });

  describe('method for exit full screen', () => {
    it('should use native method', () => {
      element.webkitSupportsFullscreen = true;
      element.webkitDisplayingFullscreen = true;
      element.webkitExitFullscreen = sinon.spy();
      fullScreen.exit();
      expect(element.webkitExitFullscreen.called).to.be.true;
    });

    it('should do nothing if not enabled', () => {
      element.webkitSupportsFullscreen = false;
      element.webkitExitFullscreen = sinon.spy();
      fullScreen.exit();
      expect(element.webkitExitFullscreen.called).to.be.false;
    });

    it('should do nothing if not in full screen', () => {
      element.webkitDisplayingFullscreen = false;
      element.webkitExitFullscreen = sinon.spy();
      fullScreen.exit();
      expect(element.webkitExitFullscreen.called).to.be.false;
    });
  });

  describe('due to reaction on native full screen change', () => {
    it('should call callback if enter', () => {
      const enterEvent = new Event('webkitbeginfullscreen');

      element.dispatchEvent(enterEvent);
      expect(callback.called).to.be.true;
    });

    it('should call callback if exit', () => {
      const exitEvent = new Event('webkitendfullscreen');

      element.dispatchEvent(exitEvent);
      expect(callback.called).to.be.true;
    });
  });

  describe('destroy method', () => {
    it('should clear on event listeners', () => {
      const enterEvent = new Event('webkitbeginfullscreen');
      const exitEvent = new Event('webkitendfullscreen');
      const metadataEvent = new Event('loadedmetadata');

      element.webkitSupportsFullscreen = true;
      element.readyState = 0;
      element.webkitEnterFullscreen = () => {
        throw new Error('Catch');
      };
      fullScreen.request();
      element.webkitEnterFullscreen = sinon.spy();
      fullScreen.destroy();

      element.dispatchEvent(metadataEvent);
      expect(element.webkitEnterFullscreen.called).to.be.false;
      element.dispatchEvent(enterEvent);
      expect(callback.called).to.be.false;
      element.dispatchEvent(exitEvent);
      expect(callback.called).to.be.false;
    });
  });
});
