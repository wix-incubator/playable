import find from 'lodash/find';
import findLastIndex from 'lodash/findLastIndex';
import filter from 'lodash/filter';
import Card from '../card/card';
import { waitForDomUpdate } from '../utils/dom-update-delay';

const CARDS_UPDATE_INTERVAL = 100;
const SLIDER_INTERVAL = 6000;
const CARD_ANIMATION_TIME = 1000;
const CARD_CLOSE_DELAY = 500;

export default class CardsManager {

  constructor({ eventEmitter, engine, cardsContainer, cardsConfig }) {
    this.eventEmitter = eventEmitter;
    this.engine = engine;
    this.cardsContainer = cardsContainer;
    this.cardsConfig = cardsConfig;
    this.availableCards = [];
    this.activeCards = [];
    this.isAnimationEnabled = true;
    this.timeouts = [];
    this.disableAnimationRequestsCount = 0;

    this._updateCardsState = this._updateCardsState.bind(this);
    this.updateCardsOnTimeChange = this.updateCardsOnTimeChange.bind(this);
    this.slideNextCard = this.slideNextCard.bind(this);
    this.handleCardSizeChange = this.handleCardSizeChange.bind(this);

    this.cardsConfig.onChange(this.handleConfigChange, this);
  }

  async addCard(cardData) {
    await this._disableAnimation();
    this._createCard(cardData);
    await this._updateCardsState();
    this._enableAnimation();
  }

  async addCards(cardsData) {
    await this._disableAnimation();
    cardsData.forEach(card => this._createCard(card));
    await this._updateCardsState();
    this._enableAnimation();
  }

  clearCards() {
    this.cardsContainer.removeCardNodes(this.availableCards);
    this.availableCards = [];
    this.activeCards = [];
  }

  _createCard(cardData) {
    const card = new Card({
      ...cardData,
      cardsConfig: this.cardsConfig,
      eventEmitter: this.eventEmitter
    });

    this.availableCards.push(card);
    this._sortCards();
  }

  _sortCards() {
    this.availableCards.sort((card1, card2) => {
      if (card1.from === card2.from) {
        return card1.order > card2.order;
      }

      return card1.from > card2.from;
    });
  }

  handleVideoPlayStart() {
    clearInterval(this.trackingInterval);
    this.trackingInterval = setInterval(this.updateCardsOnTimeChange, CARDS_UPDATE_INTERVAL);
    this.startSlider();
  }

  handleVideoPlayPause() {
    clearInterval(this.trackingInterval);
    this.stopSlider();
  }

  updateCardsOnTimeChange() {
    this._updateCardsState();
  }

  async handleSeekPositionChange() {
    this._cancelDeferredUpdates();
    await this._disableAnimation();
    await this._updateCardsState();
    this._enableAnimation();
  }

  handleCardClose(card) {
    if (!this.cardsConfig.isPreviewMode) {
      this._closeCard(card);
    }
  }

  async handlePlayerSizeChange() {
    this._cancelDeferredUpdates();
    await this._disableAnimation();

    this.resetSliderInterval();
    this._hideNotFittingCards();
    await this._checkIfMoreCardsCanBeShown();
    await this._updateCardsPositions();

    this._enableAnimation();
  }

  handleCardSizeChange() {
    this._hideNotFittingCards();
    this._updateCardsPositions();
  }

  async handleConfigChange() {
    await this._disableAnimation();
    this._clearActiveCards();
    await this._updateCardsState();
    this._enableAnimation();
  }

  // Cards update on time change

  async _updateCardsState() {
    const currentTime = this.engine.getCurrentTime();

    const cardsToDisable = this.availableCards.filter(card => card.isActive && !card.shouldBeActiveAt(currentTime));
    await this._disableCards(cardsToDisable);

    const cardsToEnable = this.availableCards.filter(card => !card.isActive && card.shouldBeActiveAt(currentTime));
    await this._enableCards(cardsToEnable);
  }

  async _disableCards(cards) {
    if (!cards.length) {
      return Promise.resolve();
    }

    this._removeCardsFromActive(cards);

    this._defer(() => this.cardsContainer.removeCardNodes(cards), CARD_ANIMATION_TIME);

    await waitForDomUpdate();
    await this._checkIfMoreCardsCanBeShown();
    await this._updateCardsPositions();
  }

  async _enableCards(cards) {
    if (!cards.length) {
      return Promise.resolve();
    }

    this._addCardsToActive(cards);

    await this.cardsContainer.addCardNodes(cards);
    await this._showCards(cards);
  }

  _addCardsToActive(cards) {
    cards.forEach(card => (card.isActive = true));

    // insert cards after last visible card
    const insertPosition = findLastIndex(this.activeCards, 'isVisible') + 1;
    this.activeCards.splice(insertPosition, 0, ...cards);
  }

  _removeCardsFromActive(cards) {
    cards.forEach(card => {
      this._hideCard(card);
      card.isActive = false;
      this.activeCards.splice(this.activeCards.indexOf(card), 1);
    });
  }

  _clearActiveCards() {
    this._removeCardsFromActive([...this.activeCards]);
  }

  // Sliding cards if they don't fit player size

