import { ResizeSensor } from 'css-element-queries';
import { VIDEO_EVENTS, UI_EVENTS, STATES } from '@wix/video-player/dist/src/constants';
import playerAPI from '@wix/video-player/dist/src/utils/player-api-decorator';
import noop from 'lodash/noop';
import { waitForDomUpdate } from './utils/dom-update-delay';

import CardsContainer from './cards-container/cards-container';
import CardsManager from './cards-manager/cards-manager';
import CardsConfig from './cards-config/cards-config';
import { EVENTS } from './constants';

export default class CardsModule {
  static dependencies = ['eventEmitter', 'rootContainer', 'engine'];

  constructor({ eventEmitter, rootContainer, engine }) {
    this.eventEmitter = eventEmitter;
    this.rootContainer = rootContainer;
    this.engine = engine;
    this.cardsConfig = new CardsConfig();

    this.isInitialized = false;

    this.hide = noop;
    this.show = noop;

    this.handlePlayerSizeChange = this.handlePlayerSizeChange.bind(this);
  }

  // Lazy initialization of cards-related stuff
  initialize() {
    if (this.isInitialized) {
      return;
    }

    this.initContainer();
    this.initManager();
    this.initEventListeners();

    this.hide = () => this.cardsContainer.hide();
    this.show = () => this.cardsContainer.show();

    this.isInitialized = true;

    this.handlePlayerStateChange({ nextState: this.engine.getCurrentState() });
  }

  initContainer() {
    this.cardsContainer = new CardsContainer({ cardsConfig: this.cardsConfig });
    this.rootContainer.appendComponentNode(this.cardsContainer.node);
  }

  initManager() {
    this.cardsManager = new CardsManager({
      cardsContainer: this.cardsContainer,
      eventEmitter: this.eventEmitter,
      cardsConfig: this.cardsConfig,
      engine: this.engine
    });
  }

  initEventListeners() {
    this.eventEmitter.on(VIDEO_EVENTS.STATE_CHANGED, this.handlePlayerStateChange, this);

    this.eventEmitter.on(
      UI_EVENTS.MAIN_BLOCK_HIDE_TRIGGERED,
      this.cardsContainer.onControlsHidden,
      this.cardsContainer
    );
    this.eventEmitter.on(
      UI_EVENTS.MAIN_BLOCK_SHOW_TRIGGERED,
      this.cardsContainer.onControlsShown,
      this.cardsContainer
    );

    const playerContainerNode = this.rootContainer.node;

    // wait for playerContainerNode inserted to DOM and get size for case if it's not added yet
    waitForDomUpdate()
      .then(() => (this.resizeSensor = ResizeSensor(playerContainerNode, this.handlePlayerSizeChange)));

    this.eventEmitter.on(EVENTS.CARD_CLOSED, this.cardsManager.handleCardClose, this.cardsManager);
  }

  @playerAPI()
  addCard(cardData) {
    this.initialize();
    return this.cardsManager.addCard(cardData);
  }

  @playerAPI()
  addCards(cardsData) {
    this.initialize();
    return this.cardsManager.addCards(cardsData);
  }

  @playerAPI()
  removeCard(id) {
    this.cardsManager.removeCard(id);
  }

  @playerAPI()
  updateCards(cardData) {
    return this.cardsManager.updateCards(cardData);
  }

  @playerAPI()
  clearCards() {
    if (!this.isInitialized) {
      return;
    }
    this.cardsManager.clearCards();
  }

  @playerAPI()
  setAnchorPoint(anchorPoint) {
    if (this.cardsConfig.anchorPoint === anchorPoint) {
      return;
    }
    this.cardsConfig.anchorPoint = anchorPoint;
  }

  @playerAPI()
  setOrientation(orientation) {
    if (this.cardsConfig.orientation === orientation) {
      return;
    }
    this.cardsConfig.orientation = orientation;
  }

  @playerAPI()
  onCardClose(callback) {
    this.eventEmitter.on(EVENTS.CARD_CLOSED, callback);
  }

  @playerAPI()
  setCardsClosable(isClosable) {
    const isPreviewMode = !isClosable;

    if (this.cardsConfig.isPreviewMode === isPreviewMode) {
      return;
    }

    this.cardsConfig.isPreviewMode = isPreviewMode;
  }

  @playerAPI()
  setActiveCard(id) {
    if (this.isInitialized) {
      return this.cardsManager.showSelectedCard(id);
    }
  }

  handlePlayerSizeChange() {
    this.cardsManager.handlePlayerSizeChange();
  }

  handlePlayerStateChange({ nextState }) {
    switch (nextState) {
      case STATES.PLAYING:
        this.cardsManager.handleVideoPlayStart();
        break;
      case STATES.PAUSED:
        this.cardsManager.handleVideoPlayPause();
        break;
      case STATES.SEEK_IN_PROGRESS:
        this.cardsManager.handleSeekPositionChange();
        break;
      default:
        break;
    }
  }

  unbindEvents() {
    this.eventEmitter.off(VIDEO_EVENTS.STATE_CHANGED, this.handlePlayerStateChange, this);

    this.eventEmitter.off(
      UI_EVENTS.CONTROL_BLOCK_HIDE_TRIGGERED,
      this.cardsContainer.onControlsHidden,
      this.cardsContainer
    );
    this.eventEmitter.off(
      UI_EVENTS.CONTROL_BLOCK_SHOW_TRIGGERED,
      this.cardsContainer.onControlsShown,
      this.cardsContainer
    );

    this.eventEmitter.off(EVENTS.CARD_CLOSED);
  }

  destroy() {
    if (!this.isInitialized) {
      return;
    }

    this.unbindEvents();

    this.cardsContainer.destroy();
    this.cardsManager.destroy();

    if (this.resizeSensor) {
      this.resizeSensor.detach(this.handlePlayerSizeChange);
    }

    delete this.cardsContainer;
    delete this.cardsManager;
  }
}
