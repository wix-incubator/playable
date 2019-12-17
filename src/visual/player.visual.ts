import { PlayerDriver, ELEMENT_HOOKS } from './player.driver';

type IElementDataHook = string;

type IElementsToScreenshot = {
  [name: string]: IElementDataHook;
};

const ELEMENTS_TO_SCREENSHOT: IElementsToScreenshot = {
  volumeControl: ELEMENT_HOOKS.VOLUME_CONTROL,
  playControl: ELEMENT_HOOKS.PLAYBACK_CONTROL,
  pictureInPictureControl: ELEMENT_HOOKS.PICTURE_IN_PICTURE_CONTROL,
  logoControl: ELEMENT_HOOKS.LOGO_CONTROL,
  downloadControl: ELEMENT_HOOKS.DOWNLOAD_CONTROL,
  fullscreenControl: ELEMENT_HOOKS.FULLSCREEN_CONTROL,
};

describe('Visual', () => {
  describe('should match screenshots in non-fullscreen mode', () => {
    const driver = new PlayerDriver();

    beforeAll(async () => {
      await driver.init(page);

      // use play/pause to show player controls
      await driver.playerAPI.playVideo();
      await driver.playerAPI.pauseVideo();
      // to always have the same current playback time
      await driver.playerAPI.seekTo(0);
    });

    it('player when ready to play', async () => {
      const screenshot = await driver.get.playerScreenshot();
      expect(screenshot).toMatchImageSnapshot({
        customSnapshotIdentifier: () => 'playerReadyState',
      });
    });

    it.each(Object.entries(ELEMENTS_TO_SCREENSHOT))(
      'player when hover %s',
      async (elementName, dataHook) => {
        await driver.when.hoverElement(dataHook);

        const screenshot = await driver.get.playerScreenshot();
        expect(screenshot).toMatchImageSnapshot({
          customSnapshotIdentifier: () => elementName,
        });
      },
    );
  });
});
