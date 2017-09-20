import VIDEO_EVENTS from 'video-player/dist/src/constants/events/video';

export default class CardsModule {
  static dependencies = ['eventEmitter'];

  constructor({ eventEmitter }) {
    this.eventEmitter = eventEmitter;
    this.eventEmitter.on(VIDEO_EVENTS.PLAY_REQUEST_TRIGGERED, this.handlePlayRequest);
  }

  handlePlayRequest() {
    console.log('cards module - PLAY_REQUEST_TRIGGERED'); // eslint-disable-line no-console
  }

  destroy() {
    this.eventEmitter.off(VIDEO_EVENTS.PLAY_REQUEST_TRIGGERED, this.handlePlayRequest);
  }
}
