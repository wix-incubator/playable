import styles from './cards-container.scss';
import { ORIENTATIONS, EVENTS } from '../constants';
import { waitForDomUpdate } from '../utils/dom-update-delay';

export default class CardsContainer {

  constructor({ cardsConfig }) {
    this.cardsConfig = cardsConfig;
    this.initUI();
    this.handleConfigChange();
    this.cardsConfig.on(EVENTS.CONFIG_CHANGED, this.handleConfigChange, this);
  }

  initUI() {
    this.node = document.createElement('div');
    this.node.classList.add(styles.container);
    this.onControlsShown();
    this.enableAnimation();
  }

  handleConfigChange() {
    const { isPreviewMode, anchorPoint } = this.cardsConfig;
    isPreviewMode ? this.enablePreviewMode() : this.disablePreviewMode();
    this.setAnchorPoint(anchorPoint);
  }

  hide() {
    this.node.classList.add(styles.hidden);
  }

  show() {
    this.node.classList.remove(styles.hidden);
  }

  enablePreviewMode() {
    this.node.classList.add('preview-mode');
  }

  disablePreviewMode() {
    this.node.classList.remove('preview-mode');
  }

  onControlsShown() {
    this.node.classList.add(styles['controls-showed']);
  }

  onControlsHidden() {
    this.node.classList.remove(styles['controls-showed']);
  }

  setAnchorPoint(anchorPoint) {
    this.node.setAttribute('data-anchor-point', anchorPoint);
  }

  enableAnimation() {
    this.node.classList.add('animated');
    return waitForDomUpdate();
  }

  disableAnimation() {
    this.node.classList.remove('animated');
    return waitForDomUpdate();
  }

  addCardNodes(cards) {
    cards.forEach(card => this.node.appendChild(card.node));
    return waitForDomUpdate();
  }

  removeCardNodes(cards) {
    cards.forEach(card => this.removeCardNode(card));
  }

  removeCardNode(card) {
    if (card.node.parentNode === this.node) {
      this.node.removeChild(card.node);
    }
  }

  getSize() {
    const { orientation } = this.cardsConfig;
    return orientation === ORIENTATIONS.HORIZONTAL ? this.node.offsetWidth : this.node.offsetHeight;
  }

  destroy() {
    if (this.node.parentNode) {
      this.node.parentNode.removeChild(this.node);
    }
    delete this.node;
  }
}
