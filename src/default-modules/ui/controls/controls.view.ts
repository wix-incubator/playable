import * as $ from 'jbone';

import View from '../core/view';

import * as styles from './controls.scss';

class ControlsView extends View {
  private _callbacks;
  $node;
  private $wrapper;
  private $controlsContainerLeft;
  private $controlsContainerRight;
  private $logoContainer;
  private $progressBarContainer;

  constructor(config) {
    super(config);
    const { callbacks } = config;

    this._callbacks = callbacks;
    this.$node = $('<div>', {
      class: this.styleNames['controls-block'],
      'data-hook': 'controls-block',
    });

    const container = $('<div>', {
      class: this.styleNames['container-wrapper'],
    });

    this.$controlsContainerLeft = $('<div>', {
      class: this.styleNames['controls-container-left'],
      'data-hook': 'controls-container-left',
    });

    this.$controlsContainerRight = $('<div>', {
      class: this.styleNames['controls-container-right'],
      'data-hook': 'controls-container-right',
    });

    this.$logoContainer = $('<div>', {
      class: this.styleNames['logo-container'],
    });

    this.$progressBarContainer = $('<div>', {
      class: this.styleNames['progress-bar-container'],
    });

    container
      .append(this.$controlsContainerLeft)
      .append(this.$controlsContainerRight)
      .append(this.$logoContainer);

    this.$node.append(this.$progressBarContainer).append(container);

    this._bindEvents();
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

  show() {
    this.$node.toggleClass(this.styleNames.hidden, false);
  }

  hide() {
    this.$node.toggleClass(this.styleNames.hidden, true);
  }

  getNode() {
    return this.$node[0];
  }

  appendProgressBarNode(node) {
    this.$progressBarContainer.append(node);
  }

  appendControlNodeLeft(node) {
    this.$controlsContainerLeft.append(node);
  }

  appendControlNodeRight(node) {
    this.$controlsContainerRight.append(node);
  }

  appendLogoNode(node) {
    this.$logoContainer.append(node);
  }

  showControlsBlock() {
    this.$node.toggleClass(this.styleNames.activated, true);
  }

  hideControlsBlock() {
    this.$node.toggleClass(this.styleNames.activated, false);
  }

  destroy() {
    this._unbindEvents();
    this.$node.remove();

    delete this.$progressBarContainer;
    delete this.$logoContainer;
    delete this.$controlsContainerLeft;
    delete this.$controlsContainerRight;
    delete this.$node;
  }
}

ControlsView.extendStyleNames(styles);

export default ControlsView;
