import { ResizeSensor } from 'css-element-queries';
import { VIDEO_EVENTS, UI_EVENTS, STATES } from 'video-player/dist/src/constants';
import playerAPI from 'video-player/dist/src/utils/player-api-decorator';
import noop from 'lodash/noop';

import Card from './card/card';
import CardsContainer from './cards-container/cards-container';


const CARDS_UPDATE_INTERVAL = 100;
const CARDS_UPDATE_ONCLOSE_DELAY = 500;

export default class CardsModule {
  static dependencies = ['eventEmitter', 'rootContainer', 'engine'];

  constructor({ eventEmitter, rootContainer, engine }) {
    this.eventEmitter = eventEmitter;
    this.rootContainer = rootContainer;
    this.engine = engine;

    this.cards = [];
    this.initialized = false;
    this.isCardsClosable = true;

    this._onCardClose = noop;
  }

  initialize() {
    if (this.initialized) {
      return;
    }

    this.initContainer();
    this.bindCallbacks();
    this.bindEvents();
    this.initialized = true;
    this.handlePlayerStateChange({ nextState: this.engine.getCurrentState() });
  }

  initContainer() {
    this.cardsContainer = new CardsContainer({ engine: this.engine });
    this.cardsContainer.setPreviewMode(!this.isCardsClosable);
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
      this.cardsContainer.onSizeChange,
      this.cardsContainer
    );
    this.eventEmitter.on(
      UI_EVENTS.PLAYER_HEIGHT_CHANGE_TRIGGERED,
      this.cardsContainer.onSizeChange,
      this.cardsContainer
    );
    this.eventEmitter.on(
      UI_EVENTS.PLAYER_WIDTH_CHANGE_TRIGGERED,
      this.cardsContainer.onSizeChange,
      this.cardsContainer
    );

    const playerContainerNode = this.rootContainer.node;

    ResizeSensor(playerContainerNode, () => {
      this.cardsContainer.onSizeChange();
    });
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
      this.cardsContainer.onSizeChange,
      this.cardsContainer
    );
    this.eventEmitter.off(
      UI_EVENTS.PLAYER_HEIGHT_CHANGE_TRIGGERED,
      this.cardsContainer.onSizeChange,
      this.cardsContainer
    );
    this.eventEmitter.off(
      UI_EVENTS.PLAYER_WIDTH_CHANGE_TRIGGERED,
      this.cardsContainer.onSizeChange,
      this.cardsContainer
    );
  }

  @playerAPI()
  addCard(cardData) {
    if (!this.initialized) {
      this.initialize();
    }

    const card = new Card({
      ...cardData,
      onClose: () => {
        if (this.isCardsClosable) {
          this.hideCard(card);
          this._onCardClose(cardData);
          setTimeout(() => this.cardsContainer.checkCardsToShow(), CARDS_UPDATE_ONCLOSE_DELAY);
          card.isClosed = true;
        }
      }
    });
    this.cards.push(card);
    this.cardsContainer.disableAnimation();
    this.updateCardsState()
      .then(() => this.cardsContainer.enableAnimation());
  }

  hide() {
    if (this.initialized) {
      this.cardsContainer.hideCards();
    }
  }

  show() {
    if (this.initialized) {
      this.cardsContainer.showCards();
    }
  }

  @playerAPI()
  addCards(cards) {
    cards.forEach(card => this.addCard(card));
  }

  @playerAPI()
  clearCards() {
    this.cards.forEach(card => {
      this.cardsContainer.removeFromContainer(card);
    });
    this.cards = [];
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
    this.cards.forEach(card => {
      this.cardsContainer.removeFromContainer(card);
    });

    this.cardsContainer.setDirection(direction);

    this.updateCardsState();
  }

  @playerAPI()
  onCardClose(callback) {
    this._onCardClose = callback;
  }

  @playerAPI()
  setCardsClosable(isClosable) {
    this.isCardsClosable = isClosable;
    if (this.initialized) {
      this.cardsContainer.setPreviewMode(!isClosable);
    }
  }

  @playerAPI()
  setActiveCard(id) {
    if (this.initialized) {
      this.cardsContainer.setActive(id);
    }
  }

  showCard(card) {
    card.setDisplayed(true);
    this.cardsContainer.addCard(card);
  }

  hideCard(card) {
    card.setDisplayed(false);
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
        this.cardsContainer.checkCardsToShow(nextState);
        break;
      case STATES.PAUSED:
        this.stopTimeTracking();
        this.cardsContainer.stopCarousel();
        break;
      case STATES.SEEK_IN_PROGRESS:
        this.onSeekChange();
        break;
      default:
        break;
    }
  }

  onSeekChange() {
    this.cardsContainer.disableAnimation();
    this.updateCardsState()
      .then(() => this.cardsContainer.enableAnimation());
  }

  updateCardsState() {
    const currentTime = this.engine.getCurrentTime();
    const cardsToUpdate = this.cards.filter(card => card.shouldBeChangedAt(currentTime));

    if (!cardsToUpdate.length) {
      return Promise.resolve();
    }

    cardsToUpdate.forEach(card => {
      card.isDisplayed ? this.hideCard(card) : this.showCard(card);
    });

    return this.cardsContainer.checkCardsToShow();
  }

  destroy() {
    if (!this.initialized) {
      return;
    }

    this.stopTimeTracking();

    this.unbindEvents();

    this.cardsContainer.destroy();

    delete this.cardsContainer;

    this._onCardClose = noop;
  }
}
