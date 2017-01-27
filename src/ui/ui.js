import playIcon from '../controls/play-icon.html';
import pauseIcon from '../controls/pause-icon.html';
import styles from 'app.css';


function getUI(config) {
  const { onPlayClick, onPauseClick } = config;
  const _wrapper = createWrapper();
  const _controls = createControls();

  _wrapper.appendChild(_controls);

  return _wrapper;

  function createWrapper() {
    const wrapper = document.createElement('div');
    wrapper.setAttribute('class', styles['video-wrapper']);
    return wrapper;
  }

  function createControls() {
    const wrapper = document.createElement('div');
    wrapper.setAttribute('class', styles['controls-wrapper']);

    const background = document.createElement('div');
    background.setAttribute('class', styles['controls-background']);

    const innerWrapper = document.createElement('div');
    innerWrapper.setAttribute('class', styles['controls']);

    const controlRow = document.createElement('div');
    controlRow.setAttribute('class', styles['controls-row']);

    controlRow.appendChild(createPlayControl());

    innerWrapper.appendChild(controlRow);

    wrapper.appendChild(background);
    wrapper.appendChild(innerWrapper);

    return wrapper;
  }

  function createPlayControl() {
    const _playButton = document.createElement('div');
    _playButton.setAttribute('class', styles['play']);

    const _playIcon = document.createElement('div');
    _playIcon.setAttribute('class', `${styles['play-icon']} ${styles['icon']}`);
    _playIcon.innerHTML = playIcon;
    _playIcon.addEventListener('click', playVideo);

    const _pauseIcon = document.createElement('div');
    _pauseIcon.setAttribute('class', `${styles['pause-icon']} ${styles['icon']}`);
    _pauseIcon.innerHTML = pauseIcon;
    _pauseIcon.addEventListener('click', pauseVideo);

    _playButton.appendChild(_playIcon);
    _playButton.appendChild(_pauseIcon);

    return _playButton;
  }

  function playVideo() {
    onPlayClick();
    _wrapper.classList.toggle(styles['video-playing']);
  }

  function pauseVideo() {
    onPauseClick();
    _wrapper.classList.toggle(styles['video-playing']);
  }

}

export default getUI;
