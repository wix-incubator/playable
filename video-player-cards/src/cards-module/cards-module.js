import VIDEO_EVENTS from 'video-player/dist/src/constants/events/video';
import STATES from 'video-player/dist/src/constants/engine-states';
import publicAPI from 'video-player/dist/src/utils/public-api-decorator';

import Card from './card/card';
import styles from './cards-module.scss';

const CARDS_UPDATE_INTERVAL = 100;

export default class CardsModule {
  static dependencies = ['eventEmitter', 'screen', 'engine'];

  constructor({ eventEmitter, screen, engine }) {
    this.eventEmitter = eventEmitter;
    this.screen = screen;
    this.engine = engine;

    this.cards = [];
    this.initContainer();

    this.handlePlayerStateChange = this.handlePlayerStateChange.bind(this);

    eventEmitter.on(VIDEO_EVENTS.STATE_CHANGED, this.handlePlayerStateChange);
  }

  initContainer() {
    this.cardsContainer = document.createElement('div');
    this.cardsContainer.className = styles.container;
    this.screen.view.appendComponentNode(this.cardsContainer);
  }

  @publicAPI()
  addCard(cardData) {
    const card = new Card(cardData);
    this.cards.push(card);
  }

  @publicAPI()
  addCards(cards) {
    cards.forEach(card => this.addCard(card));
  }

  showCard(card) {
    this.cardsContainer.prepend(card.node);
  }

  hideCard(card) {
    this.cardsContainer.removeChild(card.node);
  }

  startTimeTracking() {
    this.trackingInterval = setInterval(this.handleTimeUpdated.bind(this), CARDS_UPDATE_INTERVAL);
  }

  stopTimeTracking() {
    clearInterval(this.trackingInterval);
  }

  handlePlayerStateChange({ nextState }) {
    switch (nextState) {
      case STATES.PLAYING: return this.startTimeTracking();
      case STATES.PAUSED: return this.stopTimeTracking();
      default: return;
    }
  }

  handleTimeUpdated() {
    const currentTime = this.engine.getCurrentTime();
    this.updateCardsState(currentTime);
  }

  updateCardsState(currentTime) {
    this.cards.forEach(card => {
      this.updateCardState(card, currentTime);
    });
  }

  updateCardState(card, currentTime) {
    if (!card.isDisplayed && card.shouldBeShownAt(currentTime)) {
      this.showCard(card);
      card.setDisplayed(true);
    }

    if (card.isDisplayed && !card.shouldBeShownAt(currentTime)) {
      this.hideCard(card);
      card.setDisplayed(false);
    }
  }

  getOccupiedWidth() {
    const children = this.cardsContainer.children;
    let occupiedWidth = 0;

    children.forEach(child => {
      occupiedWidth += child.offsetWidth;
    });

    return occupiedWidth;
  }

  destroy() {
    this.eventEmitter.off(VIDEO_EVENTS.STATE_CHANGED, this.handlePlayerStateChange);
  }
}
