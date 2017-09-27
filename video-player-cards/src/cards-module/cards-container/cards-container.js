import styles from './cards-container.scss';


const CAROUSEL_INTERVAL = 4000;
const CARD_REMOVE_TIMEOUT = 200;

export const DIRECTIONS = {
  STANDARD: 'direction-standard',
  REVERSE: 'direction-reserve'
};

export const FLOW_TYPE = {
  VERTICAL: 'flow-vertical',
  HORIZONTAL: 'flow-horizontal'
};

export const ANCHOR_POINTS = {
  TOP_LEFT: 'anchor-top-left',
  TOP_RIGHT: 'anchor-top-right',
  BOTTOM_LEFT: 'anchor-bottom-left',
  BOTTOM_RIGHT: 'anchor-bottom-right'
};

export default class CardsContainer {
  static dependencies = ['eventEmitter', 'rootContainer', 'engine'];

  constructor() {
    this.cards = [];

    this.bindCallbacks();

    this.initUI();

    this.setDirection(DIRECTIONS.STANDARD);
    this.setFlowType(FLOW_TYPE.HORIZONTAL);
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
    this.direction = newDirection;

    Object.keys(DIRECTIONS).forEach(direction => {
      this.node.classList.remove(styles[direction]);
    });

    this.node.classList.add(styles[this.direction]);
  }

  setAnchorPoint(newPoint) {
    this.anchorPoint = newPoint;

    Object.keys(ANCHOR_POINTS).forEach(point => {
      this.node.classList.remove(styles[point]);
    });

    this.node.classList.add(styles[this.anchorPoint]);
  }

  setFlowType(newFlowType) {
    this.flowType = newFlowType;

    Object.keys(FLOW_TYPE).forEach(type => {
      this.node.classList.remove(styles[type]);
    });

    this.node.classList.add(styles[this.flowType]);
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
    const availableSize = (this.flowType === FLOW_TYPE.HORIZONTAL) ? this.node.offsetWidth : this.node.offsetHeight;

    this.cards
      .forEach((currentCard, childIndex) => {
        const cardNode = currentCard.node;

        if (this.flowType === FLOW_TYPE.HORIZONTAL) {
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
