import * as $ from 'jbone';

import { TEXT_LABELS } from '../../../../constants/index';

import View from '../../core/view';

import * as styles from './progress.scss';

const DATA_HOOK_ATTRIBUTE = 'data-hook';
const DATA_HOOK_CONTROL_VALUE = 'progress-control';
const DATA_HOOK_INPUT_VALUE = 'seek-input';

const DATA_PLAYED = 'data-played-percent';

class ProgressView extends View {
  private _callbacks;
  private _texts;

  $node;
  $progressPlayed;
  $progressBuffered;
  $progressBackground;
  $input;

  constructor(config) {
    super(config);
    const { callbacks, texts } = config;

    this._callbacks = callbacks;
    this._texts = texts;
    this.$node = $('<div>', {
      class: this.styleNames['seek-block'],
      [DATA_HOOK_ATTRIBUTE]: DATA_HOOK_CONTROL_VALUE,
      [DATA_PLAYED]: 0,
    });

    this.$progressPlayed = $('<div>', {
      class: `${this.styleNames['progress-bar']} ${
        this.styleNames['progress-played']
      }`,
    });

    this.$progressBuffered = $('<div>', {
      class: `${this.styleNames['progress-bar']} ${
        this.styleNames['progress-buffered']
      }`,
    });

    this.$progressBackground = $('<div>', {
      class: `${this.styleNames['progress-bar']} ${
        this.styleNames['progress-background']
      }`,
    });

    this.$input = $('<input>', {
      class: this.styleNames['seek-control'],
      [DATA_HOOK_ATTRIBUTE]: DATA_HOOK_INPUT_VALUE,
      'aria-label': this._texts.get(TEXT_LABELS.PROGRESS_CONTROL_LABEL),
      'aria-valuemin': 0,
      'aria-valuenow': 0,
      'aria-valuemax': 100,
      type: 'range',
      min: 0,
      max: 100,
      step: 0.1,
      value: 0,
    });

    this.$node
      .append(this.$input)
      .append(this.$progressPlayed)
      .append(this.$progressBuffered)
      .append(this.$progressBackground);

    this._bindCallbacks();
    this._bindEvents();
  }

  _onMouseInteractionStart(e) {
    if (e.button > 1) {
      return;
    }

    this._callbacks.onUserInteractionStart();
  }

  _onMouseInteractionEnd(e) {
    if (e.button > 1) {
      return;
    }

    this._callbacks.onUserInteractionEnd();
  }

  _onInputValueChange() {
    const value = this.$input.val();
    this._updateDOMAttributes(value);
    this._callbacks.onChangePlayedProgress(value);
  }

  _bindCallbacks() {
    this._onMouseInteractionStart = this._onMouseInteractionStart.bind(this);
    this._onMouseInteractionEnd = this._onMouseInteractionEnd.bind(this);
    this._onInputValueChange = this._onInputValueChange.bind(this);
  }

  _bindEvents() {
    this.$input[0].addEventListener('input', this._onInputValueChange);
    this.$input[0].addEventListener('change', this._onInputValueChange);

    this.$node[0].addEventListener('mousedown', this._onMouseInteractionStart);
    this.$node[0].addEventListener('mouseup', this._onMouseInteractionEnd);
  }

  _unbindEvents() {
    this.$input[0].removeEventListener('input', this._onInputValueChange);
    this.$input[0].removeEventListener('change', this._onInputValueChange);

    this.$node[0].removeEventListener(
      'mousedown',
      this._onMouseInteractionStart,
    );
    this.$node[0].removeEventListener('mouseup', this._onMouseInteractionEnd);
  }

  _updateDOMAttributes(percent) {
    this.$input.attr('value', percent);
    this.$input.attr(
      'aria-valuetext',
      this._texts.get(TEXT_LABELS.PROGRESS_CONTROL_VALUE, { percent }),
    );
    this.$input.attr('aria-valuenow', percent);

    this.$node.attr(DATA_PLAYED, percent);
    this.$progressPlayed.attr('style', `width:${percent}%;`);
  }

  _updatePlayed(percent) {
    this.$input.val(percent);
    this._updateDOMAttributes(percent);
  }

  _updateBuffered(percent) {
    this.$progressBuffered.attr('style', `width:${percent}%;`);
  }

  setState({ played, buffered }: { played?: number; buffered?: number }) {
    played !== undefined && this._updatePlayed(played);
    buffered !== undefined && this._updateBuffered(buffered);
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

    delete this.$input;
    delete this.$progressPlayed;
    delete this.$progressBuffered;
    delete this.$progressBackground;
    delete this.$node;

    delete this._texts;
  }
}

ProgressView.extendStyleNames(styles);

export default ProgressView;
