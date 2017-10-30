import classnames from 'classnames';
import { FLOW_TYPES, DIRECTIONS } from '../constants';
import styles from './card.scss';

const positionProperties = {
  [FLOW_TYPES.HORIZONTAL]: {
    [DIRECTIONS.STANDARD]: 'left',
    [DIRECTIONS.REVERSE]: 'right'
  },
  [FLOW_TYPES.VERTICAL]: {
    [DIRECTIONS.STANDARD]: 'top',
    [DIRECTIONS.REVERSE]: 'bottom'
  }
};

export default class Card {
  constructor({ contentNode, onClose, from, to, order }) {
    this.contentNode = contentNode;
    this.isDisplayed = false;
    this.isClosed = false;
    this.onClose = onClose;
    this.from = from / 1000;
    this.to = to / 1000;
    this.order = order;
    this.initContainer();
  }

  initContainer() {
    this.node = document.createElement('div');
    this.node.className = classnames(styles.container, styles.animated);

    const closeButton = document.createElement('div');
    closeButton.className = styles['close-button'];

    this.node.appendChild(this.contentNode);
    this.node.appendChild(closeButton);

    closeButton.addEventListener('click', this.close.bind(this));
  }

  shouldBeShownAt(time) {
    return !this.isClosed && time >= this.from && time <= this.to;
  }

  shouldBeChangedAt(time) {
    return this.isDisplayed ? !this.shouldBeShownAt(time) : this.shouldBeShownAt(time);
  }

  setDisplayed(isDisplayed) {
    this.isDisplayed = isDisplayed;
    this.node.setAttribute('data-is-displayed', isDisplayed);
  }

  appear() {
    this.node.style.minWidth = 0;
    this.node.style.opacity = 1;
  }

  disappear() {
    this.node.style.minWidth = `${this.node.offsetWidth}px`;
    this.node.style.opacity = 0;
  }

  setAnimationEnabled(isEnabled) {
    this.node.className = classnames(styles.container, { [styles.animated]: isEnabled });
  }

  getFlowDimension(flowType) {
    return flowType === FLOW_TYPES.HORIZONTAL ? this.node.offsetWidth : this.node.offsetHeight;
  }

  setInitialPosition(flowType, direction) {
    this.updatePosition(flowType, direction, -this.getFlowDimension(flowType));
  }

  updatePosition(flowType, direction, offset) {
    const positionProperty = positionProperties[flowType][direction];
    this.node.style[positionProperty] = `${offset}px`;
  }

  close() {
    this.onClose(this);
    this.isClosed = true;
  }
}
