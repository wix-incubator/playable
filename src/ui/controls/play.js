import $ from 'jbone';

import UI_EVENTS from '../../constants/events/ui';

import eventEmitter from '../../event-emitter';

import styles from '../ui.css';

import playIconSVG from '../../static/svg/controls/play-icon.svg';
import pauseIconSVG from '../../static/svg/controls/pause-icon.svg';

export default function createPlayControl() {
  const $playButton = $('<div>', {
    class: styles['play-control']
  });

  const $playIcon = $('<img>', {
    class: `${styles['play-icon']} ${styles.icon}`,
    src: playIconSVG
  });

  $playIcon.on('click', () => eventEmitter.emit(UI_EVENTS.PLAY_TRIGGERED));

  const $pauseIcon = $('<img>', {
    class: `${styles['pause-icon']} ${styles.icon}`,
    src: pauseIconSVG
  });

  $pauseIcon.on('click', () => eventEmitter.emit(UI_EVENTS.PAUSE_TRIGGERED));

  $playButton
    .append($pauseIcon)
    .append($playIcon);

  return {
    $control: $playButton
  };
}
