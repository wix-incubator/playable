import $ from 'jbone';

import playIconSVG from '../controls/play-icon.svg';
import pauseIconSVG from '../controls/pause-icon.svg';

import styles from 'app.css';


function getUI(config) {
  const {
    onPlayClick,
    onPauseClick,
    videoNode
  } = config;
  const wrapper = createWrapper();
  const controls = createControls();

  wrapper.append(videoNode);
  wrapper.append(controls);

  return wrapper;

  function createWrapper() {
    const wrapper = $('<div>', {
      'class': styles['video-wrapper']
    });

    return wrapper;
  }

  function createControls() {
    const wrapper = $('<div>', {
      'class': styles['controls-wrapper']
    });

    const background = $('<div>', {
      'class': styles['controls-background']
    });

    const innerWrapper = $('<div>', {
      'class': styles['controls']
    });

    const controlRow = $('<div>', {
      'class': styles['controls-row']
    });

    const playControl = createPlayControl();

    controlRow.append(playControl);

    innerWrapper.append(controlRow);

    wrapper.append(background);
    wrapper.append(innerWrapper);

    return wrapper;
  }

  function createPlayControl() {
    const playButton = $('<div>', {
      'class': styles['play-control']
    });

    const playIcon = $('<img>', {
      'class': `${styles['play-icon']} ${styles['icon']}`,
      src: playIconSVG
    });

    playIcon.on('click', playVideo);

    const pauseIcon = $('<img>', {
      'class': `${styles['pause-icon']} ${styles['icon']}`,
      src: pauseIconSVG
    });

    pauseIcon.on('click', pauseVideo);

    playButton.append(playIcon);
    playButton.append(pauseIcon);

    return playButton;
  }

  function playVideo() {
    onPlayClick();
    wrapper.toggleClass(styles['video-playing'], true);
  }

  function pauseVideo() {
    onPauseClick();
    wrapper.toggleClass(styles['video-playing'], false);
  }

}

export default getUI;
