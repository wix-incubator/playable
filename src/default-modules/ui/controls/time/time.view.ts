import * as $ from 'jbone';

import View from '../../core/view';

import * as styles from './time.scss';

export function formatTime(seconds) {
  const date = new Date(null);
  seconds = isNaN(seconds) || !isFinite(seconds) ? 0 : Math.floor(seconds);
  date.setSeconds(seconds);

  // get HH:mm:ss part, remove hours if they are "00:"
  return date
    .toISOString()
    .substr(11, 8)
    .replace(/^00:/, '');
}

class TimeView extends View {
  $node;
  $currentTime;
  $divider;
  $durationTime;

  constructor(config?) {
    super(config);

    this.$node = $('<div>', {
      class: this.styleNames['time-wrapper'],
      'data-hook': 'time-control',
    });

    this.$currentTime = $('<span>', {
      class: `${this.styleNames.current} ${this.styleNames.time}`,
      'data-hook': 'current-time-indicator',
    });

    this.$divider = $('<span>', {
      class: this.styleNames.time,
    }).html('/');

    this.$durationTime = $('<span>', {
      class: `${this.styleNames.duration} ${this.styleNames.time}`,
      'data-hook': 'duration-time-indicator',
    });

    this.$node
      .append(this.$currentTime)
      .append(this.$divider)
      .append(this.$durationTime);
  }

  setState({ duration, current }: { duration?: number; current?: number }) {
    duration !== undefined && this._setDurationTime(duration);
    current !== undefined && this._setCurrentTime(current);
  }

  _setDurationTime(duration) {
    this.$durationTime.html(formatTime(duration));
  }

  _setCurrentTime(current) {
    this.$currentTime.html(formatTime(current));
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
    this.$node.remove();

    delete this.$currentTime;
    delete this.$divider;
    delete this.$durationTime;
    delete this.$node;
  }
}

TimeView.extendStyleNames(styles);

export default TimeView;
