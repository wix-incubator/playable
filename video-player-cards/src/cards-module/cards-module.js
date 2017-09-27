import { VIDEO_EVENTS, UI_EVENTS, STATES } from 'video-player/dist/src/constants';
import playerAPI from 'video-player/dist/src/utils/player-api-decorator';

import Card from './card/card';
import CardsContainer from './cards-container/cards-container';


const CARDS_UPDATE_INTERVAL = 100;

export default class CardsModule {
  static dependencies = ['eventEmitter', 'rootContainer', 'engine'];

  constructor({ eventEmitter, rootContainer, engine }) {
    this.eventEmitter = eventEmitter;
    this.rootContainer = rootContainer;
    this.engine = engine;

    this.cards = [];

    this.initContainer();

    this.bindCallbacks();
    this.bindEvents();
  }

  initContainer() {
    this.cardsContainer = new CardsContainer();

    this.rootContainer.appendComponentNode(this.cardsContainer.node);
  }

  bindCallbacks() {
    this.updateCardsState = this.updateCardsState.bind(this);
  }

  bindEvents() {
    this.eventEmitter.on(VIDEO_EVENTS.STATE_CHANGED, this.handlePlayerStateChange, this);

    this.eventEmitter.on(
      UI_EVENTS.CONTROL_BLOCK_HIDE_TRIGGERED,
      this.cardsContainer.onControlsHided,
      this.cardsContainer
    );
    this.eventEmitter.on(
      UI_EVENTS.CONTROL_BLOCK_SHOW_TRIGGERED,
      this.cardsContainer.onControlsShowed,
      this.cardsContainer
    );

    this.eventEmitter.on(
      UI_EVENTS.FULLSCREEN_STATUS_CHANGED,
      this.cardsContainer.checkCardsToShow,
      this.cardsContainer
    );
    this.eventEmitter.on(
      UI_EVENTS.PLAYER_HEIGHT_CHANGE_TRIGGERED,
      this.cardsContainer.checkCardsToShow,
      this.cardsContainer
    );
    this.eventEmitter.on(
      UI_EVENTS.PLAYER_WIDTH_CHANGE_TRIGGERED,
      this.cardsContainer.checkCardsToShow,
      this.cardsContainer
    );
  }

  unbindEvents() {
    this.eventEmitter.off(VIDEO_EVENTS.STATE_CHANGED, this.handlePlayerStateChange, this);

    this.eventEmitter.off(
      UI_EVENTS.CONTROL_BLOCK_HIDE_TRIGGERED,
      this.cardsContainer.onControlsHided,
      this.cardsContainer
    );
    this.eventEmitter.off(
      UI_EVENTS.CONTROL_BLOCK_SHOW_TRIGGERED,
      this.cardsContainer.onControlsShowed,
      this.cardsContainer
    );

    this.eventEmitter.off(
      UI_EVENTS.FULLSCREEN_STATUS_CHANGED,
      this.cardsContainer.checkCardsToShow,
      this.cardsContainer
    );
    this.eventEmitter.off(
      UI_EVENTS.PLAYER_HEIGHT_CHANGE_TRIGGERED,
      this.cardsContainer.checkCardsToShow,
      this.cardsContainer
    );
    this.eventEmitter.off(
      UI_EVENTS.PLAYER_WIDTH_CHANGE_TRIGGERED,
      this.cardsContainer.checkCardsToShow,
      this.cardsContainer
    );
  }

  @playerAPI()
  addCard(cardData) {
    const card = new Card({
      ...cardData,
      onClose: () => {
        this.hideCard(card);
      }
    });
    this.cards.push(card);
  }

  @playerAPI()
  addCards(cards) {
    cards.forEach(card => this.addCard(card));
  }

  @playerAPI()
  setFlow(flow) {
    this.cardsContainer.setFlowType(flow);
  }

  @playerAPI()
  setAnchor(anchor) {
    this.cardsContainer.setAnchorPoint(anchor);
  }

  @playerAPI()
  setDirection(direction) {
    this.cardsContainer.setDirection(direction);
  }

  showCard(card) {
    this.cardsContainer.addCard(card);
  }

  hideCard(card) {
    this.cardsContainer.removeCard(card);
  }

  startTimeTracking() {
    this.stopTimeTracking();
    this.trackingInterval = setInterval(this.updateCardsState, CARDS_UPDATE_INTERVAL);
  }

  stopTimeTracking() {
    clearInterval(this.trackingInterval);
  }

  handlePlayerStateChange({ nextState }) {
    switch (nextState) {
      case STATES.PLAYING:
        this.startTimeTracking();
        break;
      case STATES.PAUSED:
        this.stopTimeTracking();
        break;
      case STATES.SEEK_IN_PROGRESS:
        this.updateCardsState();
        break;
      default:
        break;
    }
  }

  updateCardsState() {
    const currentTime = this.engine.getCurrentTime();

    this.cards.forEach(card => {
      this.updateCardState(card, currentTime);
    });
  }

  updateCardState(card, currentTime) {
    if (!card.isDisplayed && card.shouldBeShownAt(currentTime)) {
      this.showCard(card);
    }

    if (card.isDisplayed && !card.shouldBeShownAt(currentTime)) {
      this.hideCard(card);
    }
  }

  destroy() {
    this.stopTimeTracking();
    this.unbindEvents();

    this.cardsContainer.destroy();

    delete this.cardsContainer;
  }
}
