import ChromePictureInPicture from './chrome';
import SafariPictureInPicture from './safari';
import PictureInPicture from './picture-in-picture';

import createPlayerTestkit, { setProperty, resetProperty } from '../../testkit';

import { UIEvent } from '../../constants';

import { IPictureInPictureHelper } from './types';

declare const navigator: any;

interface MockedHelper extends IPictureInPictureHelper {
  reset(): void;
  request: ReturnType<typeof vi.fn>;
  exit: ReturnType<typeof vi.fn>;
}

const mockedPictureInPictureHelper: MockedHelper = {
  isInPictureInPicture: false,
  isEnabled: true,
  request: vi.fn(),
  exit: vi.fn(),
  destroy: vi.fn(),
  reset() {
    this.isInFullScreen = false;
    this.isEnabled = true;

    this.request.mockClear();
    this.exit.mockClear();
    this.destroy.mockClear();
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

      expect(pictureInPicture._helper instanceof ChromePictureInPicture).toBe(
        true,
      ).true;
    });

    it('should be for iPhone', () => {
      setProperty(navigator, 'userAgent', 'safari');

      pictureInPicture = testkit.getModule('pictureInPicture');

      expect(pictureInPicture._helper instanceof SafariPictureInPicture).toBe(
        true,
      ).true;
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
        expect(pictureInPicture.isEnabled).toBe(true);
        mockedPictureInPictureHelper.isEnabled = false;
        expect(pictureInPicture.isEnabled).toBe(false);
      });

      it('should return false in disabled flag passed in config', () => {
        mockedPictureInPictureHelper.isEnabled = true;
        pictureInPicture._isEnabled = false;
        expect(pictureInPicture.isEnabled).toBe(false);
      });
    });

    describe('full screen state', () => {
      it('should return state of helper', () => {
        mockedPictureInPictureHelper.isInPictureInPicture = true;
        expect(pictureInPicture.isInPictureInPicture).toBe(true);
      });

      it('should return false if disabled', () => {
        mockedPictureInPictureHelper.isEnabled = false;
        mockedPictureInPictureHelper.isInPictureInPicture = true;
        expect(pictureInPicture.isInPictureInPicture).toBe(false);
      });
    });

    describe('method for entering full screen', () => {
      it("should call helper's method for request full screen", () => {
        pictureInPicture.enterPictureInPicture();
        expect(mockedPictureInPictureHelper.request).toHaveBeenCalled();
      });

      it('should do nothing if full screen is not enable', () => {
        mockedPictureInPictureHelper.isEnabled = false;
        pictureInPicture.enterPictureInPicture();
        expect(mockedPictureInPictureHelper.request).not.toHaveBeenCalled();
      });
    });

    describe('method for exiting full screen', () => {
      it("should call helper's method for request full screen", () => {
        pictureInPicture.exitPictureInPicture();
        expect(mockedPictureInPictureHelper.exit).toHaveBeenCalled();
      });

      it('should do nothing if full screen is not enable', () => {
        mockedPictureInPictureHelper.isEnabled = false;
        pictureInPicture.exitPictureInPicture();
        expect(mockedPictureInPictureHelper.exit).not.toHaveBeenCalled();
      });
    });

    describe('due to reaction on fullscreen change', () => {
      it('should trigger proper event', () => {
        const spy: ReturnType<typeof vi.fn> = vi.spyOn(
          eventEmitter,
          'emitAsync',
        );

        mockedPictureInPictureHelper.isInPictureInPicture = true;
        pictureInPicture._onChange();
        expect(spy).toHaveBeenCalledWith(
          UIEvent.PICTURE_IN_PICTURE_STATUS_CHANGE,
          true,
        );

        eventEmitter.emitAsync.mockRestore();
      });
    });
  });
});
