import * as $ from 'jbone';

import { TEXT_LABELS } from '../../../../constants/index';

import View from '../../core/view';

import * as styles from './full-screen.scss';

const DATA_HOOK_ATTRIBUTE = 'data-hook';
const DATA_HOOK_CONTROL_VALUE = 'full-screen-control';
const DATA_HOOK_BUTTON_VALUE = 'full-screen-button';

const DATA_IS_IN_FULL_SCREEN = 'data-is-in-full-screen';

class FullScreenView extends View {
  private _callbacks;
  private _texts;

  $node;
  $toggleFullScreenControl;

  constructor(config) {
    super(config);
    const { callbacks, texts } = config;

    this._callbacks = callbacks;
    this._texts = texts;

    this.$node = $('<div>', {
      class: this.styleNames['full-screen-control'],
      [DATA_HOOK_ATTRIBUTE]: DATA_HOOK_CONTROL_VALUE,
      [DATA_IS_IN_FULL_SCREEN]: false,
    });

    this.$toggleFullScreenControl = $('<button>', {
      class: `${this.styleNames['full-screen-toggle']} ${
        this.styleNames['control-button']
      }`,
      [DATA_HOOK_ATTRIBUTE]: DATA_HOOK_BUTTON_VALUE,
      'aria-label': this._texts.get(TEXT_LABELS.ENTER_FULL_SCREEN_LABEL),
      type: 'button',
      tabIndex: 0,
    });

    this.$node.append(this.$toggleFullScreenControl);

    this.setState({ isInFullScreen: false });
    this._bindEvents();
  }

  _bindEvents() {
    this._onButtonClick = this._onButtonClick.bind(this);

    this.$toggleFullScreenControl[0].addEventListener(
      'click',
      this._onButtonClick,
    );
  }

  _unbindEvents() {
    this.$toggleFullScreenControl[0].removeEventListener(
      'click',
      this._onButtonClick,
    );
  }

  _onButtonClick() {
    this.$toggleFullScreenControl[0].focus();
    this._callbacks.onToggleFullScreenButtonClick();
  }

  setState({ isInFullScreen }) {
    this.$toggleFullScreenControl.toggleClass(
      this.styleNames['in-full-screen'],
      isInFullScreen,
    );
    this.$toggleFullScreenControl.attr(
      'aria-label',
      isInFullScreen
        ? this._texts.get(TEXT_LABELS.EXIT_FULL_SCREEN_LABEL)
        : this._texts.get(TEXT_LABELS.ENTER_FULL_SCREEN_LABEL),
    );
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

    delete this._texts;
  }
}

FullScreenView.extendStyleNames(styles);

export default FullScreenView;
