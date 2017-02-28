import View from './volume.view';


export default class VolumeControl {
  constructor({ onVolumeLevelChange, onMuteStatusChange, view }) {
    this.isMuted = false;
    this.volumeLevel = 100;

    this._callbacks = {
      onVolumeLevelChange,
      onMuteStatusChange
    };

    this._bindCallbacks();

    this._initUI(view);

    this.view.setVolumeLevel(this.volumeLevel);
    this.view.setMuteStatus(this.isMuted);
  }

  get node() {
    return this.view.getNode();
  }

  _initUI(view) {
    const config = {
      callbacks: {
        onVolumeLevelChangeFromInput: this._getVolumeLevelFromInput,
        onVolumeLevelChangeFromWheel: this._getVolumeLevelFromWheel,
        onMuteStatusChange: this._callMuteChangeCallback
      }
    };

    if (view) {
      this.view = new view(config);
    } else {
      this.view = new View(config);
    }
  }

  _bindCallbacks() {
    this._getVolumeLevelFromInput = this._getVolumeLevelFromInput.bind(this);
    this._callMuteChangeCallback = this._callMuteChangeCallback.bind(this);
    this._getVolumeLevelFromWheel = this._getVolumeLevelFromWheel.bind(this);
  }

  _convertVolumeLevelToVideoVolume(level) {
    return level / 100;
  }

  _convertVideoVolumeToVolumeLevel(level) {
    return level * 100;
  }

  _getVolumeLevelFromWheel(delta) {
    const adjustedVolume = this.volumeLevel + delta / 10;
    const validatedVolume = Math.min(100, Math.max(0, adjustedVolume));

    this._callVolumeChangeCallback(validatedVolume);
  }

  _getVolumeLevelFromInput(level) {
    this._callVolumeChangeCallback(level);
  }

  _callVolumeChangeCallback(level) {
    this._callbacks.onVolumeLevelChange(this._convertVolumeLevelToVideoVolume(level));
    if (this.isMuted) {
      this._callbacks.onMuteStatusChange(!this.isMuted);
    }
  }

  _callMuteChangeCallback() {
    this._callbacks.onMuteStatusChange(!this.isMuted);
  }

  setVolumeLevel(level) {
    if (level === this.volumeLevel) {
      return;
    }

    this.volumeLevel = this._convertVideoVolumeToVolumeLevel(level);

    this.view.setVolumeLevel(this.volumeLevel);

    if (this.volumeLevel) {
      this.view.setMuteStatus(false);
    } else {
      this.view.setMuteStatus(true);
    }
  }

  setMuteStatus(isMuted) {
    if (isMuted === this.isMuted) {
      return;
    }

    this.isMuted = isMuted;
    this.view.setMuteStatus(this.isMuted || !this.volumeLevel);
    if (this.isMuted) {
      this.view.setVolumeLevel(0);
    } else {
      this.view.setVolumeLevel(this.volumeLevel);
    }
  }

  hide() {
    this.isHidden = true;
    this.view.hide();
  }

  show() {
    this.isHidden = false;
    this.view.show();
  }

  destroy() {
    this.view.destroy();
    delete this.view;

    delete this._callbacks;

    this.isHidden = null;
    this.isMuted = null;
    this.volumeLevel = null;
  }
}
