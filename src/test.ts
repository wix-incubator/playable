import { create } from './core/player-factory';
import { PRELOAD_TYPES } from './index';

const TEST_VIDEO_SRC =
  'https://wixmp-8f9027fb681245255fb7f460.wixmp.com/webm-black-small.webm';

const zeroTransitionStyle = `* { transition-duration: unset !important; animation-duration: unset !important; }`;

document.addEventListener('DOMContentLoaded', () => {
  document.body.innerHTML = '';

  const style = document.createElement('style');
  style.appendChild(document.createTextNode(zeroTransitionStyle));
  document.head.appendChild(style);

  const playerContainer = document.createElement('div');
  playerContainer.id = 'player-container';

  document.body.appendChild(playerContainer);

  const player = create({
    preload: PRELOAD_TYPES.METADATA,
    width: 600,
    height: 350,
    playsinline: true,
    rtl: false,
    src: TEST_VIDEO_SRC,
  });

  player.showLogo();
  player.showDownloadButton();

  Object.defineProperty(window, 'player', {
    value: player,
  });

  player.attachToElement(playerContainer);
  player.showLiveIndicator();
});
