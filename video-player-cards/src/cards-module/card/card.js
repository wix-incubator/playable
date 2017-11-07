import classnames from 'classnames';
import { ResizeSensor } from 'css-element-queries';
import { ORIENTATIONS, DIRECTIONS } from '../constants';
import { CARD_CLOSED } from '../constants/events';
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
  constructor({ eventEmitter, cardsConfig, contentNode, from, to, order, clientId }) {
    this.eventEmitter = eventEmitter;
    this.cardsConfig = cardsConfig;
    this.contentNode = contentNode;
    this.isActive = false;
    this.isVisible = false;
    this.isClosed = false;
    this.from = from / 1000;
    this.to = to / 1000;
    this.order = order;

    //TODO change to 'id'
    this.id = clientId;
    this.initContainer();
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
    this.eventEmitter.emit(CARD_CLOSED, this);
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
    this.updatePosition(-(this.getSize() + offset));
  }

  updatePosition(offset) {
    const { orientation, direction } = this.cardsConfig;
    const positionProperty = positionProperties[orientation][direction];
    this.node.style[positionProperty] = `${offset}px`;
  }

  addResizeHandler(handler) {
    if (!this.resizeSensor) {
      this.resizeSensor = new ResizeSensor(this.node, handler);
    }
  }

  removeResizeHandler(handler) {
    if (this.resizeSensor) {
      this.resizeSensor.detach(handler);
    }
  }
}
