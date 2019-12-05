import { create, registerModule } from './core/player-factory';
import { PRELOAD_TYPES } from './index';
import Subtitles from './modules/ui/subtitles/subtitles';
import ChromecastManager from './modules/chromecast-manager/chromecast-manager';
import ChromecastButton from './modules/ui/controls/chromecast/chromecast';

registerModule('subtitles', Subtitles);
registerModule('chromecastManager', ChromecastManager);
registerModule('chromecastButton', ChromecastButton);

const VIDEO_SRC =
  'https://wixmp-8f9027fb681245255fb7f460.wixmp.com/black_video.webm';

document.addEventListener('DOMContentLoaded', () => {
  document.body.innerHTML = '';
  const playerContainer = document.createElement('div');
  playerContainer.id = 'player-container';

  document.body.appendChild(playerContainer);

  const player = create({
    preload: PRELOAD_TYPES.METADATA,
    width: 600,
    height: 350,
    playsinline: true,
    rtl: false,
    src: VIDEO_SRC,
  });

  player.showLogo();

  Object.defineProperty(window, 'player', {
    value: player,
  });

  player.attachToElement(playerContainer);
  player.showLiveIndicator();
});
