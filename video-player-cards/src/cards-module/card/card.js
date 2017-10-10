import styles from './card.scss';


export default class Card {
  constructor({ contentNode, onClose, from, to }) {
    this.contentNode = contentNode;
    this.isDisplayed = false;
    this.isClosed = false;
    this.onClose = onClose;
    this.from = from / 1000;
    this.to = to / 1000;
    this.initContainer();
  }

  initContainer() {
    this.node = document.createElement('div');
    this.node.className = styles.container;

    const closeButton = document.createElement('div');
    closeButton.className = styles['close-button'];

    this.node.appendChild(this.contentNode);
    this.node.appendChild(closeButton);

    closeButton.addEventListener('click', this.close.bind(this));
  }

  shouldBeShownAt(time) {
    return !this.isClosed && time > this.from && time < this.to;
  }

  setDisplayed(isDisplayed) {
    this.isDisplayed = isDisplayed;
    this.node.setAttribute('data-is-displayed', isDisplayed);
  }

  appear() {
    this.setDisplayed(true);
    this.show();
  }

  disappear() {
    this.setDisplayed(false);
    this.hide();
  }

  close() {
    this.onClose(this);
    this.isClosed = true;
  }

  show() {
    this.node.className = `${styles.container} ${styles.shown}`;
  }

  hide() {
    this.node.className = `${styles.container} ${styles.hidden}`;
  }
}
