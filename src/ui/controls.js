import $ from 'jbone';

import VIDEO_EVENTS from '../constants/events/video';

import eventEmitter from '../event-emitter';

import styles from './ui.css';

import playIconSVG from '../static/svg/controls/play-icon.svg';
import pauseIconSVG from '../static/svg/controls/pause-icon.svg';


function createPlayControl() {
  const $playButton = $('<div>', {
    class: styles['play-control']
  });

  const $playIcon = $('<img>', {
    class: `${styles['play-icon']} ${styles.icon}`,
    src: playIconSVG
  });

  $playIcon.on('click', function() {
    eventEmitter.emit(VIDEO_EVENTS.PLAY);
  });

  const $pauseIcon = $('<img>', {
    class: `${styles['pause-icon']} ${styles.icon}`,
    src: pauseIconSVG
  });

  $pauseIcon.on('click', function() {
    eventEmitter.emit(VIDEO_EVENTS.PAUSE);
  });

  $playButton
    .append($pauseIcon)
    .append($playIcon);

  return $playButton;
}

export default function createControls() {
  const $wrapper = $('<div>', {
    class: styles['controls-wrapper']
  });

  const $background = $('<div>', {
    class: styles['controls-background']
  });

  const $innerWrapper = $('<div>', {
    class: styles.controls
  });

  const $controlRow = $('<div>', {
    class: styles['controls-row']
  });

  const $playControl = createPlayControl();

  $controlRow.append($playControl);
  $innerWrapper.append($controlRow);

  $wrapper.append($background);
  $wrapper.append($innerWrapper);

  return $wrapper;
}