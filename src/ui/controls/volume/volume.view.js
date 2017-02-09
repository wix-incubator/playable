import $ from 'jbone';

import volumeSVG from './svg/volume.svg';
import volumeMutedSVG from './svg/volume-muted.svg';

import styles from './volume.scss';


export default class VolumeView {
  constructor() {
    this.$node = $('<div>', {
      class: styles['volume-control']
    });

    this.$volumeIcon = $('<img>', {
      class: `${styles['volume-icon']} ${styles.icon}`,
      src: volumeSVG
    });

    this.$volumeMutedIcon = $('<img>', {
      class: `${styles['volume-icon']} ${styles.icon}`,
      src: volumeMutedSVG
    });

    const $innerWrapper = $('<div>', {
      class: styles['volume-inner-wrapper']
    });

    const $inputWrapper = $('<div>', {
      class: styles['volume-input-wrapper']
    });

    this.$volumeLevel = $('<progress>', {
      class: styles['volume-level'],
      role: 'played',
      max: 100,
      value: 0
    });

    this.$input = $('<input>', {
      class: styles['volume-input'],
      id: 'volume-input',
      type: 'range',
      min: 0,
      max: 100,
      step: 0.1,
      value: 0
    });

    $inputWrapper
      .append(this.$input)
      .append(this.$volumeLevel);

    $innerWrapper.append($inputWrapper);

    this.$node
      .append(this.$volumeIcon)
      .append(this.$volumeMutedIcon)
      .append($innerWrapper);
  }
}
