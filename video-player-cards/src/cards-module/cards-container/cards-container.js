import styles from './cards-container.scss';


const CAROUSEL_INTERVAL = 2000;
const CARD_REMOVE_TIMEOUT = 200;

export default class CardsContainer {
  static dependencies = ['eventEmitter', 'rootContainer', 'engine'];

  constructor() {
    this.cards = [];
    this.initUI();

    this.bindCallbacks();
  }

  initUI() {
    this.node = document.createElement('div');
    this.moveContainerToBottom();
  }


  bindCallbacks() {
    this.slideNextCard = this.slideNextCard.bind(this);
  }

  moveContainerToTop() {
    this.node.className = `${styles.container} ${styles['controls-showed']}`;
  }

  moveContainerToBottom() {
    this.node.className = `${styles.container}`;
  }

  addCard(card) {
    card.appear();

    this.cards.push(card);
    this.node.prepend(card.node);

    this.checkNeedsOfCarousel();
  }

  removeCard(card) {
    card.disappear();

    this.cards.splice(this.cards.indexOf(card), 1);
    setTimeout(() => {
      if (card.node.parentNode === this.node) {
        this.node.removeChild(card.node);
      }
    }, CARD_REMOVE_TIMEOUT);

    this.checkNeedsOfCarousel();
  }

  checkNeedsOfCarousel() {
    let occupiedWidth = 0;

    this.cards.forEach(card => {
      if (card.isDisplayed) {
        occupiedWidth += card.node.offsetWidth;
      }
    });

    if (occupiedWidth > this.node.offsetWidth) {
      this.startCarousel();
    } else {
      this.stopCarousel();
    }
  }

  slideNextCard() {
    this.node.prepend(this.node.lastElementChild);
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
