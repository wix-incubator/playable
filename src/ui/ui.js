import playIcon from '../controls/play-icon.html';
import pauseIcon from '../controls/pause-icon.html';


function getUI(config) {
  const { onPlayClick, onPauseClick } = config;
  const _wrapper = createWrapper();
  const _controls = createControls();

  _wrapper.appendChild(_controls);

  return _wrapper;

  function createWrapper() {
    const wrapper = document.createElement('div');
    wrapper.setAttribute('class', 'video-wrapper');

    return wrapper;
  }

  function createControls() {
    const wrapper = document.createElement('div');
    wrapper.setAttribute('class', 'controls-wrapper');

    const background = document.createElement('div');
    background.setAttribute('class', 'controls-background');

    const innerWrapper = document.createElement('div');
    innerWrapper.setAttribute('class', 'controls');

    const controlRow = document.createElement('div');
    controlRow.setAttribute('class', 'controls-row');

    controlRow.appendChild(createPlayControl());

    innerWrapper.appendChild(controlRow);

    wrapper.appendChild(background);
    wrapper.appendChild(innerWrapper);

    return wrapper;
  }

  function createPlayControl() {
    const _playButton = document.createElement('div');
    _playButton.setAttribute('class', 'play');

    const _playIcon = document.createElement('div');
    _playIcon.setAttribute('class', 'play-icon icon');
    _playIcon.innerHTML = playIcon;
    _playIcon.addEventListener('click', playVideo);

    const _pauseIcon = document.createElement('div');
    _pauseIcon.setAttribute('class', 'pause-icon icon');
    _pauseIcon.innerHTML = pauseIcon;
    _pauseIcon.addEventListener('click', pauseVideo);

    _playButton.appendChild(_playIcon);
    _playButton.appendChild(_pauseIcon);

    return _playButton;
  }

  function playVideo() {
    onPlayClick();
    _wrapper.classList.toggle('video-playing');
  }

  function pauseVideo() {
    onPauseClick();
    _wrapper.classList.toggle('video-playing');
  }

}

export default getUI;
