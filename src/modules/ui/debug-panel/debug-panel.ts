import { MediaStreamDeliveryPriority } from '../../../constants';
import View from './debug-panel.view';

import { KEYCODES } from '../../../utils/keyboard-interceptor';

const UPDATE_TIME = 1000;

export default class DebugPanel {
  static moduleName = 'debugPanel';
  static View = View;
  static dependencies = ['engine', 'rootContainer', 'keyboardControl'];

  private _engine;

  private _interval;

  view: View;
  isHidden: boolean;

  constructor({ engine, rootContainer, keyboardControl }) {
    this._engine = engine;

    this._bindCallbacks();
    this._initUI();

    this.hide();

    rootContainer.appendComponentNode(this.node);

    keyboardControl.addKeyControl(KEYCODES.DEBUG_KEY, this._keyControlCallback);
  }

  private _keyControlCallback(e) {
    if (e.ctrlKey && e.shiftKey) {
      this.show();
    }
  }

  get node() {
    return this.view.getNode();
  }

  _initUI() {
    this.view = new View({
      callbacks: {
        onCloseButtonClick: this.hide,
      },
    });
  }

  _bindCallbacks() {
    this.updateInfo = this.updateInfo.bind(this);
    this.hide = this.hide.bind(this);
    this._keyControlCallback = this._keyControlCallback.bind(this);
  }

  getDebugInfo() {
    const {
      url,
      type,
      deliveryPriority,
      currentBitrate,
      overallBufferLength,
      nearestBufferSegInfo,
      viewDimensions,
      currentTime,
      duration,
      loadingStateTimestamps,
    } = this._engine.getDebugInfo();

    return {
      url,
      type,
      deliveryPriority: MediaStreamDeliveryPriority[deliveryPriority],
      currentBitrate,
      overallBufferLength,
      nearestBufferSegInfo,
      viewDimensions,
      currentTime,
      duration,
      loadingStateTimestamps,
    };
  }

  updateInfo() {
    this.view.setInfo(this.getDebugInfo());
  }

  setUpdateInterval() {
    this.clearUpdateInterval();
    this._interval = setInterval(this.updateInfo, UPDATE_TIME);
  }

  clearUpdateInterval() {
    clearInterval(this._interval);
  }

  show() {
    if (this.isHidden) {
      this.updateInfo();
      this.setUpdateInterval();
      this.view.show();
      this.isHidden = false;
    }
  }

  hide() {
    if (!this.isHidden) {
      this.clearUpdateInterval();
      this.view.hide();
      this.isHidden = true;
    }
  }

  destroy() {
    this.clearUpdateInterval();

    this.view.destroy();
    this.view = null;
  }
}
