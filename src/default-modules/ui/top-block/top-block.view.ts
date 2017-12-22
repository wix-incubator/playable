import * as $ from 'jbone';

import View from '../core/view';

import * as styles from './top-block.scss';

class TopBlockView extends View {
  $node;

  constructor(config) {
    super();
    const { elements } = config;

    this._initDOM(elements);
    this._bindEvents();
  }

  private _initDOM(elements) {
    this.$node = $('<div>', {
      class: this.styleNames['top-block'],
      'data-hook': 'top-block',
    });

    const $elementsContainer = $('<div>', {
      class: this.styleNames['elements-container'],
    });

    const $titleContainer = $('<div>', {
      class: this.styleNames['title-container'],
    });

    $titleContainer.append(elements.title);

    const $liveIndicatorContainer = $('<div>', {
      class: this.styleNames['live-indicator-container'],
    });

    $liveIndicatorContainer.append(elements.liveIndicator);

    $elementsContainer.append($liveIndicatorContainer).append($titleContainer);

    this.$node.append($elementsContainer);
  }

  private _preventClickPropagation(e) {
    e.stopPropagation();
  }

  private _bindEvents() {
    this.$node[0].addEventListener('click', this._preventClickPropagation);
  }

  private _unbindEvents() {
    this.$node[0].removeEventListener('click', this._preventClickPropagation);
  }

  show() {
    this.$node.toggleClass(this.styleNames.hidden, false);
  }

  hide() {
    this.$node.toggleClass(this.styleNames.hidden, true);
  }

  getNode() {
    return this.$node[0];
  }

  showContent() {
    this.$node.addClass(this.styleNames.activated);
  }

  hideContent() {
    this.$node.removeClass(this.styleNames.activated);
  }

  destroy() {
    this._unbindEvents();
    this.$node.remove();

    delete this.$node;
  }
}

TopBlockView.extendStyleNames(styles);

export default TopBlockView;
