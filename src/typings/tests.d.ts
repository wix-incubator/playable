import { Page } from 'puppeteer';
import { IPlayerInstance } from '..';

declare global {
  interface Window {
    player: IPlayerInstance;
  }
  const page: Page;
}