  startSlider() {
    if (this.sliderInterval) {
      return;
    }
    this.sliderInterval = setInterval(this.slideNextCard, SLIDER_INTERVAL);
  }

  stopSlider() {
    clearInterval(this.sliderInterval);
    this.sliderInterval = null;
  }

  resetSliderInterval() {
    if (!this.sliderInterval) {
      return;
    }
    this.stopSlider();
    this.startSlider();
  }

  slideNextCard() {
    this._showNextCard();

    // show more cards from the left if there is free space
    this._defer(() => {
      this._checkIfMoreCardsCanBeShown();
    }, CARD_ANIMATION_TIME);
  }

  // Manage active cards

  async _showCards(cards = []) {
    const cardsToShow = this._limitToContainerSize(cards);
    this._hideNotFittingCards(cardsToShow);
    await this._prepareCardsToShow(cardsToShow);
    cardsToShow.forEach(card => this._showCard(card));
    await this._updateCardsPositions();
    await waitForDomUpdate();
  }

  _showCard(card) {
    card.show();
    card.addResizeHandler(this.handleCardSizeChange);
    this.resetSliderInterval();
  }

  _hideCard(card) {
    card.removeResizeHandler(this.handleCardSizeChange);
    card.hide();
    this._defer(() => card.setInitialPosition(), CARD_ANIMATION_TIME);
  }

  _showNextCard() {
    const hasHiddenCards = filter(this.activeCards, ['isVisible', false]).length;

    if (!hasHiddenCards) {
      return;
    }

    const cardToShow = find(this.activeCards, ['isVisible', false]);

    return this._showCards([cardToShow]);
  }

  _closeCard(card) {
    this._removeCardsFromActive([card]);

    this._defer(() => this.cardsContainer.removeCardNode(card), CARD_ANIMATION_TIME);
    this._defer(() => this._fillGaps(), CARD_CLOSE_DELAY);
  }

  async _fillGaps() {
    await this._checkIfMoreCardsCanBeShown();
    this._updateCardsPositions();
  }

  _limitToContainerSize(cards) {
    // reduce cards amount to fit container size
    const fittingCards = [];
    const containerSize = this.cardsContainer.getSize();
    let cardsTotalSize = 0;

    cards.forEach(newCard => {
      cardsTotalSize += newCard.getSize();
      if (cardsTotalSize < containerSize) {
        fittingCards.push(newCard);
      }
    });

    return fittingCards;
  }

  _prepareCardsToShow(cards) {
    let initialOffset = 0;

    cards.forEach(card => {
      card.setInitialPosition(initialOffset);
      initialOffset += card.getSize();
    });

    return waitForDomUpdate();
  }

  _hideNotFittingCards(nextVisibleCards = []) {
    const containerSize = this.cardsContainer.getSize();
    const visibleCards = filter(this.activeCards, 'isVisible');

    let totalCardsSize = [...visibleCards, ...nextVisibleCards].reduce((total, card) => total + card.getSize(), 0);

    while (totalCardsSize > containerSize) {
      const cardToHide = this.activeCards.shift();
      this._hideCard(cardToHide);
      this.activeCards.push(cardToHide);
      totalCardsSize -= cardToHide.getSize();
    }
  }

  _checkIfMoreCardsCanBeShown() {
    const containerSize = this.cardsContainer.getSize();
    const cardsToShow = [];

    let nextTotalSize = 0;

    this.activeCards.forEach(card => {
      nextTotalSize += card.getSize();

      if (nextTotalSize < containerSize && !card.isVisible) {
        cardsToShow.push(card);
      }
    });

    if (!cardsToShow.length) {
      return Promise.resolve();
    }

    return this._showCards(cardsToShow);
  }

  _updateCardsPositions() {
    this.activeCards
      .filter(card => card.isVisible)
      .reduceRight((offset, card) => {
        card.updatePosition(offset);
        return offset + card.getSize();
      }, 0);
  }

  // Force card to be visible on screen
  async showSelectedCard(id) {
    await this._disableAnimation();
    const selectedCard = find(this.activeCards, { id });
    if (!selectedCard || selectedCard.isVisible) {
      this._enableAnimation();
      return;
    }

    while (!selectedCard.isVisible) {
      await this._showNextCard();
    }

    this._enableAnimation();
  }

  async _enableAnimation() {
    this.disableAnimationRequestsCount -= 1;
    if (this.disableAnimationRequestsCount === 0) {
      this.isAnimationEnabled = true;
      await this.cardsContainer.enableAnimation();
    }
  }

  async _disableAnimation() {
    this.disableAnimationRequestsCount += 1;
    this.isAnimationEnabled = false;
    await this.cardsContainer.disableAnimation();
  }

  _defer(callback, delay) {
    const timeoutValue = this.isAnimationEnabled ? delay : 0;
    this.timeouts.push(setTimeout(callback, timeoutValue));
  }

  _cancelDeferredUpdates() {
    this.timeouts.forEach(timeout => clearTimeout(timeout));
  }

  destroy() {
    this.stopSlider();
    this._cancelDeferredUpdates();
    delete this.cardsContainer;
  }
}
