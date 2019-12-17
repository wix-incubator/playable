import { ScreenshotOptions, Page } from 'puppeteer';
import { EngineState } from '../constants';

const config = require('../../jest-puppeteer.config.js');

const TEST_PORT = config.server.port;

export const ELEMENT_HOOKS = {
  PICTURE_IN_PICTURE_CONTROL: 'picture-in-picture-control',
  FULLSCREEN_CONTROL: 'full-screen-container',
  DOWNLOAD_CONTROL: 'download-button',
  LOGO_CONTROL: 'logo-button',
  PLAYBACK_CONTROL: 'playback-control',
  VOLUME_CONTROL: 'volume-control',

  PLAYER_CONTAINER: 'player-container',
};

export class PlayerDriver {
  page: Page;

  init = async (page: Page) => {
    this.page = page;

    await this.page.goto(`http://localhost:${TEST_PORT}`);
    await this.when.waitForElementHandle(ELEMENT_HOOKS.PLAYER_CONTAINER);
    await this.when.waitPlayerReadyState();
  };

  when = {
    hoverElement: async (elementHook: string) => {
      const elementHandle = await this.when.waitForElementHandle(elementHook);
      await elementHandle.hover();

      await this.page.waitFor(50);
    },
    waitPlayerReadyState: async () => {
      await this.page.evaluate((readyToPlayState) => {
        const player = window.player;
        const playerReadyState = readyToPlayState;

        const state = player.getPlaybackState();
        if (state === playerReadyState) {
          return Promise.resolve();
        }
        return new Promise(resolve => {
          player.on(playerReadyState, resolve);
        });
      }, EngineState.READY_TO_PLAY);
    },
    waitForElementHandle: (hook: string) =>
      this.page.waitFor(`[data-playable-hook="${hook}"]`),
  };

  playerAPI = {
    playVideo: () => this.page.evaluate(() => window.player.play()),
    pauseVideo: () => this.page.evaluate(() => window.player.pause()),
    seekTo: (time: number) =>
      this.page.evaluate(
        (providedTimeToSeek: number) =>
          window.player.seekTo(providedTimeToSeek),
        time,
      ),
  };

  get = {
    elementHandleByHook: (hook: string) =>
      this.page.$(`[data-playable-hook="${hook}"]`),
    playerScreenshot: (options?: ScreenshotOptions) =>
      this.get
        .elementHandleByHook(ELEMENT_HOOKS.PLAYER_CONTAINER)
        .then(player => player.screenshot(options)),
  };
}
