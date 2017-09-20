import VideoPlayer from 'video-player';
import CardsModule from './cards-module/cards-module';

VideoPlayer.registerModule('cards', CardsModule);

export default { VideoPlayer };
