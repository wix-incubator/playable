import $ from 'jbone';
import styles from './cards-container.scss';


const CAROUSEL_INTERVAL = 2000;
const CARD_REMOVE_TIMEOUT = 200;

export const DIRECTIONS = {
  LEFT_TO_RIGHT: 'direction-left-to-right',
  RIGHT_TO_LEFT: 'direction-right-to-left'
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

    this.setDirection(DIRECTIONS.LEFT_TO_RIGHT);
    this.setAnchorPoint(ANCHOR_POINTS.BOTTOM_LEFT);
  }

  get node() {
    return this.$node[0];
  }

  initUI() {
    this.$node = $('<div>', {
      class: styles.container
    });
    this.onControlsShowed();
  }

  bindCallbacks() {
    this.slideNextCard = this.slideNextCard.bind(this);
  }

  onControlsShowed() {
    this.$node.addClass(styles['controls-showed']);
  }

  onControlsHided() {
    this.$node.removeClass(styles['controls-showed']);
  }

  setDirection(newDirection) {
    this.direction = newDirection;

    Object.keys(DIRECTIONS).forEach(direction => {
      this.$node.removeClass(styles[direction]);
    });

    this.$node.addClass(styles[this.direction]);
  }

  setAnchorPoint(newPoint) {
    this.anchorPoint = newPoint;

    Object.keys(ANCHOR_POINTS).forEach(point => {
      this.$node.removeClass(styles[point]);
    });

    this.$node.addClass(styles[this.anchorPoint]);
  }

  addCard(card) {
    card.appear();

    this.cards.push(card);
    this.$node[0].insertBefore(card.node, this.$node[0].firstElementChild);

    this.checkNeedsOfCarousel();
  }

  removeCard(card) {
    card.disappear();

    this.cards.splice(this.cards.indexOf(card), 1);
    setTimeout(() => {
      if (card.node.parentNode === this.$node[0]) {
        this.$node[0].removeChild(card.node);
      }
    }, CARD_REMOVE_TIMEOUT);

    this.checkNeedsOfCarousel();
  }

  checkNeedsOfCarousel() {
    if (!this.cards.length) {
      this.stopCarousel();
      return;
    }

    let occupiedWidth = 0;

    this.cards.forEach(card => {
      if (card.isDisplayed) {
        occupiedWidth += card.node.offsetWidth;
      }
    });

    if (occupiedWidth > this.$node[0].offsetWidth) {
      this.startCarousel();
    } else {
      this.stopCarousel();
    }
  }

  slideNextCard() {
    this.$node[0].insertBefore(this.$node[0].lastElementChild, this.$node[0].firstElementChild);
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

    this.$node.remove();

    delete this.cards;
    delete this.$node;
  }
}
