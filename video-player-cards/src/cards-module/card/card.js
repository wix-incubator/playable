import classnames from 'classnames';
import { ResizeSensor } from 'css-element-queries';
import { ORIENTATIONS, DIRECTIONS, EVENTS } from '../constants';
import styles from './card.scss';

const positionProperties = {
  [ORIENTATIONS.HORIZONTAL]: {
    [DIRECTIONS.STANDARD]: 'left',
    [DIRECTIONS.REVERSE]: 'right'
  },
  [ORIENTATIONS.VERTICAL]: {
    [DIRECTIONS.STANDARD]: 'top',
    [DIRECTIONS.REVERSE]: 'bottom'
  }
};

export default class Card {
  constructor({ eventEmitter, cardsConfig, contentNode, from, to, order, id, hasDynamicContent = false }) {
    this.eventEmitter = eventEmitter;
    this.cardsConfig = cardsConfig;
    this.contentNode = contentNode;
    this.isActive = false;
    this.isVisible = false;
    this.isClosed = false;
    this.from = from / 1000;
    this.to = to / 1000;
    this.order = order;
    this.id = id;

    // for cards that can be resized after load and need ResizeSensor
    this.hasDynamicContent = hasDynamicContent;

    this.initContainer();
  }

  setTabIndex(tabIndex) {
    this.node.tabIndex = tabIndex;
  }

  initContainer() {
    this.node = document.createElement('div');
    this.node.className = classnames(styles.container, styles.hidden, 'action-card');

    const closeButton = document.createElement('div');
    closeButton.className = styles['close-button'];

    this.node.appendChild(this.contentNode);
    this.node.appendChild(closeButton);

    closeButton.addEventListener('click', this.close.bind(this));
  }

  show() {
    this.isVisible = true;
    this.node.classList.remove(styles.hidden);
    this.node.classList.add(styles.visible);
  }

  hide() {
    this.isVisible = false;
    this.node.classList.remove(styles.visible);
    this.node.classList.add(styles.hidden);
  }

  close() {
    this.isClosed = true;
    this.eventEmitter.emit(EVENTS.CARD_CLOSED, this);
  }

  shouldBeActiveAt(time) {
    return !this.isClosed && time >= this.from && time <= this.to;
  }

  getSize() {
    const { orientation } = this.cardsConfig;
    return orientation === ORIENTATIONS.HORIZONTAL ? this.node.offsetWidth : this.node.offsetHeight;
  }

  setInitialPosition(offset = 0) {
    this.node.style.left = 'auto';
    this.node.style.right = 'auto';
    // set negative position to a card for animate its appearance from screen border
    this.updatePosition(-1 * (this.getSize() + offset));
  }

  updatePosition(offset) {
    const { orientation, direction } = this.cardsConfig;
    const positionProperty = positionProperties[orientation][direction];
    this.node.style[positionProperty] = `${offset}px`;
  }

  addResizeHandler(handler) {
    if (!this.resizeSensor && this.hasDynamicContent) {
      this.resizeSensor = new ResizeSensor(this.node, handler);
    }
  }

  removeResizeHandler(handler) {
    if (this.resizeSensor) {
      this.resizeSensor.detach(handler);
    }
  }
}
