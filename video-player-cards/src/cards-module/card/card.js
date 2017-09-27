import styles from './card.scss';


export default class Card {
  constructor({ contentNode, appearance, onClose }) {
    this.contentNode = contentNode;
    this.isDisplayed = false;
    this.isClosed = false;
    this.onClose = onClose;
    this.initTiming(appearance);
    this.initContainer();
  }

  initTiming(appearance) {
    this.start = appearance.start;
    this.duration = appearance.duration;
    this.end = appearance.start + appearance.duration;
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
    return !this.isClosed && time > this.start && time < this.end;
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
