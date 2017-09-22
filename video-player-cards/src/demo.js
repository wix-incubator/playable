import VideoPlayer from 'video-player';
import CardsModule from './cards-module/cards-module';
import { getDemoCards } from './demo/demo-cards';

VideoPlayer.registerModule('cards', CardsModule);

export const player = VideoPlayer.create({
  autoPlay: false,
  muted: false,
  loop: false,
  logger: true,
  preload: 'auto',
  volume: 0.5,
  size: {
    width: 760,
    height: 428
  },
  loadingCover: 'https://i.imgflip.com/1rjoyq.jpg',
  src: [
    'https://clips.vorwaerts-gmbh.de/big_buck_bunny.mp4'
  ],
  controls: {
    watchOnSite: {
      url: 'http://www.wix.com/',
      showAlways: true,
      logo: 'https://www.file-extensions.org/imgs/app-icon/128/10395/wix-icon.png'
    }
  },
  overlay: false
}, false);

player.addCards(getDemoCards());
