import $ from 'jbone';

import { TEXT_LABELS } from '../../../../constants/index';

import View from '../../core/view';

import styles from './play.scss';


const DATA_HOOK_ATTRIBUTE = 'data-hook';
const DATA_HOOK_CONTROL_VALUE = 'playback-control';
const DATA_HOOK_BUTTON_VALUE = 'toggle-playback-button';

const DATA_IS_PLAYING = 'data-is-playing';

class PlayView extends View {
  constructor(config) {
    super(config);
    const { callbacks, texts } = config;

    this._callbacks = callbacks;
    this._texts = texts;

    this.$node = $('<div>', {
      class: this.styleNames['play-control'],
      [DATA_HOOK_ATTRIBUTE]: DATA_HOOK_CONTROL_VALUE,
      [DATA_IS_PLAYING]: false
    });

    this.$playbackControl = $('<button>', {
      class: `${this.styleNames['playback-toggle']} ${this.styleNames['control-button']}`,
      [DATA_HOOK_ATTRIBUTE]: DATA_HOOK_BUTTON_VALUE,
      'aria-label': this._texts.get(TEXT_LABELS.PLAY_CONTROL_LABEL),
      type: 'button',
      tabIndex: 0
    });

    this.$node
      .append(this.$playbackControl);

    this._bindEvents();
  }

  _bindEvents() {
    this._onButtonClick = this._onButtonClick.bind(this);

    this.$playbackControl[0].addEventListener('click', this._onButtonClick);
  }

  _unbindEvents() {
    this.$playbackControl[0].removeEventListener('click', this._onButtonClick);
  }

  _onButtonClick() {
    this.$playbackControl[0].focus();
    this._callbacks.onTogglePlaybackButtonClick();
  }

  setState({ isPlaying }) {
    this.$playbackControl.toggleClass(this.styleNames.paused, !isPlaying);
    this.$node.attr(DATA_IS_PLAYING, isPlaying);
    this.$playbackControl.attr('aria-label',
      isPlaying ?
      this._texts.get(TEXT_LABELS.PAUSE_CONTROL_LABEL) :
      this._texts.get(TEXT_LABELS.PLAY_CONTROL_LABEL)
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

  destroy() {
    this._unbindEvents();
    this.$node.remove();

    delete this.$playbackControl;
    delete this.$node;
    delete this._texts;
  }
}

PlayView.extendStyleNames(styles);

export default PlayView;
