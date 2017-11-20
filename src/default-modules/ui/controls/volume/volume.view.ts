import * as $ from 'jbone';

import { TEXT_LABELS } from '../../../../constants/index';

import View from '../../core/view';

import * as styles from './volume.scss';

const DATA_HOOK_ATTRIBUTE = 'data-hook';
const DATA_HOOK_CONTROL_VALUE = 'volume-control';
const DATA_HOOK_BUTTON_VALUE = 'mute-button';
const DATA_HOOK_INPUT_VALUE = 'volume-input';
const DATA_HOOK_INPUT_CONTAINER = 'volume-input-container';

const DATA_IS_MUTED = 'data-is-muted';
const DATA_VOLUME = 'data-volume-percent';

const MAX_VOLUME_ICON_RANGE = 30;

class VolumeView extends View {
  private _callbacks;
  private _texts;

  $node;
  $muteControl;
  $container;
  $content;
  $inputWrapper;
  $filledProgress;
  $input;

  constructor(config) {
    super(config);
    const { callbacks, texts } = config;

    this._callbacks = callbacks;
    this._texts = texts;

    this.$node = $('<div>', {
      class: this.styleNames['volume-control'],
      [DATA_HOOK_ATTRIBUTE]: DATA_HOOK_CONTROL_VALUE,
      [DATA_VOLUME]: 100,
      [DATA_IS_MUTED]: false,
    });

    this.$muteControl = $('<button>', {
      class: `${this.styleNames['mute-button']} ${
        this.styleNames['control-button']
      }`,
      [DATA_HOOK_ATTRIBUTE]: DATA_HOOK_BUTTON_VALUE,
      'aria-label': this._texts.get(TEXT_LABELS.MUTE_CONTROL_LABEL),
      type: 'button',
      tabIndex: 0,
    });

    this.$container = $('<div>', {
      class: this.styleNames.container,
      [DATA_HOOK_ATTRIBUTE]: DATA_HOOK_INPUT_CONTAINER,
    });

    const $content = $('<div>', {
      class: this.styleNames.content,
    });

    const $inputWrapper = $('<div>', {
      class: this.styleNames['input-wrapper'],
    });

    this.$filledProgress = $('<div>', {
      class: this.styleNames['filled-progress'],
    });

    this.$input = $('<input>', {
      class: `${this.styleNames['volume-input']}`,
      [DATA_HOOK_ATTRIBUTE]: DATA_HOOK_INPUT_VALUE,
      'aria-label': this._texts.get(TEXT_LABELS.VOLUME_CONTROL_LABEL),
      'aria-valuemin': 0,
      'aria-valuenow': 0,
      'aria-valuemax': 100,
      tabIndex: 0,
      orient: 'vertical',
      type: 'range',
      min: 0,
      max: 100,
      step: 1,
      value: 0,
    });

    $inputWrapper.append(this.$filledProgress).append(this.$input);

    $content.append($inputWrapper);
    this.$container.append($content);

    this.$node.append(this.$muteControl).append(this.$container);

    this._bindEvents();
  }

  _onInputChange() {
    this._callbacks.onVolumeLevelChangeFromInput(this.$input.val());
  }

  _onWheel(e) {
    e.preventDefault();

    if (!e.deltaY) {
      return;
    }

    this._callbacks.onVolumeLevelChangeFromWheel(e.deltaY);
  }

  _preventClickPropagation(event) {
    event.stopPropagation();
  }

  _bindEvents() {
    this._onInputChange = this._onInputChange.bind(this);
    this._onWheel = this._onWheel.bind(this);
    this._onButtonClick = this._onButtonClick.bind(this);

    this.$node[0].addEventListener('wheel', this._onWheel);

    this.$container[0].addEventListener('click', this._preventClickPropagation);

    this.$input[0].addEventListener('change', this._onInputChange);

    this.$input[0].addEventListener('input', this._onInputChange);

    this.$muteControl[0].addEventListener('click', this._onButtonClick);
  }

  _onButtonClick() {
    this.$muteControl[0].focus();
    this._callbacks.onToggleMuteClick();
  }

  _unbindEvents() {
    this.$node[0].removeEventListener('wheel', this._onWheel);

    this.$container[0].removeEventListener(
      'click',
      this._preventClickPropagation,
    );

    this.$input[0].removeEventListener('change', this._onInputChange);

    this.$input[0].removeEventListener('input', this._onInputChange);

    this.$muteControl[0].removeEventListener('click', this._onButtonClick);
  }

  setState({ volume, isMuted }) {
    volume !== undefined && this._setVolumeLevel(volume);
    isMuted !== undefined && this._setMuteStatus(isMuted);
  }

  _setVolumeLevel(volume) {
    this.$input.val(volume);
    this.$input.attr('value', volume);
    this.$input.attr(
      'aria-valuetext',
      this._texts.get(TEXT_LABELS.VOLUME_CONTROL_VALUE, { volume }),
    );
    this.$input.attr('aria-valuenow', volume);

    this.$filledProgress.attr('style', `height:${volume}%;`);

    this.$node.attr(DATA_VOLUME, volume);

    if (volume >= MAX_VOLUME_ICON_RANGE) {
      this.$muteControl.toggleClass(this.styleNames['half-volume'], false);
    } else {
      this.$muteControl.toggleClass(this.styleNames['half-volume'], true);
    }
  }

  _setMuteStatus(isMuted) {
    this.$muteControl.toggleClass(this.styleNames.muted, isMuted);
    this.$node.attr(DATA_IS_MUTED, isMuted);
    this.$muteControl.attr(
      'aria-label',
      isMuted
        ? this._texts.get(TEXT_LABELS.UNMUTE_CONTROL_LABEL)
        : this._texts.get(TEXT_LABELS.MUTE_CONTROL_LABEL),
    );
  }

  show() {
    this.$node.toggleClass(styles.hidden, false);
  }

  hide() {
    this.$node.toggleClass(styles.hidden, true);
  }

  getNode() {
    return this.$node[0];
  }

  destroy() {
    this._unbindEvents();
    this.$node.remove();

    delete this.$input;
    delete this.$muteControl;
    delete this.$filledProgress;
    delete this.$container;
    delete this.$node;

    delete this._texts;
  }
}

VolumeView.extendStyleNames(styles);

export default VolumeView;
