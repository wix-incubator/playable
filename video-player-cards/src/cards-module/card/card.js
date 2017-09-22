import styles from './card.scss';

export default class Card {

  constructor({ contentNode, appearance }) {
    this.contentNode = contentNode;
    this.isDisplayed = false;

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
    this.node.append(this.contentNode);
  }

  shouldBeShownAt(time) {
    return time > this.start && time < this.end;
  }

  setDisplayed(isDisplayed) {
    this.isDisplayed = isDisplayed;
  }
}
