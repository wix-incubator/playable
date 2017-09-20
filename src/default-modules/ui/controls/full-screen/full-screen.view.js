import $ from 'jbone';

import View from '../../core/view';

import styles from './full-screen.scss';


class FullScreenView extends View {
  constructor(config) {
    super(config);
    const { callbacks } = config;

    this._callbacks = callbacks;
    this.$node = $('<div>', {
      class: this.styleNames['full-screen-control'],
      'data-hook': 'full-screen-control'
    });

    this.$toggleFullScreenControl = $('<button>', {
      class: `${this.styleNames['full-screen-toggle']} ${this.styleNames['control-button']}`,
      'data-hook': 'full-screen-button',
      type: 'button',
      tabIndex: 0
    });

    this.$node
      .append(this.$toggleFullScreenControl);

    this.setState({ isInFullScreen: false });
    this._bindEvents();
  }

  _bindEvents() {
    this._onButtonClick = this._onButtonClick.bind(this);

    this.$toggleFullScreenControl[0].addEventListener('click', this._onButtonClick);
  }

  _unbindEvents() {
    this.$toggleFullScreenControl[0].removeEventListener('click', this._onButtonClick);
  }

  _onButtonClick() {
    this.$toggleFullScreenControl[0].focus();
    this._callbacks.onToggleFullScreenButtonClick();
  }

  setState({ isInFullScreen }) {
    this.$toggleFullScreenControl.toggleClass(this.styleNames['in-full-screen'], isInFullScreen);
  }

  hide() {
    this.$node.toggleClass(this.styleNames.hidden, true);
  }

  show() {
    this.$node.toggleClass(this.styleNames.hidden, false);
  }

  getNode() {
    return this.$node[0];
  }

  destroy() {
    this._unbindEvents();
    this.$node.remove();

    delete this.$toggleFullScreenControl;
    delete this.$node;
  }
}

FullScreenView.extendStyleNames(styles);

export default FullScreenView;
