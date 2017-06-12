import { iPhone, iPod, iPad } from '../utils/device-detection';
import DesktopFullScreen from '../utils/full-screen/desktop';
import IOSFullScreen from '../utils/full-screen/ios';

import UI_EVENTS from '../constants/events/ui';


export default class FullScreen {
  constructor({ eventEmitter, engine, ui }) {
    this._eventEmitter = eventEmitter;

    this._onChange = this._onChange.bind(this);

    if (iPhone || iPod || iPad) {
      this._helper = new IOSFullScreen(engine.getNode(), this._onChange);
    } else {
      this._helper = new DesktopFullScreen(ui.view.getNode(), this._onChange);
    }

    this._bindEvents();
  }

  _onChange() {
    this._eventEmitter.emit(UI_EVENTS.FULLSCREEN_STATUS_CHANGED, this._helper.isInFullScreen);
  }

  _bindEvents() {
    this._eventEmitter.on(UI_EVENTS.FULLSCREEN_ENTER_TRIGGERED, this.enterFullScreen, this);
    this._eventEmitter.on(UI_EVENTS.FULLSCREEN_EXIT_TRIGGERED, this.exitFullScreen, this);
  }

  _unbindEvents() {
    this._eventEmitter.off(UI_EVENTS.FULLSCREEN_ENTER_TRIGGERED, this.enterFullScreen, this);
    this._eventEmitter.off(UI_EVENTS.FULLSCREEN_EXIT_TRIGGERED, this.exitFullScreen, this);
  }

  enterFullScreen() {
    this._helper.request();
  }

  exitFullScreen() {
    this._helper.exit();
  }

  destroy() {
    this._unbindEvents();

    this._helper.destroy();
  }
}
