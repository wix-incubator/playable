import { ResizeSensor } from 'css-element-queries';
import throttle from 'lodash/throttle';
import find from 'lodash/find';
import { STATES } from 'video-player/dist/src/constants';
import styles from './cards-container.scss';
import { DIRECTIONS, FLOW_TYPES, ANCHOR_POINTS } from '../constants';

const CAROUSEL_INTERVAL = 6000;
const CARD_REMOVE_TIMEOUT = 1000;

export default class CardsContainer {

  constructor({ engine }) {
    this.cards = [];
    this.timeouts = [];
    this.engine = engine;

    this.bindCallbacks();

    this.initUI();

    this.setDirection(DIRECTIONS.STANDARD);
    this.setFlowType(FLOW_TYPES.HORIZONTAL);
    this.setAnchorPoint(ANCHOR_POINTS.BOTTOM_LEFT);

    this.enableAnimation();
  }

  initUI() {
    this.node = document.createElement('div');
    this.node.classList.add(styles.container);
    this.onControlsShowed();
  }

  bindCallbacks() {
    this.slideNextCard = this.slideNextCard.bind(this);
    this.handleCardSizeChange = throttle(this.handleCardSizeChange.bind(this), 200);
  }

  hideCards() {
    this.node.classList.add(styles.hidden);
  }

  showCards() {
    this.node.classList.remove(styles.hidden);
  }

  onControlsShowed() {
    this.node.classList.add(styles['controls-showed']);
  }

  onControlsHided() {
    this.node.classList.remove(styles['controls-showed']);
  }

  setDirection(newDirection) {
    if (newDirection === this.direction) {
      return;
    }

    this.direction = newDirection;
    this.node.setAttribute('data-direction', this.direction);
    this.checkCardsToShow();
  }

  setAnchorPoint(newPoint) {
    if (newPoint === this.anchorPoint) {
      return;
    }

    this.anchorPoint = newPoint;
    this.node.setAttribute('data-anchor-point', this.anchorPoint);
  }

  setFlowType(newFlowType) {
    if (newFlowType === this.flowType) {
      return;
    }

    this.flowType = newFlowType;
    this.node.setAttribute('data-flow-type', this.flowType);

    this.checkCardsToShow();
  }

  enableAnimation() {
    this.isAnimationEnabled = true;
  }

  disableAnimation() {
    this.isAnimationEnabled = false;
  }

  onSizeChange() {
    this.disableAnimation();
    this.checkCardsToShow()
      .then(() => this.enableAnimation());
  }

  addCard(card) {
    this.cards.unshift(card);
    this.node.insertBefore(card.node, this.node.firstElementChild);
    this.resetCard(card);
    this.sortCards();
  }

  removeCard(card) {
    this.hideCard(card);

    if (this.isAnimationEnabled) {
      this.timeouts.push(setTimeout(() => this.removeFromContainer(card), CARD_REMOVE_TIMEOUT));
    } else {
      this.removeFromContainer(card);
    }
  }

  removeFromContainer(card) {
    this.cards.splice(this.cards.indexOf(card), 1);
    this.resetCard(card);
    card.setDisplayed(false);

    if (card.node.parentNode === this.node) {
      this.node.removeChild(card.node);
    }
  }

  handleCardSizeChange() {
    this.checkCardsToShow();
  }

  slideNextCard() {
    const card = this.cards.pop();
    this.resetCard(card);

    this.node.insertBefore(this.node.lastElementChild, this.node.firstElementChild);

    this.cards.unshift(card);
    this.checkCardsToShow();
  }

  resetCard(card) {
    card.setInitialPosition(this.flowType, this.direction);
  }

  checkCardsToShow(nextPlayerState) {
    let occupiedSize = 0;
    let allCardsShown = true;
    const availableSize = (this.flowType === FLOW_TYPES.HORIZONTAL) ? this.node.offsetWidth : this.node.offsetHeight;

    this.cards
      .forEach((currentCard, childIndex) => {

        occupiedSize += currentCard.getFlowDimension(this.flowType);

        if (occupiedSize > availableSize) {
          if (childIndex === 0) {
            this.showCard(currentCard);
          } else {
            this.hideCard(currentCard);
            allCardsShown = false;
          }
        } else {
          this.showCard(currentCard);
        }
      });

    if (!allCardsShown && this.canSlideCards(nextPlayerState)) {
      this.startCarousel();
    } else {
      this.stopCarousel();
    }

    return this.updateCardsPositions();
  }

  canSlideCards(nextPlayerState) {
    const state = this.engine.getCurrentState();
    return state === STATES.PLAYING || state === STATES.PLAY_REQUESTED || nextPlayerState === STATES.PLAYING;
  }


  showCard(card) {
    if (card.isDisplayed) {
      card.appear();
      if (!card.resizeSensor) {
        card.resizeSensor = new ResizeSensor(card.node, this.handleCardSizeChange);
      }
    }
  }

  hideCard(card) {
    if (card.resizeSensor) {
      card.resizeSensor.detach(this.handleCardSizeChange);
    }
    card.disappear();
    setTimeout(() => card.hideContent(), CARD_REMOVE_TIMEOUT);
  }

  sortCards() {
    this.cards.sort((card1, card2) => {
      if (card1.from === card2.from) {
        return card1.order < card2.order;
      }

      return card1.from < card2.from;
    });
  }

  setActive(id) {
    const activeCard = find(this.cards, { id });
    if (!activeCard) {
      return;
    }

    while (!activeCard.isVisible) {
      this.slideNextCard();
    }
  }

  updateCardsPositions() {
    return Promise.resolve()
      .then(() => {
        this.cards
          .filter(card => card.isVisible)
          .reduce((offset, card) => {
            card.setAnimationEnabled(this.isAnimationEnabled);
            card.updatePosition(this.flowType, this.direction, offset);
            return offset + card.getFlowDimension(this.flowType);
          }, 0);
      });
  }

  startCarousel() {
    if (this.carouselInterval) {
      return;
    }

    this.carouselInterval = setInterval(this.slideNextCard, CAROUSEL_INTERVAL);
  }

  stopCarousel() {
    clearInterval(this.carouselInterval);
    this.carouselInterval = null;
  }

  destroy() {
    this.stopCarousel();

    if (this.node.parentNode) {
      this.node.parentNode.removeChild(this.node);
    }

    this.timeouts.forEach(timeout => clearTimeout(timeout));

    delete this.cards;
    delete this.node;
  }
}
