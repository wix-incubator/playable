import { iPhone, iPod, iPad } from '../utils/device-detection';
import DesktopFullScreen from './desktop';
import IOSFullScreen from './ios';

import UI_EVENTS from '../constants/events/ui';
import VIDEO_EVENTS from '../constants/events/video';


export default class FullScreenManager {
  constructor({ eventEmitter, engine, ui }) {
    this._eventEmitter = eventEmitter;
    this._engine = engine;

    this._onChange = this._onChange.bind(this);

    if (iPhone || iPod || iPad) {
      this._helper = new IOSFullScreen(this._engine.getNode(), this._onChange);
    } else {
      this._helper = new DesktopFullScreen(ui.view.getNode(), this._onChange);
    }

    this._bindEvents();
  }

  _onChange() {
    this._eventEmitter.emit(UI_EVENTS.FULLSCREEN_STATUS_CHANGED, this._helper.isInFullScreen);
  }

  _bindEvents() {
    this._eventEmitter.on(VIDEO_EVENTS.STATE_CHANGED, this._closeOnEndState, this);
    this._eventEmitter.on(UI_EVENTS.FULLSCREEN_ENTER_TRIGGERED, this.enterFullScreen, this);
    this._eventEmitter.on(UI_EVENTS.FULLSCREEN_EXIT_TRIGGERED, this.exitFullScreen, this);
  }

  _unbindEvents() {
    this._eventEmitter.off(VIDEO_EVENTS.STATE_CHANGED, this._closeOnEndState, this);
    this._eventEmitter.off(UI_EVENTS.FULLSCREEN_ENTER_TRIGGERED, this.enterFullScreen, this);
    this._eventEmitter.off(UI_EVENTS.FULLSCREEN_EXIT_TRIGGERED, this.exitFullScreen, this);
  }

  _closeOnEndState({ nextState }) {
    if (nextState === this._engine.STATES.ENDED && this.isInFullScreen) {
      this.exitFullScreen();
    }
  }

  enterFullScreen() {
    this._helper.request();
  }

  exitFullScreen() {
    this._helper.exit();
  }

  get isInFullScreen() {
    return this._helper.isInFullScreen;
  }

  destroy() {
    this._unbindEvents();

    this._helper.destroy();
  }
}
