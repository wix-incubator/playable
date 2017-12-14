import * as $ from 'jbone';

import View from '../core/view';

import * as styles from './controls.scss';

class ControlsView extends View {
  private _callbacks;
  $node;

  constructor(config) {
    super(config);
    const { callbacks, controls } = config;

    this._callbacks = callbacks;

    this._initDOM(controls);
    this._bindEvents();
  }

  private _initDOM(controls) {
    this.$node = $('<div>', {
      class: this.styleNames['controls-block'],
      'data-hook': 'controls-block',
    });

    const $container = $('<div>', {
      class: this.styleNames['container-wrapper'],
    });

    const $playContainer = $('<div>', {
      class: this.styleNames['play-container'],
    });

    $playContainer.append(controls.play);

    const $volumeContainer = $('<div>', {
      class: this.styleNames['volume-container'],
    });

    $volumeContainer.append(controls.volume);

    const $timeContainer = $('<div>', {
      class: this.styleNames['time-container'],
    });

    $timeContainer.append(controls.time);

    const $fullScreenContainer = $('<div>', {
      class: this.styleNames['full-screen-container'],
    });

    $fullScreenContainer.append(controls.fullScreen);

    const $controlsContainerLeft = $('<div>', {
      class: this.styleNames['controls-container-left'],
      'data-hook': 'controls-container-left',
    });

    const $controlsContainerRight = $('<div>', {
      class: this.styleNames['controls-container-right'],
      'data-hook': 'controls-container-right',
    });

    const $logoContainer = $('<div>', {
      class: this.styleNames['logo-container'],
    });

    $logoContainer.append(controls.logo);

    const $progressBarContainer = $('<div>', {
      class: this.styleNames['progress-bar-container'],
    });

    $progressBarContainer.append(controls.progress);

    $controlsContainerLeft
      .append($playContainer)
      .append($volumeContainer)
      .append($timeContainer);

    $controlsContainerRight.append($fullScreenContainer);

    $container
      .append($controlsContainerLeft)
      .append($controlsContainerRight)
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
      this._callbacks.onControlsBlockMouseMove,
    );
    this.$node[0].addEventListener(
      'mouseleave',
      this._callbacks.onControlsBlockMouseOut,
    );
  }

  private _unbindEvents() {
    this.$node[0].removeEventListener('click', this._preventClickPropagation);
    this.$node[0].removeEventListener(
      'mousemove',
      this._callbacks.onControlsBlockMouseMove,
    );
    this.$node[0].removeEventListener(
      'mouseleave',
      this._callbacks.onControlsBlockMouseOut,
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

  showControlsBlock() {
    this.$node.addClass(this.styleNames.activated);
  }

  hideControlsBlock() {
    this.$node.removeClass(this.styleNames.activated);
  }

  destroy() {
    this._unbindEvents();
    this.$node.remove();

    delete this.$node;
  }
}

ControlsView.extendStyleNames(styles);

export default ControlsView;
