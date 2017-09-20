import $ from 'jbone';

import View from '../../core/view';

import styles from './full-screen.scss';


const DATA_HOOK_ATTRIBUTE = 'data-hook';
const DATA_HOOK_CONTROL_VALUE = 'full-screen-control';
const DATA_HOOK_BUTTON_VALUE = 'full-screen-button';

const DATA_IS_IN_FULL_SCREEN = 'data-is-in-full-screen';

class FullScreenView extends View {
  constructor(config) {
    super(config);
    const { callbacks } = config;

    this._callbacks = callbacks;
    this.$node = $('<div>', {
      class: this.styleNames['full-screen-control'],
      [DATA_HOOK_ATTRIBUTE]: DATA_HOOK_CONTROL_VALUE,
      [DATA_IS_IN_FULL_SCREEN]: false
    });

    this.$toggleFullScreenControl = $('<button>', {
      class: `${this.styleNames['full-screen-toggle']} ${this.styleNames['control-button']}`,
      [DATA_HOOK_ATTRIBUTE]: DATA_HOOK_BUTTON_VALUE,
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
    this.$node.attr(DATA_IS_IN_FULL_SCREEN, isInFullScreen);
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
