import styles from './cards-container.scss';
import { DIRECTIONS, FLOW_TYPES, ANCHOR_POINTS } from '../constants';


const CAROUSEL_INTERVAL = 4000;
const CARD_REMOVE_TIMEOUT = 200;

export default class CardsContainer {
  static dependencies = ['eventEmitter', 'rootContainer', 'engine'];

  constructor() {
    this.cards = [];

    this.bindCallbacks();

    this.initUI();

    this.setDirection(DIRECTIONS.STANDARD);
    this.setFlowType(FLOW_TYPES.HORIZONTAL);
    this.setAnchorPoint(ANCHOR_POINTS.BOTTOM_LEFT);
  }

  initUI() {
    this.node = document.createElement('div');
    this.node.classList.add(styles.container);
    this.onControlsShowed();
  }

  bindCallbacks() {
    this.slideNextCard = this.slideNextCard.bind(this);
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

  addCard(card) {
    card.setDisplayed(true);

    this.cards.unshift(card);

    this.node.insertBefore(card.node, this.node.firstElementChild);

    this.checkCardsToShow();
  }

  removeCard(card) {
    card.disappear();

    this.cards.splice(this.cards.indexOf(card), 1);

    setTimeout(() => {
      if (!card.isDisplayed && card.node && card.node.parentNode === this.node) {
        this.node.removeChild(card.node);
      }
    }, CARD_REMOVE_TIMEOUT);

    this.checkCardsToShow();
  }

  slideNextCard() {
    this.node.insertBefore(this.node.lastElementChild, this.node.firstElementChild);

    this.cards.unshift(this.cards.pop());
    this.checkCardsToShow();
  }

  checkCardsToShow() {
    let occupiedSize = 0;
    let allCardsShown = true;
    const availableSize = (this.flowType === FLOW_TYPES.HORIZONTAL) ? this.node.offsetWidth : this.node.offsetHeight;

    this.cards
      .forEach((currentCard, childIndex) => {
        const cardNode = currentCard.node;

        if (this.flowType === FLOW_TYPES.HORIZONTAL) {
          occupiedSize += cardNode.offsetWidth;
        } else {
          occupiedSize += cardNode.offsetHeight;
        }

        if (occupiedSize > availableSize) {
          if (childIndex === 0) {
            currentCard.show();
          } else {
            currentCard.hide();
            allCardsShown = false;
          }
        } else {
          currentCard.show();
        }
      });

    if (allCardsShown) {
      this.stopCarousel();
    } else {
      this.startCarousel();
    }
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

    delete this.cards;
    delete this.node;
  }
}
