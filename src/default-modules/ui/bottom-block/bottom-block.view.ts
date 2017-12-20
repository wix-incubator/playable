import * as $ from 'jbone';

import View from '../core/view';

import * as styles from './bottom-block.scss';

class BottomBlockView extends View {
  private _callbacks;
  $node;

  constructor(config) {
    super();
    const { callbacks, elements } = config;

    this._callbacks = callbacks;

    this._initDOM(elements);
    this._bindEvents();
  }

  private _initDOM(elements) {
    this.$node = $('<div>', {
      class: this.styleNames['bottom-block'],
      'data-hook': 'bottom-block',
    });

    const $container = $('<div>', {
      class: this.styleNames['container-wrapper'],
    });

    const $playContainer = $('<div>', {
      class: this.styleNames['play-container'],
    });

    $playContainer.append(elements.play);

    const $volumeContainer = $('<div>', {
      class: this.styleNames['volume-container'],
    });

    $volumeContainer.append(elements.volume);

    const $timeContainer = $('<div>', {
      class: this.styleNames['time-container'],
    });

    $timeContainer.append(elements.time);

    const $fullScreenContainer = $('<div>', {
      class: this.styleNames['full-screen-container'],
    });

    $fullScreenContainer.append(elements.fullScreen);

    const $containerLeft = $('<div>', {
      class: this.styleNames['controls-container-left'],
      'data-hook': 'controls-container-left',
    });

    const $containerRight = $('<div>', {
      class: this.styleNames['controls-container-right'],
      'data-hook': 'controls-container-right',
    });

    const $logoContainer = $('<div>', {
      class: this.styleNames['logo-container'],
    });

    $logoContainer.append(elements.logo);

    const $progressBarContainer = $('<div>', {
      class: this.styleNames['progress-bar-container'],
    });

    $progressBarContainer.append(elements.progress);

    $containerLeft
      .append($playContainer)
      .append($volumeContainer)
      .append($timeContainer);

    $containerRight.append($fullScreenContainer);

    $container
      .append($containerLeft)
      .append($containerRight)
      .append($logoContainer);

    this.$node.append($progressBarContainer).append($container);
  }

  private _preventClickPropagation(e) {
    e.stopPropagation();
  }

  private _bindEvents() {
    this.$node[0].addEventListener('click', this._preventClickPropagation);
    this.$node[0].addEventListener(
      'mousemove',
      this._callbacks.onBlockMouseMove,
    );
    this.$node[0].addEventListener(
      'mouseleave',
      this._callbacks.onBlockMouseOut,
    );
  }

  private _unbindEvents() {
    this.$node[0].removeEventListener('click', this._preventClickPropagation);
    this.$node[0].removeEventListener(
      'mousemove',
      this._callbacks.onBlockMouseMove,
    );
    this.$node[0].removeEventListener(
      'mouseleave',
      this._callbacks.onBlockMouseOut,
    );
  }

  setShouldLogoShowAlwaysFlag(isShowAlways: boolean) {
    this.$node.toggleClass(this.styleNames['show-logo-always'], isShowAlways);
    this.$node.removeClass(this.styleNames['logo-hidden']);
  }

  hideLogo() {
    this.$node.addClass(this.styleNames['logo-hidden']);
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

BottomBlockView.extendStyleNames(styles);

export default BottomBlockView;
