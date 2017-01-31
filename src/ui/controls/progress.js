import $ from 'jbone';

import UI_EVENTS from '../../constants/events/ui';

import eventEmitter from '../../event-emitter';

import styles from '../ui.css';

export default function createSeekControl() {
  let controlling = false;

  const $seek = $('<span>', {
    class: styles['progress-bar']
  });

  const $played = $('<progress>', {
    class: styles['progress-played'],
    role: 'played',
    max: 100,
    value: 0
  });

  const $buffered = $('<progress>', {
    class: styles['progress-buffered'],
    role: 'buffered',
    max: 100,
    value: 0
  });

  const $input = $('<input>', {
    class: styles['seek-input'],
    id: 'seek-input',
    type: 'range',
    min: 0,
    max: 100,
    step: 0.1,
    value: 0
  })
    .on('input', function () {
      eventEmitter.emit(UI_EVENTS.PROGRESS_CHANGE_TRIGGERED, $input.val() / $input.attr('max'));
      $played.attr('value', $input.val());
    })
    .on('mousedown', () => (controlling = true))
    .on('mouseup', () => (controlling = false));

  $seek
    .append($input)
    .append($buffered)
    .append($played);

  function updatePlayed(percent) {
    if (!controlling) {
      $input.val(percent);
      $input.attr('value', percent);
      $played.attr('value', percent);
    }
  }

  function updateBuffered(percent) {
    $buffered.attr('value', percent);
  }

  eventEmitter.on(UI_EVENTS.UPDATE_PLAYED_TRIGGERED, updatePlayed);
  eventEmitter.on(UI_EVENTS.UPDATE_BUFFERED_TRIGGERED, updateBuffered);

  return {
    $control: $seek
  };
}
