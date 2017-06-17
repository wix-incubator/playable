import $ from 'jbone';

import View from '../../core/view';

import styles from './full-screen.scss';


const translations = {
  enterFullScreen: 'Full screen',
  exitFullScreen: 'Exit Full screen'
};

class FullScreenView extends View {
  constructor(config) {
    super(config);
    const { callbacks } = config;

    this._callbacks = callbacks;
    this.$node = $('<div>', {
      class: this.styleNames['full-screen-control'],
      'data-tooltip-pos': 'up'
    });

    this.$toggleFullScreenControl = $('<div>', {
      class: `${this.styleNames['full-screen-toggle']} ${this.styleNames.icon}`,
      'data-hook': 'full-screen-button'
    });

    this.$node
      .append(this.$toggleFullScreenControl);

    this.setState({ isInFullScreen: false });
    this._bindEvents();
  }

  _bindEvents() {
    this.$toggleFullScreenControl[0].addEventListener('click', this._callbacks.onToggleFullScreenButtonClick);
  }

  _unbindEvents() {
    this.$toggleFullScreenControl[0].removeEventListener('click', this._callbacks.onToggleFullScreenButtonClick);
  }

  setState({ isInFullScreen }) {
    this.$toggleFullScreenControl.toggleClass(this.styleNames['in-full-screen'], isInFullScreen);
    this.$node.attr('data-tooltip', isInFullScreen ? this.translations.exitFullScreen : this.translations.enterFullScreen);
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
FullScreenView.extendTranslations(translations);

export default FullScreenView;
