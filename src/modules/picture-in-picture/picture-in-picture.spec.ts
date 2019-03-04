import 'jsdom-global/register';

import { expect } from 'chai';
import * as sinon from 'sinon';

import ChromePictureInPicture from './chrome';
import SafariPictureInPicture from './safari';
import PictureInPicture from './picture-in-picture';

import createPlayerTestkit, { setProperty, resetProperty } from '../../testkit';

import { UIEvent } from '../../constants';

import { IPictureInPictureHelper } from './types';

declare const navigator: any;

interface MockedHelper extends IPictureInPictureHelper {
  reset(): void;
  request: sinon.SinonSpy;
  exit: sinon.SinonSpy;
}

const mockedPictureInPictureHelper: MockedHelper = {
  isInPictureInPicture: false,
  isEnabled: true,
  request: sinon.spy(),
  exit: sinon.spy(),
  destroy: sinon.spy(),
  reset() {
    this.isInFullScreen = false;
    this.isEnabled = true;

    this.request.resetHistory();
    this.exit.resetHistory();
    this.destroy.resetHistory();
  },
};

describe('PictureInPicture', () => {
  let testkit: any;
  let pictureInPicture: any;
  let eventEmitter: any;

  beforeEach(() => {
    testkit = createPlayerTestkit();
    testkit.registerModule('pictureInPicture', PictureInPicture);
    eventEmitter = testkit.getModule('eventEmitter');
    pictureInPicture = testkit.getModule('pictureInPicture');
  });

  describe('chosen helper', () => {
    afterEach(() => {
      resetProperty(navigator, 'userAgent');
    });

    it('should be for desktop if not on iOS', () => {
      setProperty(navigator, 'userAgent', 'chrome');

      pictureInPicture = testkit.getModule('pictureInPicture');

      expect(pictureInPicture._helper instanceof ChromePictureInPicture).to.be
        .true;
    });

    it('should be for iPhone', () => {
      setProperty(navigator, 'userAgent', 'safari');

      pictureInPicture = testkit.getModule('pictureInPicture');

      expect(pictureInPicture._helper instanceof SafariPictureInPicture).to.be
        .true;
    });
  });
  describe('after helper chosen', () => {
    beforeEach(() => {
      pictureInPicture._helper = mockedPictureInPictureHelper;
    });

    afterEach(() => {
      mockedPictureInPictureHelper.reset();
    });
    describe('enable state', () => {
      it('should be based on helper state and config', () => {
        expect(pictureInPicture.isEnabled).to.be.true;
        mockedPictureInPictureHelper.isEnabled = false;
        expect(pictureInPicture.isEnabled).to.be.false;
      });

      it('should return false in disabled flag passed in config', () => {
        mockedPictureInPictureHelper.isEnabled = true;
        pictureInPicture._isEnabled = false;
        expect(pictureInPicture.isEnabled).to.be.false;
      });
    });

    describe('full screen state', () => {
      it('should return state of helper', () => {
        mockedPictureInPictureHelper.isInPictureInPicture = true;
        expect(pictureInPicture.isInPictureInPicture).to.be.true;
      });

      it('should return false if disabled', () => {
        mockedPictureInPictureHelper.isEnabled = false;
        mockedPictureInPictureHelper.isInPictureInPicture = true;
        expect(pictureInPicture.isInPictureInPicture).to.be.false;
      });
    });

    describe('method for entering full screen', () => {
      it("should call helper's method for request full screen", () => {
        pictureInPicture.enterPictureInPicture();
        expect(mockedPictureInPictureHelper.request.called).to.be.true;
      });

      it('should do nothing if full screen is not enable', () => {
        mockedPictureInPictureHelper.isEnabled = false;
        pictureInPicture.enterPictureInPicture();
        expect(mockedPictureInPictureHelper.request.called).to.be.false;
      });
    });

    describe('method for exiting full screen', () => {
      it("should call helper's method for request full screen", () => {
        pictureInPicture.exitPictureInPicture();
        expect(mockedPictureInPictureHelper.exit.called).to.be.true;
      });

      it('should do nothing if full screen is not enable', () => {
        mockedPictureInPictureHelper.isEnabled = false;
        pictureInPicture.exitPictureInPicture();
        expect(mockedPictureInPictureHelper.exit.called).to.be.false;
      });
    });

    describe('due to reaction on fullscreen change', () => {
      it('should trigger proper event', () => {
        const spy: sinon.SinonSpy = sinon.spy(eventEmitter, 'emitAsync');

        mockedPictureInPictureHelper.isInPictureInPicture = true;
        pictureInPicture._onChange();
        expect(spy.calledWith(UIEvent.PICTURE_IN_PICTURE_STATUS_CHANGE)).to.be
          .true;

        eventEmitter.emitAsync.restore();
      });
    });
  });
});
