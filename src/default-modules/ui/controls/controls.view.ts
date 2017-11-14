import * as $ from 'jbone';

import View from '../core/view';

import * as styles from './controls.scss';


class ControlsView extends View {
  private _callbacks;
  private $node;
  private $wrapper;
  private $controlsContainer;

  constructor(config) {
    super(config);
    const { callbacks } = config;

    this._callbacks = callbacks;
    this.$node = $('<div>', {
      class: this.styleNames['controls-block'],
      'data-hook': 'controls-block'
    });

    this.$wrapper = $('<div>', {
      class: this.styleNames['controls-wrapper']
    });

    this.$controlsContainer = $('<div>', {
      class: this.styleNames.controls,
      'data-hook': 'controls-container'
    });

    this.$wrapper
      .append(this.$controlsContainer);

    this.$node.append(this.$wrapper);

    this._bindEvents();
  }

  _preventClickPropagation(e) {
    e.stopPropagation();
  }

  _bindEvents() {
    this.$controlsContainer[0].addEventListener('click', this._preventClickPropagation);
    this.$controlsContainer[0].addEventListener('mousemove', this._callbacks.onControlsBlockMouseMove);
    this.$controlsContainer[0].addEventListener('mouseleave', this._callbacks.onControlsBlockMouseOut);
  }

  _unbindEvents() {
    this.$controlsContainer[0].removeEventListener('click', this._preventClickPropagation);
    this.$controlsContainer[0].removeEventListener('mousemove', this._callbacks.onControlsBlockMouseMove);
    this.$controlsContainer[0].removeEventListener('mouseleave', this._callbacks.onControlsBlockMouseOut);
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

  appendComponentNode(node) {
    this.$wrapper.append(node);
  }

  appendControlNode(node) {
    this.$controlsContainer.append(node);
  }

  showControlsBlock() {
    this.$wrapper.toggleClass(this.styleNames.activated, true);
  }

  hideControlsBlock() {
    this.$wrapper.toggleClass(this.styleNames.activated, false);
  }

  destroy() {
    this._unbindEvents();
    this.$node.remove();

    delete this.$wrapper;
    delete this.$controlsContainer;
    delete this.$node;
  }
}

ControlsView.extendStyleNames(styles);

export default ControlsView;
