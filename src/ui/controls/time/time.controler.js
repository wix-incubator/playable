import View from './time.view';


export default class TimeControl {
  constructor({ view }) {
    this._initUI(view);

    this.setCurrentTime(0);
    this.setDurationTime(0);
  }

  get node() {
    return this.view.getNode();
  }

  _initUI(view) {
    if (view) {
      this.view = new view();
    } else {
      this.view = new View();
    }
  }

  setDurationTime(time) {
    this.view.setDurationTime(time);
  }

  setCurrentTime(time) {
    this.view.setCurrentTime(time);
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

    delete this.isHidden;
  }
}
