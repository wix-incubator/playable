import $ from 'jbone';

import styles from './controls.scss';


export default class ControlsView {
  static _styles = styles;

  static extendStyleNames(styles) {
    this._styles = { ...this._styles, ...styles };
  }

  constructor({ callbacks }) {
    this._callbacks = callbacks;
    this.$node = $('<div>', {
      class: this.styleNames['controls-block'],
      tabIndex: 0
    });

    this.$wrapper = $('<div>', {
      class: this.styleNames['controls-wrapper'],
      tabIndex: 0
    });

    const background = $('<div>', {
      class: this.styleNames['gradient-background']
    });

    this.$controlsContainer = $('<div>', {
      class: this.styleNames.controls,
      'data-hook': 'controls-container'
    });

    this.$wrapper
      .append(background)
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

  get styleNames() {
    return this.constructor._styles;
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
