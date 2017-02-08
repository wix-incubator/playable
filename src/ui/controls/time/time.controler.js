import View from './time.view';


export default class TimeControl {
  constructor() {
    this._initUI();

    this.setCurrentTime(0);
    this.setDurationTime(0);
  }

  get node() {
    return this.view.$node;
  }

  _formatTime(seconds) {
    const date = new Date(null);
    seconds = isNaN(seconds) || !isFinite(seconds) ? 0 : Math.floor(seconds);
    date.setSeconds(seconds);

    // get HH:mm:ss part, remove hours if they are "00:"
    return date
      .toISOString()
      .substr(11, 8)
      .replace(/^00:/, '');
  }

  _initUI() {
    this.view = new View();
  }

  setDurationTime(time) {
    this.view.$durationTime.html(this._formatTime(time));
  }

  setCurrentTime(time) {
    this.view.$currentTime.html(this._formatTime(time));
  }
}
